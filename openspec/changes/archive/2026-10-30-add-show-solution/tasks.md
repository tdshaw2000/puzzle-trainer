# Tasks

Every task is test-first: write the failing tests named in the task, then implement until they pass.

## 1. Screen

- [x] 1.1 Write DOM tests: solution hidden on arrival with label "Show solution"; selecting it shows only the case's sheet alg, exactly as printed, without showing the case, label "Hide solution", `aria-expanded` true; selecting again hides it; works whether or not the case is shown; Next and space hide it and reset the label. Then add the button and `section.solution` to `src/trainers/l2c/screen.ts` and styles
- [x] 1.2 Extend `scripts/check-mobile.cjs` to show both solution and case at 375px and assert no horizontal scroll; run `npm test`, `npm run build` and `npm run check:mobile`

## 2. Wrap up

- [x] 2.1 Reviewer subagent reviews the code; address findings; merge (deploys) and archive this change into `openspec/specs/l2c-trainer-session`
