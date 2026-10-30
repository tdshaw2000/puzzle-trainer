# Puzzle Trainer

A personal trainer for specific parts of solving WCA puzzles, organised by puzzle and then trainer.

Current trainers:

- **5x5 › Last Two Centres** (`#/5x5/l2c`): scrambles that land on one of the 19 cases from the CubeSkills 5x5 L2C sheet, on a random pair of adjacent side faces in a random orientation. Hold yellow on top and green in front while scrambling (white stays on the bottom). After solving, "Show case" reveals the case as it was scrambled, alongside the sheet's picture and alg.

## Development

Requires Node 20+.

```sh
npm ci          # install
npm test        # run the unit and DOM tests (Vitest)
npm run dev     # local dev server
npm run build   # type-check and build static files into dist/
```

`npm run check:mobile` checks the trainer at phone width and the space bar in a real browser. It needs Playwright with Chromium installed (not a project dependency) and `npx vite preview` running.

`dist/` is a static site with relative paths, so it can be served from any folder by any web server.

Changes are planned with [OpenSpec](https://github.com/Fission-AI/OpenSpec) under `openspec/` and built test-first.
