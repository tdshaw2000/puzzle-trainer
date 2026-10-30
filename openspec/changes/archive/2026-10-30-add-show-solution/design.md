# Design

## Context

`mountL2C` (`src/trainers/l2c/screen.ts`) renders the scramble, the "Show case" and "Next" buttons, and the case section. The current `L2CScramble` already carries `caseAlg`, the sheet's alg exactly as printed, which the case reveal shows in its reference caption.

## Decisions

### The solution is the sheet's alg as printed
The panel shows `current.caseAlg` verbatim. The user chose this over a version translated to the white-down hold: it is the alg they are learning from the PDF. No new cube logic is needed and scramble generation is untouched.

### A toggle button beside "Show case"
The actions row becomes three buttons: "Show case", "Show solution", "Next". The solution button uses the disclosure pattern (`aria-expanded`, `aria-controls` → the panel) and flips its label between "Show solution" and "Hide solution". This matches the toggle being introduced for "Show case" in the parallel change, so the two controls behave the same way, but this change does not depend on it.

The panel is a `section.solution` placed between the actions and the case section, so it is visible near the scramble without scrolling past the case picture. It is announced with `aria-live="polite"` rather than taking focus, so showing it does not move focus away from the button (the user can press it again to hide).

### Next resets the solution
`newScramble` hides and empties the solution panel and resets the button label/`aria-expanded`, alongside what it already does for the case.

### Layout
Three buttons at 375px: each is about 110px wide, enough for "Hide solution" at the current font with 12px padding; `check-mobile.cjs` is extended to show both panels and assert no horizontal scroll. If it overflows, the buttons wrap (`flex-wrap`) with Next taking a full row.

## Risks / Trade-offs

- Conflicts with the parallel "Show case toggle" change: both touch `screen.ts`, its tests and the `l2c-trainer-session` spec. The spec delta here only ADDs a requirement, so archiving either first works. Code conflicts are confined to the actions row and `newScramble`; whichever PR lands second rebases.
- The alg is in the sheet's orientation, so the user maps sheet U/F onto the side faces themselves (the case reveal names them). Accepted: that is what the user asked for.
