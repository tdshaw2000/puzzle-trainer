# Proposal: show the site title on every page, linking home

## Why

Only the home page shows "Puzzle Trainer". On a trainer screen the only way back is the puzzle name in the breadcrumb. The user wants the "Puzzle Trainer" title on every page, as a link back to the home page.

## What Changes

- Every page (home, each trainer screen, and the not-found page) shows "Puzzle Trainer" at the top, in the same place and style. It is a link to the home page (`#/`).
- On the home page the title stays the page's main heading, now also a link. On other pages it sits above the breadcrumb, and the trainer's own heading ("Last Two Centres" etc.) stays as it is below it.
- Each skin (Minimal, Dark, DOS, Mario, Monkey, VHS) styles the title the way it styles today's home title, on every page. The title keeps its heading colour rather than turning into a coloured, underlined link, and it does not collide with the ⚙ skin menu at phone width (375px).
- The breadcrumb stays as it is.

Note: there are no separate puzzle pages today (the 5x5 and 4x4 groups are sections of the home page), so "every page" means home, the three trainers and not-found.

## Capabilities

### Modified Capabilities

- `trainer-navigation`: adds a requirement that every page shows the site title as a link home.

## Impact

- `src/app/router.ts` and its tests, `src/styles.css`, and the skins' `theme.css` files where they style the title.
- `scripts/check-mobile.cjs` gains a check that the title shows and does not overlap the ⚙ menu at 375px.
- No change to the trainers, scramble generation or deployment.

## Out of scope

- Changing the breadcrumb, the page `<title>`, or adding other navigation.
