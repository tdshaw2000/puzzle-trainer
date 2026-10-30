# Puzzle Trainer

A personal trainer for specific parts of solving WCA puzzles, organised by puzzle and then trainer.

Current trainers:

- **5x5 › Last Two Centres** (`#/5x5/l2c`): scrambles that land on one of the 19 cases from the CubeSkills 5x5 L2C sheet, on a random pair of adjacent side faces in a random orientation. A scramble is only the case setup plus at most one turn of each case face, with no filler moves. Hold yellow on top and green in front while scrambling (white stays on the bottom). After solving, "Show case" reveals the case as it was scrambled, alongside the sheet's picture and alg; select "Hide case" to hide it again.

The ⚙ menu in the top-right corner changes the skin: Minimal (the default), Dark, DOS, Mario, Monkey or VHS, the same set as the owner's other apps. The choice is remembered in the browser. Skins live in `public/themes/<skin>/theme.css` and are picked by `public/skin.js`; `src/styles.css` holds only layout.

## Development

Requires Node 20+.

```sh
npm ci          # install
npm test        # run the unit and DOM tests (Vitest)
npm run dev     # local dev server
npm run build   # type-check and build static files into dist/
```

`npm run check:mobile` checks the trainer at phone width under every skin, and the space bar, in a real browser. It needs Playwright with Chromium installed (not a project dependency) and `npx vite preview` running.

`dist/` is a static site with relative paths, so it can be served from any folder by any web server.

Changes are planned with [OpenSpec](https://github.com/Fission-AI/OpenSpec) under `openspec/` and built test-first.

## Deployment

Merging to `main` deploys to https://puzzle-trainer.duckdns.org, the same way as the owner's other apps on the shared OCI VM: CI publishes an image to GHCR, then SSHes to the VM with a key restricted to one deploy script. The one-time VM setup and everyday operations are in [`docs/runbook.md`](docs/runbook.md). `uv run pytest` tests the deploy files.
