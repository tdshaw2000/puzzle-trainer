# Tasks

Every task is test-first: write the failing tests named in the task, then implement until they pass.

## 1. Generator

- [ ] 1.1 Tests: each step type keeps centres and the white cross solved on its own; a slice-flip step unpairs edges, an insertion step does not. Implement the step list
- [ ] 1.2 Tests: over many seeds, every scramble leaves centres and cross solved, exactly 3 unpaired edges all in the middle layer, everything else paired; all 4 slot sets and all 8 non-white edges occur; no rotations, slices or same-layer neighbours; reported slots, pieces and cube match. Implement `generateL3E(random)`

## 2. Screen

- [ ] 2.1 Tests: the net renderer at size 5 draws 5 x 25 stickers and colours only highlighted pieces; the 4x4 net is unchanged. Generalise the renderer
- [ ] 2.2 DOM tests: arrival state with no solution control; Show/Hide case toggle with picture and "Unpaired: ..." text matching the cube; Next and space reset it, one scramble per space press. Implement the screen and styles
- [ ] 2.3 Tests: home lists Last Two Centres, Last 3 Edges, Last Two Edges under 5x5; `#/5x5/l3e` opens it with the breadcrumb "5x5 › Last 3 Edges". Register the trainer; update README
- [ ] 2.4 Extend `scripts/check-mobile.cjs` to the new screen at 375px; run `npm test`, `npm run build`, `npm run check:mobile`

## 3. Wrap up

- [ ] 3.1 Reviewer subagent reviews the code; address findings; merge (deploys) and archive this change into `openspec/specs`
