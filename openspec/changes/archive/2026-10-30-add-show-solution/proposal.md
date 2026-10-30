# Proposal: show the solution moves on demand

## Why

After solving (or getting stuck on) a Last Two Centres scramble, the user wants to see how to solve it: just the moves, on their own, without opening the whole case reveal. Today the sheet's alg is only on screen inside "Show case", mixed in with the case picture and face details.

## What Changes

- A new "Show solution" button sits next to "Show case". It shows a solution panel with only the moves, in the same large monospace style as the scramble. Nothing else (no picture, case number or face labels).
- The button is a toggle: while the solution is shown it reads "Hide solution" and hides it again. It is independent of "Show case": either, both or neither can be shown.
- The moves are the case's alg exactly as printed on the CubeSkills sheet (e.g. `(Rw U Rw') U' (Rw U Rw')`). They are not translated to the scramble's colours or orientation; which faces play the sheet's top and front stays in the case reveal.
- Every new scramble starts with the solution hidden (Next button and space bar).

## Capabilities

### Modified Capabilities

- `l2c-trainer-session`: adds one requirement, "The solution can be shown on demand". No existing requirement text changes, so this stays independent of the in-flight "Show case toggle" change.

## Impact

- `src/trainers/l2c/screen.ts`, its DOM tests, `src/styles.css`, `scripts/check-mobile.cjs`.
- No change to scramble generation, the case reveal, navigation or deployment.

## Out of scope

- Translating the alg to the scramble's hold (y rotation, face turns, rewritten moves), and shortest or alternative solutions: the solution is always the sheet's alg as printed.
- Lookalike cases' algs in the solution panel (they stay in the case reveal).
- Keyboard shortcuts for the toggle, and remembering shown/hidden across scrambles.
