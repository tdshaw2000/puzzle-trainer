# Proposal: 5x5 Last 3 Edges trainer

## Why

The user solves the 5x5 with Hoya. After the centres and the white cross on D, the remaining 8 edges are paired with 3-2-3 edge pairing: three edges, then two, then the last three. The user wants to drill that last stage: a scramble that leaves the cube with everything up to it done and the last 3 edges still to be matched up. There is no alg sheet for this stage, since it is solved intuitively.

## What Changes

- A third trainer under 5x5, "Last 3 Edges", at `#/5x5/l3e`. The 5x5 group lists its trainers in solve order: Last Two Centres, Last 3 Edges, Last Two Edges.
- Each scramble leaves the cube as it is at the start of the last 3-2-3 stage, with the details chosen at random:
  - every centre solved, white on D;
  - the white cross solved: the four white edges paired, in place and oriented;
  - three of the four vertical middle-layer slots (FR, FL, BR, BL) hold the last 3 edges, unpaired, their pieces (wings and midges) mixed among the three of them;
  - every other edge paired. The 3x3-level pieces above the cross (corners, and where the paired edges sit) are not constrained.
- Which three slots, and which edge colours make up the last 3 (any of the 8 non-white edges), vary from scramble to scramble.
- How the scramble is built: there is no fixed set of cases to invert, so the scramble is a short run of 3-2-3 pairing moves done backwards from solved, keeping the cross and centres intact at every step. It contains outer turns and the two-layer turns Uw and Dw, and no rotations. Scrambles are typically 25 to 60 moves; there is nothing in them that is not needed to unpair the edges.
- The practice loop matches the other 5x5 trainers: the scramble on arrival, a "Show case" / "Hide case" toggle, and "Next" (also space). There is no "Show solution", because there is no alg to show.
- "Show case" shows the U layer with the four side faces folded out (the same kind of picture as the 4x4 Last Two Edges trainer, at 5x5 size), with only the pieces of the 3 unpaired edges coloured, and names the three slots they are in (for example "Unpaired: FR, FL, BL").

## Capabilities

### New Capabilities

- `l3e-scramble-generation`: the target state, how a scramble is built, and the details that come with it.
- `l3e-trainer-session`: the Last 3 Edges screen and its practice loop.

### Modified Capabilities

- `trainer-navigation`: the 5x5 group lists three trainers, and the L3E address is added.

## Impact

- New `src/trainers/l3e/` (generator, screen, with tests), a new entry in `src/app/registry.ts`, styles, and `scripts/check-mobile.cjs` covering the new screen.
- The 4x4 net drawing becomes size-aware so the 5x5 can use it. No change in how the 4x4 trainer looks.
- No change to the other trainers, skins or deployment.

## Out of scope

- A solution, alg or step-by-step hint for the stage.
- 4x4 (user: 5x5 only).
- Timer and stats.
- Constraining the corners or the 3x3-level position of the paired edges.
