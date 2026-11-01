# Proposal: 5x5 Last Two Edges trainer

## Why

The user wants to drill the 5x5 last-two-edges (L2E, "5x5 parity") step the same way they drill last two centres. They learn it from the Kewbz guide (https://kewbz.co.uk/blogs/solutions-guides/5x5-last-2-edges): 12 cases, each shown as a top-down picture of the UB and UF edges with one alg. The guide gives the cases no names, so the trainer numbers them 1 to 12 in page order (left to right, top to bottom).

## What Changes

- A second trainer under 5x5, "Last Two Edges", at `#/5x5/l2e`, next to "Last Two Centres".
- Each scramble leaves the cube in one of the 12 guide cases, picked at random. White stays on D and all centres stay solved. Every other edge is paired, but the 3x3-level pieces (corners and paired edges) may be anywhere, as they would be after real edge pairing.
- The colours vary: the two edges in the case are random edges of the cube, with random orientation. The position varies too: the case sits on the U layer with the guide's front edge at UF, UR, UB or UL, so the user may need a y rotation.
- No filler moves. A scramble is the shortest outer-turn setup that brings the chosen edges into place, followed by the case's alg inverted (rewritten for the case's position, with no cube rotations), with redundant moves merged.
- The practice loop matches L2C: the scramble on arrival; a "Show case" / "Hide case" toggle; a "Show solution" / "Hide solution" toggle; and "Next" (also space).
- "Show case" shows a top-down picture of the U layer as it is after the scramble, with only the two case edges coloured. It also shows the y rotation that brings the case to the guide's position, the case number, and the guide's picture of the case (in the case's real colours).
- "Show solution" shows the guide's alg as printed. The exception is case 1: as printed on the page, its alg (`M' U' R' U R' F R F' M`) solves a different case (UF and DF) than the one in its picture. `M U' R' U R' F R F' M'` solves the pictured case. The user chose the corrected alg, shown with a note that the page prints M' ... M.

## Capabilities

### New Capabilities

- `l2e-scramble-generation`: the 12 cases, how a scramble is built, and the case details that come with it.
- `l2e-trainer-session`: the Last Two Edges screen and its practice loop.

### Modified Capabilities

- `trainer-navigation`: the 5x5 group now lists two trainers. The "exactly one trainer" wording changes, and the L2E address is added.

## Impact

- New `src/trainers/l2e/` (cases, scramble, render, screen, with tests), a new entry in `src/app/registry.ts`, and styles. `scripts/check-mobile.cjs` also checks the L2E screen.
- Cube library: the alg parser learns the whole-cube rotations `x`, `y` and `z`, which algs 3 and 6 use. It also learns the guide's token `x'U2` (a missing space).
- No change to L2C behaviour, skins or deployment.

## Out of scope

- Timer and stats.
- Hiding the case among other unsolved pieces, or leaving more than two edges unpaired.
- Translating algs to the user's hold, or alternative algs.
- 6x6/7x7 or other puzzles.
