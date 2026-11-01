# Tasks

Every task is test-first: write the failing tests named in the task, then implement until they pass.

## 1. Cube library

- [ ] 1.1 Tests: `parseAlg` accepts x/y/z with ' and 2, folds them into the following moves, and splits `x'U2`; existing L2C parsing unchanged. Implement in `notation.ts`/`rotation.ts`

## 2. Cases and scrambles

- [ ] 2.1 Tests: 12 cases with their algs and pictured patterns; each inverted alg produces its picture (up to colour relabelling); each alg solves its picture with centres solved. Implement `src/trainers/l2e/cases.ts`
- [ ] 2.2 Tests: scramble leaves centres solved and white on D, only the case edges unpaired, the case pattern at the reported position; no rotations or same-layer neighbours; setup is shortest for the chosen edges; over many seeds every case, position and edge colour pair appears; hints as specified (incl. y2-symmetric cases). Implement `src/trainers/l2e/scramble.ts`

## 3. Screen

- [ ] 3.1 Tests: render draws the U layer and edge side stickers with only case pieces coloured, matching the cube. Implement `render.ts`
- [ ] 3.2 DOM tests: arrival state; Show/Hide case toggle; Show/Hide solution toggle (case 1 note); Next and space reset both; slice note for M/S. Implement `screen.ts` and styles
- [ ] 3.3 Tests: home lists Last Two Centres then Last Two Edges; `#/5x5/l2e` opens it. Register the trainer
- [ ] 3.4 Extend `scripts/check-mobile.cjs` to the L2E screen at 375px; run `npm test`, `npm run build`, `npm run check:mobile`

## 4. Wrap up

- [ ] 4.1 Reviewer subagent reviews the code; address findings; merge (deploys) and archive this change into `openspec/specs`
