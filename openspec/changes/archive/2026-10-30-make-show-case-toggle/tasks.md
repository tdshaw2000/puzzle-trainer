# Tasks

Every task is test-first: write the failing tests named in the task, then implement until they pass.

## 1. Toggle the case

- [x] 1.1 Update the screen DOM tests: selecting the button with the case shown hides it, the label reads "Show case"/"Hide case" to match, `aria-expanded` follows the state, the button is never disabled, showing again gives the same case, and Next resets to hidden with the label "Show case"; then make `src/trainers/l2c/screen.ts` pass them
- [x] 1.2 Run `npm test`, `npm run build` and `npm run check:mobile` (375px, case shown and hidden)
