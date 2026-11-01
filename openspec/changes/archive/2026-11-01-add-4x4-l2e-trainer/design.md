# Design

## Context

The 5x5 trainers have a 5x5 sticker model (`src/cube/cube.ts`), edges (`edges.ts`), notation with wide turns, slices and rotations (`notation.ts`), and frame rewriting (`rotation.ts`). The 5x5 L2E trainer (`src/trainers/l2e/`) defines cases as algs checked against transcribed pictures, and builds scrambles as a shortest outer-turn setup plus the inverted alg. The 4x4 sheet's cases differ in two ways: the case pieces are not always UF and UB (cases 3 and 4 use UF and UR, case 5 uses UR and FL), and the pictures are 3D views of U, F and R rather than top-down views.

## Decisions

### A size-aware cube model
`cube.ts` gains `cubeModel(size)`, which builds the slot list and move permutations for an N×N cube. Coordinates run from -(N-1)/2 to (N-1)/2 (so ±1.5 and ±0.5 on the 4x4; the 5x5 keeps -2..2). Outer layers are at the largest depth, wide turns take the two outer layers, and slices exist only on odd sizes. The existing 5x5 exports stay as they are (bound to the 5x5 model), so L2C and 5x5 L2E code does not change. `edges.ts` likewise gets edges per size: a 4x4 edge is two wings; "paired" still means every piece in the slot reads the same two colours the same way round.

`parseAlg(alg, size = 5)` expands rotations by size: on the 4x4, x = `Rw Lw'`, y = `Uw Dw'`, z = `Fw Bw'`. The glued-token rule widens from "after a rotation" to "after a rotation or a move ending in ' or 2", which covers the sheet's `U2Rw'` and `F'R` while still rejecting `RU`. `Rw2'` already parses as `Rw2`.

### Shared L2E engine
The 5x5 L2E code is split into a size-independent part (case pattern checks, re-grip, y2 symmetry, sources, BFS setup, scramble building) parameterised by a small trainer definition: the cube model, its cases, and which stickers its pictures show. The 5x5 L2E trainer keeps its tests and behaviour; the 4x4 trainer is a second definition. The case pieces are no longer assumed to be UF/UB: each case's pieces are read from the case itself (the edge slots its inverted alg unpairs), then turned to the chosen position.

At the 3x3 level a 4x4 edge has no midge, so the setup search tracks each edge by the midpoint of its slot and the face its first sticker points at. Outer turns move both wings together, so they never break a pair.

### Cases are stored as algs and checked against the pictures
The 4x4 cases hold the 5 algs as printed and each picture transcribed as colour letters for the visible case stickers (U and side stickers of UF, UB and UR, and the F stickers of FL, as the case needs). A test applies each inverted alg to a solved cube and checks that it gives that pattern, up to relabelling the colours, and that it unpairs exactly the pictured edge slots. A second test checks that the alg solves it with the centres solved. A throwaway simulation already confirmed both for all 5: no alg needs a re-grip and none needs correcting.

### y2-symmetric cases
Cases 1 and 2 (both on UF and UB) look the same after y2, so as on the 5x5, their hint uses the shorter turn (none for y2, y for y').

### Pictures
`render.ts` for the 4x4 draws a net: the 4×4 U face in the middle with F, R, B and L folded out around it (each 4 rows deep), giving a 12×12 grid with the corners empty. This shows every sticker of the U-layer and middle-layer edges, which covers every case piece at every position. Only the case pieces' stickers are coloured; the rest are neutral, with the same skin-aware colours as the other trainers. The sheet's picture is the same drawing after the hinted y, so the case appears where the sheet shows it. (A 3D view like the sheet's was considered, but it hides the B and L stickers, and at some positions the case pieces themselves.)

### Screen and navigation
The 4x4 screen reuses the 5x5 L2E screen with the 4x4 definition and its own texts (no slice note: the 4x4 has no slices; "Case N of 5"; no case notes since nothing is corrected or re-gripped). The registry adds a "4x4" puzzle after "5x5" with `{ id: 'l2e', name: 'Last Two Edges' }`.

## Risks / Trade-offs

- Generalising the cube model touches code the 5x5 trainers use. The existing tests pin 5x5 behaviour, and the 5x5 exports stay unchanged.
- The 3x3-level pieces end up scrambled, and some scrambles will show 4x4 parity at the 3x3 stage. That is realistic for L2E.
