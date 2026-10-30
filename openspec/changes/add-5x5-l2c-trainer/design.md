# Design

## Context

Greenfield repo. See proposal.md for motivation and specs/ for behaviour. The app must run as static files (it will be served from the user's OCI VM later), so everything happens in the browser. The trickiest part is the scramble generator: it must provably land on the chosen sheet case, so it is built around a 5x5 sticker simulator that the tests also use.

## Goals / Non-Goals

**Goals:**
- A scramble generator whose correctness is checked by simulation for every case, face pair and orientation.
- A navigation shell that can take more puzzles and trainers without restructuring.

**Non-Goals:**
- Timer, statistics, case selection or weighting (explicitly not wanted yet).
- Hiding the case from the end of the scramble (see Risks).
- Deployment and hosting setup (separate change).
- A 3D cube view or full-cube state display.

## Decisions

### Stack: Vite + TypeScript + Vitest, no UI framework
Two screens and a handful of buttons don't justify React. Plain TypeScript modules rendering into the DOM keep the bundle tiny and dependency churn low. Vitest (with jsdom) runs the unit and DOM tests. Alternatives: React (heavier, nothing gained yet), plain JS without a build step (loses types, which matter for the cube model).

### Hash routing with a puzzle/trainer registry
Routes are `#/<puzzleId>/<trainerId>`. A registry module lists puzzles, each with trainers (`id`, `name`, `mount(container)`). The home page and router both read the registry, so adding a trainer is one registry entry. Hash routing works on any static file server with no rewrite rules on the VM. Alternative: history API routing (needs server fallback config).

### 5x5 sticker simulator
The cube is a map of 150 stickers addressed by face and (row, col). Moves are defined as geometric quarter turns: each move has an axis, a set of layers (outer, wide = 2 layers, slice = centre layer) and a direction; a sticker position rotates if it lies in a turned layer. This one mechanism covers outer, wide and slice moves on every axis, so rewritten algs need no hand-written permutation tables. The explore thread's Python prototype used the same approach and confirmed that all 19 transcribed algs only change U and F centres and that their inverses reproduce the sheet pictures.

### Case data
The 19 cases are stored as their reference alg strings exactly as printed on the sheet. The case pattern is derived, not transcribed: applying the inverse alg to a solved cube gives the case. Tests assert that each derived pattern keeps the sheet's 2x3 block on F (left two centre columns) and that all 19 patterns are distinct, which catches transcription errors.

### Scramble construction
1. Prefix: 20 random outer-face turns (no consecutive turns on the same face, and the last one never on the face of the first case move), so merging can never shorten it. Outer turns never move centres between faces, so all centres stay solved.
2. Choose an ordered adjacent side-face pair (X, Y) uniformly from the 8 options: X plays the sheet's U, Y the sheet's F. This fixes a whole-cube rotation from sheet frame to scramble frame (sheet R maps onto the U/D axis).
3. Append the inverse of the case alg, with each move rewritten through that rotation (e.g. sheet Rw becomes Uw or Dw, sheet U becomes the X face, M becomes E or E').
4. Append a random 0-3 quarter turns of X, then of Y (outer turns, so only those faces' patterns rotate).
5. Simplify: merge adjacent turns of the same layer and drop those that cancel.

The result is tested by simulation: for every case, every face pair and every orientation, the applied scramble leaves U, D and the two other sides solved, and the X/Y centres equal the expected rotated pattern.

### Randomness is injectable
Generator functions take a random source (default `Math.random`). Tests pass a seeded generator for determinism, and statistical tests ("every case appears") run a few thousand seeded scrambles.

### Case picture rendered as inline SVG
The revealed case is drawn by the app from the simulated state, not taken from VisualCube images: the colours and orientation differ every scramble, so the picture must come from the actual state. The two faces are drawn side by side as seen when looking at their shared edge with yellow on top (left face, right face), centres coloured, outer ring grey. The reference picture is the same renderer applied to the sheet frame (U above F, red/blue), so no external images are needed.

## Risks / Trade-offs

- [Wide moves at the end of the scramble can hint at the case] → Accepted for now (agreed in explore); the user will decide later whether to hide it, e.g. by appending further outer turns or solving to the case with a different alg.
- [Transcription errors in the 19 algs] → Derived-pattern tests (2x3 block kept, all distinct, other faces untouched) plus the explore thread's visual comparison against the sheet images.
- [Slice notation (E) on a 5x5 can be read as all three inner slices] → The trainer states that E means the single central slice; only case 3 produces it.

## Migration Plan

None: new app. Deployment to the OCI VM is a later change.
