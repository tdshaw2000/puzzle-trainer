# Proposal: 4x4 Last Two Edges trainer

## Why

The user wants to drill 4x4 last-two-edges (L2E) the same way they drill the 5x5 steps. They learn it from the CubeSkills sheet "4x4 – Useful Last 2 Edge Algorithms": 5 cases, each shown as a picture of the cube (U, F and R faces) with its alg. The sheet gives the cases no names, so the trainer numbers them 1 to 5 in page order (left to right, top to bottom). Case 1 also lists two alternative algs; the user asked to ignore them.

## What Changes

- A new puzzle group, "4x4", on the home page, after 5x5, with one trainer, "Last Two Edges", at `#/4x4/l2e`.
- Each scramble leaves the cube in one of the 5 sheet cases, picked at random. White stays on D and all centres are solved (on a 4x4, a centre is solved when its four stickers match). Every other edge is paired, but the 3x3-level pieces may be anywhere, as after real edge pairing.
- The case's pieces (two edges per case) are random edges of the cube, with random orientation. The case is also turned to a random y position (none, y, y2 or y'), so the user may need a y rotation to see it as the sheet does.
- No filler moves. A scramble is the shortest outer-turn setup that brings the chosen edges into place, followed by the case's alg inverted (rewritten for the position, with no cube rotations), with redundant moves merged. This is the 5x5 L2E method.
- The practice loop matches the 5x5 trainers: the scramble on arrival; a "Show case" / "Hide case" toggle; a "Show solution" / "Hide solution" toggle; and "Next" (also space). Skins apply as everywhere else. No timer.
- "Show case" shows a picture of the cube after the scramble: the U face with the four side faces folded out around it, green at the bottom, with only the case's pieces coloured. It also shows the y rotation that turns the case to the sheet's view, the case number ("Case N of 5"), and the sheet's picture of the case (the same drawing after the rotation).
- "Show solution" shows the sheet's main alg exactly as printed, including its missing spaces (`U2Rw'`, `F'R`) and `Rw2'`.

All 5 printed algs were checked on a 4x4 simulation: each one, inverted, gives exactly the pictured case, and each solves it with the centres solved and no cube rotation left over. There are no corrections. (The two case 1 alternatives also solve case 1; they are not shown.)

## Capabilities

### New Capabilities

- `4x4-l2e-scramble-generation`: the 5 cases, how a scramble is built, and the case details that come with it.
- `4x4-l2e-trainer-session`: the 4x4 Last Two Edges screen and its practice loop.

### Modified Capabilities

- `trainer-navigation`: the catalogue gains the 4x4 group and its address.

## Impact

- Cube library: the sticker model, edges and alg parser become size-aware (4x4 and 5x5), with the 5x5 behaviour unchanged. On the 4x4, `Rw` is two layers and `x`/`y`/`z` are whole-cube turns. The parser also accepts a move glued after one that ends in ' or 2 (`U2Rw'`, `F'R`).
- The 5x5 L2E case and scramble code is generalised so both trainers share it; the 4x4 trainer supplies its own cases and picture.
- New 4x4 files under `src/trainers/`, a registry entry, styles, README, and `scripts/check-mobile.cjs` covers the new screen.
- No change to the 5x5 trainers' behaviour, skins or deployment.

## Out of scope

- Timer and stats.
- The sheet's alternative algs, or translating algs to another hold.
- Other 4x4 L2E cases not on the sheet (it says it shows a subset).
- Other 4x4 trainers.
