# Design

## Context

Scramble Challenge (Flask) keeps the skin in a cookie the server reads; Timer App PR Tracker is a static page like Puzzle Trainer and keeps it in `localStorage` with a small classic script, `static/js/skin.js`. Both use the same six skins, each a folder `themes/<id>/theme.css` that sets CSS custom properties plus a few decorative rules, with the gear menu built from `<details class="skin-picker">`.

Puzzle Trainer is a static Vite site served by nginx, with hash routes, so Timer App PR Tracker's approach fits directly.

## Decisions

### Copy Timer App PR Tracker's mechanism
`public/skin.js` is a near-copy of the tracker's `skin.js`: the same `SKINS` list of `[id, label]` pairs, default `plain`, `chooseSkin` / `readSkin` / `saveSkin` / `themeHref`, a `<link id="skin-css">` added in the head before first paint, and the menu buttons built on `DOMContentLoaded`. Its logic is exposed on `globalThis.PuzzleSkins` so Vitest can test it. Differences: the storage key is `puzzle-trainer-skin`, theme paths are relative (`themes/<id>/theme.css`, because the build uses relative paths), and the chart-only `skinchange` event is dropped (nothing here needs to redraw). Alternative considered: a TypeScript module in `src/`. Module scripts run after parsing, which would flash the default skin on every load, so the classic head script wins.

### Files live in `public/`
Vite copies `public/` into `dist/` unchanged, so `skin.js` and `themes/` keep stable paths the script can build at run time. nginx's `/assets/` immutable caching does not apply to them; they get the site's `no-cache`, which is fine for files this small. `Dockerfile` adds `COPY public public` to the build stage.

### The gear menu sits outside `#app`
The router replaces `#app`'s content on every route change, so the `<details class="skin-picker">` goes in `index.html` beside `<main id="app">`, positioned at the top-right of the page column, and is present on every screen. Screen h1s get right margin so they never run under the gear.

### Shared custom-property names
`src/styles.css` switches to the variables the skins set (`--font`, `--display`, `--ink`, `--muted`, `--line`, `--accent`, `--page`, `--card`, `--field`, `--radius`) instead of its own `--bg`/`--fg`/`--border` and the `prefers-color-scheme` block. Each `theme.css` additionally sets `--on-accent` (text on the primary button), since the other apps have no filled buttons. The tracker's `--chart-*` properties are dropped. Decorative selectors that target the tracker's markup (`figure`, `.upload`, `.controls`) are retargeted to this app's panels (`.scramble`, `.solution`, `.case`) and its `h1`. Fonts, licences and the harbour images are copied byte-for-byte.

### Sticker colours stay fixed
The cube pictures set sticker fills from `src/cube/colours.ts` as SVG attributes, which no skin overrides, so every skin shows the real cube colours.

## Risks / Trade-offs

- Users who relied on automatic dark mode now see Minimal until they pick Dark. Accepted to match the other apps; called out in the proposal.
- Some skins use large or bitmap fonts (Monkey at 22px). The scramble text already wraps and is checked at phone width; `npm run check:mobile` is run for every skin.
- The skins are copies, so a later tweak in one app won't reach the others. Same as today between the two existing apps.
