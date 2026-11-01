# Tasks

Every task is test-first: write the failing tests named in the task, then implement until they pass.

## 1. Site title on every page

- [x] 1.1 Router tests: home, each trainer route and not-found each show one "Puzzle Trainer" link to `#/` at the top; on home it is inside the page's `h1`; following it from a trainer renders the home page. Then update `src/app/router.ts` to render it on every route
- [x] 1.2 Style the title in `src/styles.css` and each skin's `theme.css` so it looks like today's home heading on every page (heading colour, no link underline) with a visible focus outline; update the skin tests if they cover heading styles
- [x] 1.3 Extend `scripts/check-mobile.cjs`: in every skin, at 375px on home, each trainer and not-found, the title is visible, does not overlap the ⚙ toggle, and there is no horizontal scroll
- [x] 1.4 Run `npm test`, `npm run build` and `npm run check:mobile`
