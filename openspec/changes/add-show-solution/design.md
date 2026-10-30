# Design

## Context

`buildScramble` (`src/trainers/l2c/scramble.ts`) makes a scramble by appending the sheet alg's inverse, rewritten from the sheet frame into the scramble frame with `frameRotation(top, front)`, then `topTurns` quarter turns of the face playing sheet U and `frontTurns` of the face playing sheet F. The returned `L2CScramble` carries `caseAlg`, `top`, `front`, `topTurns`, `frontTurns`, `left` and `yHint`, which is everything needed to solve it. `mountL2C` (`src/trainers/l2c/screen.ts`) renders the scramble, the "Show case" and "Next" buttons, and the case section.

## Decisions

### The solution is derived, not stored
`l2cSolution(s: L2CScramble)` in a new `solution.ts` builds the moves from the scramble's own fields:

1. Undo the orientation turns: `front` turned `-frontTurns`, then `top` turned `-topTurns` (exact reverse of what the scramble appended).
2. The sheet alg, parsed and rewritten with `frameRotation(top, front)` (the same rotation the scramble used, so it is the exact inverse of the case part).
3. Rewrite steps 1 and 2 into the frame after the y hint (y maps the face at R to F, B to R, L to B, F to L; U and D stay), then `simplify`.

It returns `{ rotation: yHint, moves: string }`; the panel shows the rotation (when there is one) followed by the moves, e.g. `y  Dw R Dw' F2`. Keeping it a pure function of the scramble keeps scramble generation untouched and makes it simple to test.

Alternative: show the sheet alg as printed (already in the case reveal). Rejected as the default because it needs the user to translate sheet U/F onto side faces and to apply the face turns themselves; the point of this button is "just the moves".

### Verified by simulation, independently of the rewrite
Tests apply, to a solved cube, the scramble, then the y rotation as real layer moves (on a 5x5, y = `Uw E' Dw'`), then the solution moves, and assert every centre on all six faces is its own colour. This runs over every case × face pair × top/front orientation (19 × 8 × 16 scrambles via `buildScramble`). Because the y rotation is simulated with layer turns rather than through the same face-map code, a wrong mapping in step 3 fails the test. A second test asserts no move is an x/z-type rotation and the only rotation shown is the y hint.

### A toggle button beside "Show case"
The actions row becomes three buttons: "Show case", "Show solution", "Next". The solution button uses the disclosure pattern (`aria-expanded`, `aria-controls` → the panel) and flips its label between "Show solution" and "Hide solution". This matches the toggle being introduced for "Show case" in the parallel change, so the two controls behave the same way, but this change does not depend on it.

The panel is a `section.solution` placed between the actions and the case section, so it is visible near the scramble without scrolling past the case picture. It is announced with `aria-live="polite"` rather than taking focus, so showing it does not move focus away from the button (the user can press it again to hide).

### Next resets the solution
`newScramble` hides and empties the solution panel and resets the button label/`aria-expanded`, alongside what it already does for the case.

### Layout
Three buttons at 375px: each is about 110px wide, enough for "Hide solution" at the current font with 12px padding; `check-mobile.cjs` is extended to show both panels and assert no horizontal scroll. If it overflows, the buttons wrap (`flex-wrap`) with Next taking a full row.

## Risks / Trade-offs

- Conflicts with the parallel "Show case toggle" change: both touch `screen.ts`, its tests and the `l2c-trainer-session` spec. The spec delta here only ADDs a requirement, so archiving either first works. Code conflicts are confined to the actions row and `newScramble`; whichever PR lands second rebases.
- The solution is not move-optimal (e.g. setup turns that a solver would fold into the alg). Accepted: it mirrors the sheet so it reinforces the alg being learnt.
