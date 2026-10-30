# Tasks

Every task is test-first: write the failing tests named in the task, then implement until they pass.

## 1. Case setup only

- [x] 1.1 Replace the prefix test with tests that, for every case, face pair and orientation, the scramble equals the simplified case moves plus the orientation turns (no other moves, no D or U outer turns, no outer turns of the two non-case side faces); then remove the prefix from `src/trainers/l2c/scramble.ts`
- [x] 1.2 Add tests that no orientation turn leaves its face's centres unchanged (removing it would give the same centres) and that reported turns are the ones applied; then reduce symmetric turns in `buildScramble`
- [x] 1.3 Keep the existing simulation tests passing for all 19 cases, 8 face roles and 16 orientations: only the case faces unsolved, undoing the turns and applying the sheet alg solves the centres, reported face grids match
- [x] 1.4 Update the README scramble description; run `npm test`, `npm run build` and `npm run check:mobile`
