# Puzzle Trainer

A personal trainer for specific parts of solving WCA puzzles, organised by puzzle and then trainer.

Current trainers:

- **4x4 › Edge Pairing - Hoya** (`#/4x4/pairing`): the start of the Hoya edge-pairing stage. Each scramble leaves the six centres and the white cross solved and at least 6 of the other 8 edges unpaired, in the top and middle layers, with random colours. The scramble is pairing steps done backwards (Uw/Dw slice, flip trigger, slice back, plus R U R'-style inserts), at most 60 moves. "Show case" draws the cube as a net with only the unpaired edges' wings coloured and says how many edges to pair. There is no solution.
- **4x4 › Last Two Edges** (`#/4x4/l2e`): scrambles that land on one of the 5 cases from the CubeSkills sheet "4x4 – Useful Last 2 Edge Algorithms", with random edge colours and a random y position. A scramble is a shortest outer-turn setup plus the case's alg inverted, with no filler moves. "Show case" draws the cube as a net (U with the sides folded out) next to the sheet's view; "Show solution" shows the sheet's main alg, with the sheet's missing spaces put back.
- **5x5 › Last Two Centres** (`#/5x5/l2c`): scrambles that land on one of the 19 cases from the CubeSkills 5x5 L2C sheet, on a random pair of adjacent side faces in a random orientation. A scramble is only the case setup plus at most one turn of each case face, with no filler moves. Hold yellow on top and green in front while scrambling (white stays on the bottom). After solving, "Show case" reveals the case as it was scrambled, alongside the sheet's picture and alg; select "Hide case" to hide it again.
- **5x5 › Edge Pairing - Hoya** (`#/5x5/pairing`): the same as the 4x4 trainer on a 5x5. The six centres and the white cross are solved and at least 6 of the other 8 edges are unpaired (an edge is paired when its wings and midge match), at most 60 moves. "Show case" colours all three pieces of each unpaired edge. There is no solution.
- **5x5 › Last Three Edges** (`#/5x5/l3e`): the last stage of Hoya 3-2-3 edge pairing. Each scramble leaves the centres and white cross solved, every edge paired except three, and those three unpaired in three of the four middle-layer slots, with their pieces mixed among them. Which slots and which colours change every time. The scramble is a few 3-2-3 pairing steps done backwards (Uw/Dw slice, flip trigger, slice back, plus R U R'-style inserts), so it uses outer turns, Uw and Dw. "Show case" draws the cube as a net with only the three unpaired edges coloured and names their slots. There is no solution to show, since the stage is intuitive.
- **6x6 › Last Two Centres** (`#/6x6/l2c`): the same idea on the 6x6, from the SpeedCubeDB "6x6 Last Two Centers" sheet: 32 cases (the sheet's two identical entries are merged), each with the 4x4 centre blocks of two adjacent side faces in a random orientation. A scramble is only the case setup plus at most one turn of each case face. Notation is the usual big-cube one (`Rw` two layers, `3Rw` three, `3R`/`3L` the third layer only). Hold yellow on top and green in front while scrambling. "Show case" reveals the case with its sheet name; "Show solution" lists every alg the sheet prints for it.
- **6x6 › Edge Pairing - Hoya** (`#/6x6/pairing`): the same on a 6x6. The six centres and the white cross are solved and at least 6 of the other 8 edges are unpaired (an edge is paired when all four wings match), at most 60 moves. "Show case" colours all four wings of each unpaired edge. There is no solution.

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
