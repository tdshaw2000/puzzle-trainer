# Design

## Context

The 5x5 model (`cubeModel(5)`), edges and `unpairedEdges`, notation (with Uw/Dw, merging via `simplify`), and frame rewriting (`rewrite`, `frameRotation`) already exist. The L2C and L2E trainers build scrambles by inverting a case alg after a setup. Last 3 Edges has no case list: any mix of the last three edges' pieces is a valid case, so the generator has to produce the state some other way.

## Decisions

### Build the state by undoing pairing steps
A scramble is a random walk from solved over moves that a 3-2-3 solver would use, run backwards. Every step is one of:

- a **slice-flip step**: a slice turn (Uw or Dw: quarter, half or prime), then a flip trigger (`R U R' F R' F' R` or its mirror `L' U' L F' L F L'`, seen from any of the four sides), then the slice turn undone. This is the move that pairs (here, unpairs) wings between edges. The flip trigger turns each face it uses a net zero, so the centres come back; the slice turn is undone, so the cross comes back.
- an **insertion step**: an `R U R'`-type trigger (`R U R'`, `R U' R'`, `R U2 R'` and the left-hand mirrors, from any side). This swaps whole edges between the U layer and the middle layer without touching the cross, so the yellow edges can end up among the last 3, as they do in real solves.

Each step may be preceded by a U turn. A step is kept only if, after it, at most 3 edges are unpaired and none of them is outside the middle layer. The walk takes at least 3 slice-flip steps (so the pieces of the 3 edges are well mixed) and stops at the first point after that where exactly 3 edges are unpaired. The kept moves are merged with `simplify`.

A prototype run of this on the 5x5 model over 300 seeds gave: every set of three middle-layer slots, every one of the 8 non-white edge colours in the case, centres and cross intact every time, and scrambles of 23 to 86 moves, 36 on average. Walks whose scramble would be over 60 moves are started again (added during code review), so scrambles are at most 60 moves.

Alternatives considered: picking a random target state directly needs a 5x5 solver to turn it into moves, which is far more work for the same result. A fixed list of a few hand-made cases would not give the variety asked for.

### What the generator returns
`{ text, cube, unpaired: ['FR','FL','BL'] (sorted F, R, B, L order), pieces: Vec[] }`: the scramble, the resulting colour cube, the slots of the last 3 edges and the positions of their pieces for the picture.

### Picture
The 4x4 net renderer (`src/trainers/l2e-4x4/render.ts`) is generalised to N×N (face blocks of N cells, same gaps, same data attributes) and moved to a shared place; the 4x4 trainer keeps its output. The L3E screen draws the 5x5 net with green at the bottom (no rotation hint is needed: the slots are named) and colours only the stickers of the 9 pieces (two wings and a midge per slot) in the three unpaired slots.

### Screen
A small screen modelled on the L2E one, without the solution toggle: breadcrumb, the holding reminder (yellow U, green F), the scramble, "Show case"/"Hide case", "Next" and space. Skins apply through the existing shared classes.

## Risks / Trade-offs

- The random walk has no exact distribution guarantee (some mixes are likelier than others). Tests check coverage of slots and colours, not uniformity.
- Scrambles contain Uw and Dw, which are a little slower to apply than outer turns. That is inherent: outer turns alone cannot unpair edges.
