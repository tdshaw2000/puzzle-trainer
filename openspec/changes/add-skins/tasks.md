# Tasks

Every task is test-first: write the failing tests named in the task, then implement until they pass.

## 1. Skin logic

- [x] 1.1 Vitest tests for `public/skin.js`: the skin ids and labels in menu order, default `plain`, `chooseSkin` keeps known ids and falls back for anything else (including `__proto__`), `readSkin`/`saveSkin` round-trip and survive throwing storage, `themeHref` gives `themes/<id>/theme.css`; then write `public/skin.js` to pass them

## 2. Menu

- [x] 2.1 DOM tests (jsdom, with `index.html`'s picker markup): the head script adds `#skin-css` with the remembered skin; the menu lists the six labels in order with the current one marked; selecting an option swaps the stylesheet, saves the choice, moves the mark and closes the menu; a click outside closes it; then add the markup to `index.html` and finish the script
- [x] 2.2 Test that picking a skin while the L2C trainer is mounted leaves its scramble text unchanged

## 3. Skins

- [x] 3.1 Test that each skin folder under `public/themes/` has a `theme.css` that sets every custom property `src/styles.css` uses, and that every `url()` in it points at a file that exists; then copy the six skins, fonts, licences and harbour images from Timer App PR Tracker and adapt their selectors
- [x] 3.2 Move `src/styles.css` onto the shared custom properties and remove the built-in light/dark palette; test that no sticker colour comes from CSS
- [x] 3.3 Add `COPY public public` to the Dockerfile with a deploy test that the build stage copies it; update the README

## 4. Check

- [x] 4.1 Run `npm test`, `npm run build`, `uv run pytest`, and `npm run check:mobile` at phone width under every skin, and screenshot each skin on the L2C screen with the case shown
