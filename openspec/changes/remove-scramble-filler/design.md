# Design

## Context

`buildScramble` in `src/trainers/l2c/scramble.ts` builds `simplify([...randomPrefix, ...caseMoves, ...orientation])`. `caseMoves` is the inverted sheet alg rewritten with `frameRotation(top, front)`, so the sheet's U becomes the `top` side face, the sheet's F becomes `front`, and the sheet's Rw becomes Uw or Dw. `orientation` is one outer turn of `top` and one of `front` (0-3 quarter turns each).

## Decisions

### Scramble = case moves + orientation turns
Drop `randomPrefix` and `PREFIX_LENGTH`. The scramble is `simplify([...caseMoves, ...orientation])`. The orientation turns must come after the case moves: a face turn on solved centres changes nothing.

Every move left is needed:
- The case moves are the sheet alg inverted, the shortest known way to reach the case.
- Uw/Dw stay wide turns because that is how the notation spells "turn the second layer" on a 5x5. Their outer layer only spins a uniform U or D centre, so white and yellow stay solved.
- The orientation turns are outer turns of the two case faces only, which is what turns their centres without touching any other centre.

### Skip orientation turns that change nothing
For each case face, the random 0-3 quarter turns is reduced to the smallest turn that gives the same centre pattern. A face whose centres look the same after a half turn has 2 reduced to 0 and 3 reduced to 1. The reported `topTurns`/`frontTurns` are the turns actually applied, so the existing reveal and solve checks stay true. Only case 13's top face is half-turn symmetric today; the reduction is computed from the cube, not hard-coded.

Choosing among distinct patterns this way keeps every distinct orientation equally likely (each one is hit by 1 or 2 of the 4 random values, the same number for all of them).

## Risks / Trade-offs

- Short scrambles make the case easier to recognise while scrambling. Accepted by the user: recognition practice is not the goal.
- Edges and corners are now barely mixed. Accepted: the user does not care about the rest of the cube for this trainer.
