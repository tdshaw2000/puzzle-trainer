# Proposal: make "Show case" a toggle

## Why

On the Last Two Centres screen, "Show case" only reveals: once the case is shown, the button is disabled and the case stays on screen until the next scramble. The user wants to be able to hide the case again (for example to re-solve the same scramble without the answer in view).

## What Changes

- The "Show case" button becomes a toggle. Selecting it while the case is shown hides the case again; selecting it again shows the same case.
- The button's label follows the state: "Show case" while hidden, "Hide case" while shown. It is never disabled.
- Showing the case still moves focus to the case. Hiding it keeps focus on the button, so it can be pressed again.
- Next (button or space bar) still gives a new scramble with the case hidden and the button reading "Show case".

## Capabilities

### Modified Capabilities

- `l2c-trainer-session`: the "target case can be revealed" requirement now allows hiding the case again.

## Impact

- `src/trainers/l2c/screen.ts` and its DOM tests.
- No change to scramble generation, navigation, or deployment.

## Out of scope

- Remembering the shown/hidden state across scrambles (each new scramble starts hidden, as today).
- Keyboard shortcuts for the toggle.
