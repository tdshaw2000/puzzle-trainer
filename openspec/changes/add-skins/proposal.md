# Proposal: add skins

## Why

The owner's other apps (Scramble Challenge and Timer App PR Tracker) let you pick a skin from a gear menu. Puzzle Trainer has one fixed look that follows the device's light/dark setting. It should offer the same skins, in the same way, so the apps feel like one family.

## What Changes

- A gear button (⚙) in the top-right corner of every screen opens a "Skin" menu listing the same six skins, in the same order and with the same labels as the other apps: Minimal, Dark, DOS, Mario, Monkey, VHS.
- Picking a skin applies it at once, without reloading or changing the current scramble, marks it with a tick in the menu, and closes the menu. A tap outside the open menu also closes it.
- The choice is remembered on the device (browser storage) and applied before the first paint on later visits, so there is no flash of the wrong skin. If storage is unavailable the skin still changes for the visit.
- A first-time visitor gets Minimal, the default in the other apps. **This replaces today's automatic dark look on devices set to dark mode;** Dark is one tap away in the menu.
- Each skin's colours, fonts and decoration (DOS's dithered desktop and double frames, Mario's sky and hill, Monkey's pixel harbour, VHS's synthwave sun) are carried over from Timer App PR Tracker, with its decorations applied to this app's cards (scramble, solution and case panels) and title.
- Cube sticker colours (yellow, white, green, blue, orange, red and the grey ring) stay the real cube colours in every skin.

## Capabilities

### New Capabilities

- `theming`: picking, applying and remembering a skin.

## Impact

- New: `public/skin.js` (the picker and persistence, a classic script in the page head like Timer App PR Tracker's `skin.js`), `public/themes/<skin>/` (each skin's `theme.css`, fonts with their licences, and Monkey's two harbour images), and Vitest tests for the skin logic and the menu.
- Changed: `index.html` (head script and gear menu), `src/styles.css` (colours and fonts come from the skin's custom properties instead of the built-in light/dark palette), `Dockerfile` (copies `public/` into the build), README.
- No change to scramble generation, the trainer's behaviour, navigation or deployment steps.

## Out of scope

- Wca Records Analyser: it has no skins today, so it gives nothing to match.
- Following the device's dark mode automatically, or an "Auto" skin.
- New skins or per-trainer skins.
