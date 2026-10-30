# Proposal: show the solution moves on demand

## Why

After solving (or getting stuck on) a Last Two Centres scramble, the user wants to see how to solve it: just the moves, on their own, without opening the whole case reveal. Today the only alg on screen is the sheet's reference alg inside "Show case", written for the sheet's orientation (sheet U and F), so it has to be mentally translated to a white-down hold and to whatever face turns the scramble added.

## What Changes

- A new "Show solution" button sits next to "Show case". It shows a solution panel with only the moves, in the same large monospace style as the scramble. Nothing else (no picture, case number or face labels).
- The button is a toggle: while the solution is shown it reads "Hide solution" and hides it again. It is independent of "Show case": either, both or neither can be shown.
- The moves are ready to execute straight after the scramble, holding the cube as scrambled (yellow top, green front, white down), with no x or z rotations:
  - first the y rotation that brings the pair to front and right (the same one the case reveal names), if any;
  - then the outer turns that line the two faces up with the sheet's picture;
  - then the sheet's alg rewritten for that hold (e.g. `Rw U Rw'` becomes `Uw F Uw'` or `Dw R Dw'`, depending on which face plays the sheet's top).
- Every new scramble starts with the solution hidden (Next button and space bar).

## Capabilities

### Modified Capabilities

- `l2c-trainer-session`: adds one requirement, "The solution can be shown on demand". No existing requirement text changes, so this stays independent of the in-flight "Show case toggle" change.

## Impact

- New `src/trainers/l2c/solution.ts` (pure function: scramble → solution moves) with simulation tests.
- `src/trainers/l2c/screen.ts`, its DOM tests, `src/styles.css`, `scripts/check-mobile.cjs`.
- No change to scramble generation, the case reveal, navigation or deployment.

## Out of scope

- Shortest or alternative solutions: the solution is always the sheet's alg for the case (plus setup turns), so it matches what the user is learning.
- Lookalike cases' algs in the solution panel (they stay in the case reveal).
- Keyboard shortcuts for the toggle, and remembering shown/hidden across scrambles.
