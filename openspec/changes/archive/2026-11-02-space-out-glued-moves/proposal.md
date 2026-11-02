# Proposal: Space out glued moves in shown algs

## Why

The 4x4 L2E sheet prints `U2Rw'` (case 4) and `F'R` (case 5) without a space, and the 5x5 L2E guide prints `x'U2` (case 6). The trainers showed these as printed. The user asked (2026-11-02) for the missing spaces to be fixed, saying their approval of "as printed" was a mistake.

## What Changes

- 4x4 case 4 shows `Rw2 D Rw' U2 Rw D' Rw' U2 Rw'`; case 5 shows `R' (Uw' R U R' F R' F' R Uw) R`.
- 5x5 case 6 shows `... U2' x' U2 Rw' ...`.
- Nothing else changes: `Rw2'` and `U2'` stay as printed, and scrambles are unaffected (the moves are the same).

## Specs

`4x4-l2e-scramble-generation`, `4x4-l2e-trainer-session` and `l2e-scramble-generation` are updated in place.
