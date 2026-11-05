# Design

## Context

The 5x5 L2C trainer builds a scramble as the inverse of the case alg applied to a solved cube, rewritten for a chosen pair of side faces, plus orientation turns of the two case faces. Its pieces are a size-aware sticker model (`cubeModel(n)`, used by 4x4 and 5x5), notation for wide turns and slices, frame rewriting, a face renderer fixed at 5x5, and a screen. The 6x6 sheet uses the same idea with 4x4 centre blocks and algs that use more kinds of layer.

## Decisions

### 6x6 notation (SiGN)
Standard big-cube notation: `Rw` is the two outer layers, `3Rw` the three outer layers, `3R` only the third layer from R, `3L` only the third layer from L. `Layer` grows from `outer | wide | slice` to also cover a three-layer wide turn and a single inner layer at depth 3; a move stores its face and layer as now, so `3L` and `3R` are different faces' depth-3 layers and rewriting for another frame just maps the face. `formatMove` prints the SiGN names. Whole-cube rotations on 6x6 are the three-layer wide turns of opposite faces (x = `3Rw 3Lw'`), so parsing is complete even though no sheet alg uses them. 5x5 slice moves (`E`) and 4x4 behaviour stay as they are.

### Shared L2C engine
The 5x5 L2C code is parameterised by size: the model, the case list, and the number of centre rows. The 5x5 trainer is one definition, the 6x6 trainer another. Case patterns are stored as the 4x4 own/other grids of the sheet (Y/G) and checked against the alg by test. "Turns that leave a face's centres looking the same are reduced" is as before, with 4x4 centres (rotation symmetry is computed, not assumed). The set of cases reduces by "same physical state" as on the 5x5 (any face turn, either face as top): on the 6x6 sheet only the duplicate listing merges, so no lookalike lines are shown.

### Renderer and screen
`renderFaces` takes the face size (5 or 6) instead of assuming 5; the centre block is everything but the outer ring. The 6x6 screen reuses the 5x5 L2C screen with its own texts ("Case N of 32", name, alg) and breadcrumb "6x6 › Last Two Centres". The registry adds "6x6" after "5x5".

## Risks / Trade-offs

- Generalising the L2C code touches code the 5x5 trainer uses; its tests pin the 5x5 behaviour.
- Scrambles are long-ish (up to about 14 moves plus orientation turns), because the algs are long and the 6x6 has no shorter way to reach a case without filler. That matches the "no filler" rule.
- Inner and outer pieces are not distinguished in the picture beyond position; the case is read from the whole 4x4 block as on the sheet.
