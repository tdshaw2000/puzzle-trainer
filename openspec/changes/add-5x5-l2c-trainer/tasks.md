# Tasks

Every task is test-first: write the failing tests named in the task, then implement until they pass.

## 1. Project setup

- [x] 1.1 Scaffold Vite + TypeScript + Vitest (jsdom) app with `npm test`, `npm run build` and `npm run dev`; use a relative base (`base: './'`) so `dist/` works from any path; verify a test runs and the build produces `dist/`

## 2. 5x5 cube model

- [x] 2.1 Implement move parsing and formatting (faces, `w`, slices M/E/S, `'`, `2`, brackets ignored), inversion and simplification (merge/cancel adjacent same-layer turns); verify with unit tests
- [x] 2.2 Implement the 5x5 sticker simulator with outer, wide and slice moves on all axes; verify with tests (four quarter turns = identity, R U R' U' order, known centre effects of Rw and M, outer turns keep centres)
- [x] 2.3 Implement whole-cube rotation rewriting of moves (sheet frame → chosen face pair); verify by simulation that rewritten algs act on the rotated faces

## 3. Case data and scramble generator

- [x] 3.1 Add the 19 sheet algs as case data; verify by tests that each inverse alg changes only U/F centres, keeps F's left 2x3 block, and that the 19 patterns are distinct and none is solved
- [x] 3.2 Implement the scramble generator (prefix, face pair, rewritten inverse alg, face orientation turns, simplification, case details); verify by simulation over every case × face pair × orientation that the specs' resulting-state requirements hold, plus seeded statistical tests for case, pair, role and orientation coverage and the prefix rules

## 4. App shell and navigation

- [x] 4.1 Implement the puzzle/trainer registry, hash router, home page, breadcrumb and not-found page; verify with DOM tests for each trainer-navigation scenario

## 5. L2C trainer screen

- [x] 5.1 Implement the SVG face renderer with horizontal and vertical layouts (centres coloured, ring grey); verify with tests that rendered sticker colours match a simulated state
- [x] 5.2 Implement the trainer screen (scramble with holding reminder, Show case with picture, labels, y-rotation hint, reference picture and alg, Next button and space bar with preventDefault, E-slice note); verify with DOM tests for each l2c-trainer-session scenario
- [x] 5.3 Add responsive styles and check the screen at 375px wide has no horizontal scroll (one-off Playwright script, see design.md)

## 6. Integration

- [x] 6.1 Add README (run, test, build) and verify `npm ci && npm test && npm run build` succeeds from clean

## Workflow follow-up

- Archive the change after the PR is merged.
