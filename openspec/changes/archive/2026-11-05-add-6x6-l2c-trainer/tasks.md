# Tasks

Every task is test-first: write the failing tests named in the task, then implement until they pass.

## 1. Cube library

- [ ] 1.1 Tests: `cubeModel(6)` has 216 stickers; R, Rw, 3Rw, 3R, 3L, U act like a real 6x6 (e.g. each turn four times is the identity, 3R and 3L touch different layers, centres solved after x x'); the 4x4 and 5x5 models and tests are unchanged. Implement in `cube.ts` (layers `wide3` and `inner3`)
- [ ] 1.2 Tests: `parseAlg(alg, 6)` parses every sheet alg (`3R`, `3L'`, `3Rw`, `3Lw'`, `Lw`, `F`) and `formatAlg` round-trips them; 6x6 rotations expand into 3-layer wide turns; 4x4/5x5 parsing is unchanged. Implement in `notation.ts`

## 2. Cases and scrambles

- [ ] 2.1 Refactor the 5x5 L2C case and scramble code into a size-independent engine plus the 5x5 definition, with every 5x5 L2C test still passing
- [ ] 2.2 Tests: 32 cases with algs as printed and pictured patterns; each inverted alg gives its picture exactly, leaves D/B/L/R centres solved, and each alg solves it; the merged duplicate is one case; no two cases are the same physical state. Implement the 6x6 cases
- [ ] 2.3 Tests: scramble leaves U/D and the two other faces solved and the case on the chosen faces; no rotations, no same-layer neighbours; no filler; over many seeds every case, face pair, role and orientation appears; hints as specified. Implement the 6x6 scramble

## 3. Screen

- [ ] 3.1 Tests: face renderer draws 6x6 faces with the 4x4 centre coloured; 5x5 rendering unchanged. Implement `renderFaces(size)`
- [ ] 3.2 DOM tests: arrival state; Show/Hide case and solution toggles; solution as printed; Next and space reset both; "Case N of 32: name". Implement the screen and styles
- [ ] 3.3 Tests: home lists 4x4, 5x5, 6x6; `#/6x6/l2c` opens it with the breadcrumb. Register the trainer; update README
- [ ] 3.4 Extend `scripts/check-mobile.cjs` to the 6x6 screen at 375px; run `npm test`, `npm run build`, `npm run check:mobile`

## 4. Wrap up

- [ ] 4.1 Reviewer subagent reviews the code; address findings; merge (deploys) and archive this change into `openspec/specs`
