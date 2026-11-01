# Design

## Context

The L2C trainer (`src/trainers/l2c/`) already has a 5x5 sticker model (`src/cube/cube.ts`), notation with wide turns and slices (`notation.ts`), and whole-cube frame rewriting (`rotation.ts`). The L2E guide's algs also use `Lw`, `x'` and one glued token (`x'U2`), and its pictures are top-down views of the UB and UF edges.

## Decisions

### Cases are stored as algs and checked against the pictures
`src/trainers/l2e/cases.ts` holds the 12 algs (case 1 corrected, as the user chose) and each case's pictured pattern, transcribed from the guide's pictures as 12 letters: B-side row, U row of UB, U row of UF, F-side row, with letters standing for the 4 picture colours. A test applies each inverted alg to a solved cube and checks it gives that pattern, up to relabelling the colours. A second test checks that the alg then solves it. Both were checked by a throwaway simulation while drafting: 11 algs match as printed, and case 1 matches with M and M' swapped.

### Parser: rotations and the glued token
`parseAlg` accepts the whole-cube rotations `x`, `y` and `z` (with ' and 2). It also accepts tokens glued without a space when they read unambiguously (`x'U2`). On the 5x5, a rotation is exactly three layer turns, so the parser expands it into them: x = `Rw M' Lw'`, y = `Uw E' Dw'`, z = `Fw S Bw'`. `Move`, the cube model and the L2C code stay unchanged. Rotations never reach a scramble: once expanded, `simplify` merges the layer turns with their neighbours. (Dropping the rotation and relabelling the moves after it would not work. The guide's wide turns rely on the rotation to bring the centres home, so a rotation would be left over at the end.) The solution panel still shows the alg text as printed, including `x'`.

### Case 6 ends with the cube turned
Case 6's alg contains an `x'` that its wide turns don't undo, so after it the centres are solved but turned: white is no longer on D. The case setup is therefore the inverse of "alg + x", found automatically as the rotation that puts the centres home. This keeps every scramble's centres home, and the solution shows a note that x puts white back on the bottom.

### Building a scramble
1. Pick a case, a position p for the guide's front edge (F, R, B or L, matching y turns none, y, y2, y'), and a random target: the edges and orientations whose pieces will form the case.
2. Rewrite the inverted alg for position p (`frameRotation`, like L2C's y frames).
3. Work out which two edge slots (and orientations) the rewritten inverse alg builds the case from. It is a fixed 3x3-level permutation, read once per case and position by applying it to a solved cube and tracking pieces. For case 6, for example, the front edge's midge comes from DF.
4. Setup: breadth-first search over the positions and orientations of just those two edges (24 × 22 states), using the 18 outer face turns, for a shortest sequence that brings the chosen edges there. Outer turns never touch centres or break pairs, so the setup only chooses which edges, and which way round, form the case. Case 3 has one source edge, so its search is over 24 states.
5. Scramble = simplify(setup + rewritten inverse alg).

Random choice of edges plus BFS gives uniform colours with setups of at most a handful of moves. An empty setup happens when the solved edges already fit. Filler-free in the L2C sense: every setup move is needed for the chosen colours.

### y2-symmetric cases
Cases 1, 2, 7, 8, 11 and 12 look the same after y2. For those, position B is reported as the hint "none" and L as "y". The scramble is the same physical state either way, so only the reported position and hint change. The guide picture then shows the case from that shorter rotation.

### Pictures
`src/trainers/l2e/render.ts` draws a 7×7 grid in SVG: the 5×5 U face plus one strip of side stickers per side, like the guide's birds eye view, with the corner cells of the strip left out. Only the 6 case pieces (3 per edge, on both of their stickers) are coloured, and everything else is neutral, using the same skin-aware colours as L2C. The guide picture is the same drawing after the hinted y. A test reads the colours back from `data-` attributes and compares them with the cube state.

### Screen and navigation
`mountL2E` follows `mountL2C`: the same buttons, toggles (`aria-expanded`/`aria-controls`), space-bar handling and solution panel. The shared screen code is small, so it is copied rather than abstracted for now. The two screens can be merged later if a third trainer appears. The registry adds `{ id: 'l2e', name: 'Last Two Edges' }` under 5x5.

## Risks / Trade-offs

- The 3x3-level pieces end up scrambled. That is realistic for L2E (it happens before the 3x3 stage) and matches the guide's algs, which also disturb them.
