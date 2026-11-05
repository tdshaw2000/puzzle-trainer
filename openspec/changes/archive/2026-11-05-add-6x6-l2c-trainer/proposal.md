# Proposal: 6x6 Last Two Centres trainer

## Why

The user wants to drill 6x6 last-two-centres (L2C) the way they drill the 5x5 steps. They learn it from the SpeedCubeDB page "6x6 Last Two Centers", which they uploaded as a PDF (15 pages, 33 entries). Each entry shows the two last centres as 4x4 centre blocks (U face above F face, yellow and green) with an alg. A few entries list a second alg.

## What Changes

- A new puzzle group, "6x6", on the home page after 4x4 and 5x5, with one trainer, "Last Two Centres", at `#/6x6/l2c`.
- Each scramble leaves the 6x6 with white on D and four of the six centres solved; the other two (adjacent) centres show one of the sheet's cases, picked at random. The pair of faces is random (as on the 5x5 trainer: 4 adjacent side-face pairs, either face playing the sheet's top), and each of the two faces is independently turned a random 0 to 3 quarter turns. The colours of the case therefore change every time.
- No filler moves. A scramble is the case alg inverted and rewritten for the chosen faces, plus the orientation turns of the two case faces, with redundant moves merged (the same rule as 5x5 L2C).
- The practice loop matches the 5x5 L2C trainer: scramble on arrival, "Show case" / "Hide case" toggle, "Show solution" / "Hide solution" toggle, "Next" (also space). Skins apply as everywhere. No timer or stats.
- "Show case" shows the two case faces after the scramble (6x6 faces, 4x4 centres coloured, outer ring neutral), the face colours and roles, the rotation hint (none, y, y2, y'), the case number and name ("Case N of 32"), and the sheet's picture of the case. "Show solution" shows the sheet's algs exactly as printed, every one when a case has several.

### The 32 cases

The sheet has 33 entries but two are the same case: "Pair and a Nice 3 Ba[r]" and the first "L and a Bar" have identical pictures and the identical alg `3R U' Rw U 3Rw'`. They are merged (case 19), leaving 32. Numbers follow the sheet's order. (The sheet's title "Pair and a Nice 3 Ba" is cut off in the PDF; the trainer completes it to "Pair and a Nice 3 Bar".) Several entries share a name (e.g. two "Triangle"); the trainer shows the sheet's name with the case number.

Pictures are written as the 4x4 centre of the sheet's U face and F face, row by row from the top, Y = yellow, G = green (U seen from above with the back row at the top, F seen from the front).

| # | Sheet name | Alg (as printed) | U face | F face |
|---|---|---|---|---|
| 1 | Inner Center | `3L' U 3R U' 3L U 3R'` | `YYYY/YGYY/YYYY/YYYY` | `GGGG/GYGG/GGGG/GGGG` |
| 2 | Outer Center | `U F Rw U' 3L' U Rw' U' 3L` | `YGYY/YYYY/YYYY/YYYY` | `GYGG/GGGG/GGGG/GGGG` |
| 3 | Front 3 Bar | `U Rw U 3R U Rw' U' 3R'` | `YYGY/YYYY/YYYY/GYGG` | `GGGY/GGGY/GGGY/GGGY` |
| 4 | Back 3 Bar | `U' Rw U' 3R U' Rw' U 3R'` | `GYGG/YYYY/YYYY/YYGY` | `GGGY/GGGY/GGGY/GGGY` |
| 5 | Pair and Split | `U' Rw U' Rw' U' 3R U Rw U' Rw' U Rw U' 3Rw'` | `YYGG/YYYY/YYYY/GYGY` | `GGGY/GGGY/GGGY/GGGY` |
| 6 | Pair and Split | `U Rw U Rw' U 3R U' Rw U Rw' U' Rw U 3Rw'` | `GYGY/YYYY/YYYY/YYGG` | `GGGY/GGGY/GGGY/GGGY` |
| 7 | Two Splits | `U Rw U Lw' 3R U Rw' U' Lw 3R'` | `GYGY/YYYY/YYYY/GYGY` | `GGGY/GGGY/GGGY/GGGY` |
| 8 | Two Pairs | `U' Rw U 3Lw' U Rw' U' 3Lw` | `YYGG/YYYY/YYYY/YYGG` | `GGGY/GGGY/GGGY/GGGY` |
| 9 | Split and a Pair | `Rw U Rw' U2 Rw U' 3Lw' U Rw' U' 3Lw` | `YYGY/YYYY/YYYY/YYGY` | `GGGG/GGGY/GGGY/GGGG` |
| 10 | Split and a Bar | `Rw U Rw' U2 Rw U 3R U' Rw' U 3R'` | `GYGY/YYYY/YYYY/YYGY` | `GGGG/GGGY/GGGY/GGGY` |
| 11 | Split and a Bar | `Rw U' Rw' U2 Rw U' 3R U Rw' U' 3R'` | `YYGY/YYYY/YYYY/GYGY` | `GGGY/GGGY/GGGY/GGGG` |
| 12 | Pair and a Bar | `U2 Rw U Rw' U2 Rw U' 3R U Rw' U' 3R'` | `YYGY/YYYY/YYYY/YYGG` | `GGGG/GGGY/GGGY/GGGY` |
| 13 | Pair and a Bar | `U2 Rw U' Rw' U2 Rw U 3R U' Rw' U 3R'` | `YYGG/YYYY/YYYY/YYGY` | `GGGY/GGGY/GGGY/GGGG` |
| 14 | Split and a Bad Bar | `U' Rw U Rw' U Rw 3L' U' Rw' U 3L` | `YYGY/YYYY/YYYY/GYGY` | `GGGG/GGGY/GGGY/GGGY` |
| 15 | Split and a Bad Bar | `U Rw U' Rw' U' Rw 3L' U Rw' U' 3L` | `GYGY/YYYY/YYYY/YYGY` | `GGGY/GGGY/GGGY/GGGG` |
| 16 | Pair and a Bad Bar | `U Rw U Rw' U 3Rw U' Rw' U 3R'` | `YYGG/YYYY/YYYY/YYGY` | `GGGG/GGGY/GGGY/GGGY` |
| 17 | Pair and a Bad Bar | `U' Rw U' Rw' U' 3Rw U Rw' U' 3R'` | `YYGY/YYYY/YYYY/YYGG` | `GGGY/GGGY/GGGY/GGGG` |
| 18 | Stray Obliques | `3Rw U' Rw' U' Rw U2 3Rw' U Rw U Rw'` | `YYYY/YYYG/YYYY/YGYY` | `GGGG/GGGY/GGGY/GGGG` |
| 19 | Pair and a Nice 3 Bar | `3R U' Rw U 3Rw'` | `YYYG/YYYG/YYYG/YYYY` | `GGGG/GGGG/GGGY/GGYY` |
| 20 | L and a Bar | `U' 3Rw U Rw' U' 3R'` | `YYYG/YYYG/YYYY/YGYY` | `GGGG/GGGY/GGGY/GGGY` |
| 21 | Pair and a Bad Bar | `U2 3Lw' U' Lw U 3L U Rw U Rw'` | `YYYY/YYYG/YYYY/GGYY` | `GGGG/GGGY/GGGY/GGGY` |
| 22 | Pair and a Bad Bar | `U 3Lw' U Lw U' 3L U' Rw U' Rw'` | `YYYG/YYYG/YYYY/YGYY` | `GGGY/GGGY/GGGY/GGGG` |
| 23 | Bar and Scatter | `Rw' 3L F' Rw F 3L'` | `YYYG/YYYG/YYYG/YYYY` | `GGGG/GGGG/GGGY/YGYG` |
| 24 | Bar and Scatter | `U' 3L F Rw' F' 3L' Rw` | `YYYY/YYYG/YYYY/YGYG` | `GGGG/GGGY/GGGY/GGGY` |
| 25 | Front 3 Bar | `U' 3R U Rw U' Rw' U Rw U' 3Rw'` | `YYYY/YYYG/YYYY/GGYG` | `GGGY/GGGY/GGGY/GGGY` |
| 26 | Right 3 Bar | `3R U' Rw U Rw' U' Rw U 3Rw'` | `YYYG/YYYG/YYYY/YGYG` | `GGGY/GGGY/GGGY/GGGY` |
| 27 | Two Pairs | `Rw U2 3Lw' U Rw' U' 3Lw` | `YYYG/YYYG/YYYY/GGYY` | `GGGY/GGGY/GGGY/GGGY` |
| 28 | Kite | `Rw U2 Rw' U Rw 3L' U' Rw' U 3L` | `GYYY/YYYG/YYYY/YGYG` | `GGGY/GGGY/GGGY/GGGY` |
| 29 | Triangle | `U2 Rw U' Rw' U2 3Rw U Rw' U' 3R'` | `GYYY/YYYG/YYYY/YGYY` | `GGGY/GGGY/GGGY/GGGG` |
| 30 | Triangle | `U Rw U Rw' U2 3Rw U' Rw' U 3R'` | `GYYY/YYYG/YYYY/YGYY` | `GGGG/GGGY/GGGY/GGGY` |
| 31 | Pair and Shape | `U' Rw U2 Rw' U' 3R' F Rw' F' 3Rw` | `GYYY/YYYG/YYYY/GGYY` | `GGGY/GGGY/GGGY/GGGY` |
| 32 | Pair and Shape | `Rw U2 Rw' U 3R' F' Rw' F 3Rw` | `GYYG/YYYG/YYYY/YGYY` | `GGGY/GGGY/GGGY/GGGY` |

Entries with a second alg: Inner Center (`3L' U 3R U' 3L U 3R' U'`) and Outer Center (`3L' U 2R U' 3L U 2R'`). Where a case has more than one alg, all are shown, in sheet order. Only these two cases have a second alg. The second algs have not been simulated yet (the check below covers the 33 first algs); the build's tests will check them the same way, and any that fails the check will be raised with you rather than shown. `2R` means only the second layer from R, so the parser also gains single second-layer turns.

### Alg checks

All 33 entries were simulated on a 6x6 model (`Rw` = two layers, `3R` = the third layer only, `3Rw` = three layers, `3L` = third layer from the left, `Lw`, `3Lw` likewise). For every entry, the inverted alg applied to a solved cube gives exactly the pictured U and F centres (all 16 + 16 stickers), leaves D, B, L and R centres solved, and the alg then solves it. No alg needs correcting and none has an obvious notation typo, so all are shown exactly as printed. Files: `6x6-l2c-trainer/alg-check-sim6.py`, `sheet-algs.txt`, `sheet-pictures.txt` in the shared folder.

## Capabilities

### New Capabilities

- `6x6-l2c-scramble-generation`: the 32 cases and how a scramble is built.
- `6x6-l2c-trainer-session`: the 6x6 Last Two Centres screen and its practice loop.

### Modified Capabilities

- `trainer-navigation`: the catalogue gains the 6x6 group and its address.

## Impact

- Cube library: the sticker model becomes available for 6x6 (`cubeModel(6)`); the notation parser gains 3-layer wide turns (`3Rw`), single inner layers (`3R`, `3L`) and the 6x6 whole-cube rotations. 4x4 and 5x5 behaviour is unchanged.
- The 5x5 L2C case, scramble and render code is generalised by cube size so both trainers share it; the 5x5 trainer keeps its tests and behaviour.
- New 6x6 files under `src/trainers/`, a registry entry, styles, README, and `scripts/check-mobile.cjs` covers the new screen.
- No change to the other trainers, skins or deployment.

## Out of scope

- Timer and stats.
- 6x6 centre cases not on the sheet, other 6x6 trainers (edges, parity).
- Disguising the scramble (as on the 5x5 L2C trainer).
