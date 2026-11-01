# Tasks

Every task is test-first: write the failing tests named in the task, then implement until they pass.

## 1. Cube library

- [ ] 1.1 Tests: `cubeModel(4)` has 96 stickers; R, Rw, U, Uw, x, y act like a real 4x4 (e.g. Rw4 = identity, x = Rw Lw', centres solved after x x'); the 5x5 model and its existing tests are unchanged. Implement in `cube.ts`
- [ ] 1.2 Tests: 4x4 edges are 12 slots of two wings; outer turns keep them paired, Rw splits them. Implement in `edges.ts`
- [ ] 1.3 Tests: `parseAlg(alg, 4)` expands rotations into 4x4 layer turns; `U2Rw'` and `F'R` split; `RU` still rejected. Implement in `notation.ts`

## 2. Cases and scrambles

- [ ] 2.1 Refactor the 5x5 L2E case and scramble code into a size-independent engine plus the 5x5 definition, with every 5x5 L2E test still passing
- [ ] 2.2 Tests: 5 cases with their algs as printed and pictured patterns; each inverted alg gives its picture (up to colour relabelling) and unpairs exactly the pictured slots; each alg solves its case with centres solved and no re-grip; cases 1 and 2 are y2-symmetric. Implement the 4x4 cases
- [ ] 2.3 Tests: scramble leaves centres solved and white on D, only the case's two edges unpaired, the case pattern at the reported position; no rotations or same-layer neighbours; setup is shortest; over many seeds every case, position and edge colour pair appears; hints as specified; hint then alg pairs every edge. Implement the 4x4 scramble

## 3. Screen

- [ ] 3.1 Tests: the net drawing shows U and the four side faces, with only case pieces coloured, matching the cube. Implement the 4x4 render
- [ ] 3.2 DOM tests: arrival state; Show/Hide case toggle; Show/Hide solution toggle shows the alg as printed; Next and space reset both; "Case N of 5". Implement the screen and styles
- [ ] 3.3 Tests: home lists 5x5 then 4x4, with Last Two Edges under 4x4; `#/4x4/l2e` opens it with the breadcrumb "4x4 › Last Two Edges". Register the trainer; update README
- [ ] 3.4 Extend `scripts/check-mobile.cjs` to the 4x4 screen at 375px; run `npm test`, `npm run build`, `npm run check:mobile`

## 4. Wrap up

- [ ] 4.1 Reviewer subagent reviews the code; address findings; merge (deploys) and archive this change into `openspec/specs`
