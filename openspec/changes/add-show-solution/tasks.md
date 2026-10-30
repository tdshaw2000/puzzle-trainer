# Tasks

Every task is test-first: write the failing tests named in the task, then implement until they pass.

## 1. Solution moves

- [ ] 1.1 Write simulation tests for `l2cSolution`: over every case × face pair × top/front orientation (via `buildScramble`), scramble + y as `Uw E' Dw'` (repeated per the hint) + solution moves leaves every centre solved; the rotation equals the scramble's `yHint`; the moves contain only face, wide and slice turns. Then implement `src/trainers/l2c/solution.ts`

## 2. Screen

- [ ] 2.1 Write DOM tests: solution hidden on arrival with label "Show solution"; selecting it shows only the moves (rotation then moves, matching `l2cSolution`) without showing the case, label "Hide solution", `aria-expanded` true; selecting again hides it; works whether or not the case is shown; Next and space hide it and reset the label. Then add the button and `section.solution` to `src/trainers/l2c/screen.ts` and styles
- [ ] 2.2 Extend `scripts/check-mobile.cjs` to show both solution and case at 375px and assert no horizontal scroll; run `npm test`, `npm run build` and `npm run check:mobile`

## 3. Wrap up

- [ ] 3.1 Reviewer subagent reviews the code; address findings; merge (deploys) and archive this change into `openspec/specs/l2c-trainer-session`
