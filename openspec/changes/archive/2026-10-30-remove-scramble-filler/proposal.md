# Proposal: drop the filler moves from L2C scrambles

## Why

Every L2C scramble starts with 20 random outer-face turns before the moves that set up the case. Outer turns never move centre pieces between faces, so they do nothing for last-two-centres practice; they only mix up edges and corners. The user wants them gone. Disguising which case is coming is explicitly not a goal.

## What Changes

- A scramble becomes just the case setup: the inverse of the sheet alg, rewritten for the chosen pair of side faces, followed by at most one outer turn of each of the two case faces to set their random orientation. Example: `Dw R' Dw' R F2`.
- No other moves: no filler prefix, no D or U outer turns, no turns of the two side faces that are not part of the case.
- An orientation turn that leaves a face's centres looking the same is left out, so no move in the scramble is wasted. Only case 13's sheet-top face is affected today: it looks the same after a half turn, so its orientation turn is reduced to none or a single quarter turn.
- Everything else stays as it is: white on D and yellow on U solved, uniform random case from the 19, random adjacent side-face pair with random top/front roles, random orientation of each case face, and the case details reported with each scramble.

## Capabilities

### Modified Capabilities

- `l2c-scramble-generation`: the "Rest of the cube is scrambled" requirement is removed; a new requirement limits a scramble to the case setup; "Face orientation is randomised" now skips turns that change nothing.

## Impact

- `src/trainers/l2c/scramble.ts` and its tests. Scrambles drop from about 25-30 moves to 3-11.
- No change to the screen, the case reveal, navigation or deployment. The "Show solution" work only reads the sheet alg, so it is unaffected.

## Out of scope

- Shortening the sheet algs themselves or choosing different algs.
- Disguising the case (for example with extra setup moves).
