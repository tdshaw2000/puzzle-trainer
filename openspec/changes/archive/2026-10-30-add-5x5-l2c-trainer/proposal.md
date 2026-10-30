# Proposal

## Why

The user drills the 5x5 last-two-centres (L2C) step of the Hoya method using the CubeSkills L2C sheet (19 cases, each with a short Rw/U alg). There is no easy way to get a real-cube scramble that lands exactly on one of those cases, so practice ends up being self-set-up and predictable. This is also the first trainer of a personal app that will grow one narrow trainer at a time.

## What Changes

- New web app shell with Puzzle -> Trainer navigation, starting with a single entry: **5x5 -> Last Two Centres**.
- New L2C scramble generator. Each scramble is applied holding yellow on U and green on F, and leaves:
  - the D (white), U (yellow) and two side centres solved;
  - one of the 19 sheet cases (uniformly random, "Solved" excluded) on a random pair of adjacent side faces, so the colour pair keeps changing;
  - each of those two faces turned to a random orientation, not the sheet's ideal one;
  - edges and corners scrambled (their state doesn't matter).
- New L2C trainer screen. It shows the scramble, a "Show case" button that reveals a picture of the two unsolved faces as they now are, the y-rotation that brings them to front/right, and the sheet's reference alg. A "Next" button gives a new scramble. No timer and no stats.

## Capabilities

### New Capabilities
- `trainer-navigation`: the Puzzle -> Trainer hierarchy, how trainers are listed and reached, and the URL each trainer lives at.
- `l2c-scramble-generation`: what a 5x5 L2C scramble must contain and guarantee (case pool, randomisation of faces, colours and orientation, notation, correctness).
- `l2c-trainer-session`: the scramble -> reveal case -> next loop on the 5x5 Last Two Centres screen.

### Modified Capabilities
- None (greenfield project).

## Impact

- New repository contents: a static TypeScript web app with unit tests. It runs entirely in the browser and has no backend.
- New dev dependencies: a bundler and a test runner (see design.md).
- Deployment to the user's OCI VM is out of scope here and will be its own change, since it needs VM access from the user.
