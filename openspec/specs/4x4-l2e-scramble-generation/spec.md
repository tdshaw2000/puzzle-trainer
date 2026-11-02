# 4x4-l2e-scramble-generation Specification

## Purpose

Generates 4x4 scrambles that leave the cube in a random case from the CubeSkills 4x4 last-two-edges sheet, with the edge colours and the case's position randomised, for L2E practice.

## Requirements

### Requirement: Case pool is the 5 sheet cases
The generator SHALL pick each scramble's case uniformly at random from the 5 cases of the CubeSkills sheet "4x4 – Useful Last 2 Edge Algorithms". Cases are numbered 1 to 5 in page order (left to right, top to bottom). Each case SHALL be defined by its pictured state, with the sheet's view: yellow on U, green on F. Its two unpaired edges are UF and UB (cases 1 and 2), UF and UR (cases 3 and 4), or UR and FL (case 5).

Each case SHALL carry the sheet's main alg as printed, except that moves the sheet prints without a space between them (`U2Rw'` in case 4, `F'R` in case 5) are shown spaced:

1. `Lw' U2 Rw' D2 Rw U2 Rw' D2 Rw2 x'`
2. `x' Rw2 D2 Rw' U2 Rw D2 Rw' U2 Lw'`
3. `Rw U2 Rw D Rw' U2 Rw D' Rw2'`
4. `Rw2 D Rw' U2 Rw D' Rw' U2 Rw'`
5. `R' (Uw' R U R' F R' F' R Uw) R`

The alternative algs printed under case 1 SHALL NOT be used.

#### Scenario: Every case can be produced
- **WHEN** many scrambles are generated
- **THEN** each of the 5 cases appears

#### Scenario: Each alg solves its picture
- **WHEN** a case's alg is applied to that case's pictured state
- **THEN** all edges are paired and all centres are solved, with white on D

### Requirement: Scramble orientation and colour scheme
Scrambles SHALL be written for a cube held with yellow on U and green on F, using the standard colour scheme (white D, blue B, orange R, red L), the same as the 5x5 trainers.

#### Scenario: Reference holding
- **WHEN** a scramble is displayed
- **THEN** it is stated that it is applied holding yellow on top and green in front

### Requirement: Resulting cube state
Applying a scramble to a solved 4x4 SHALL leave every centre solved (each face's four centre stickers its own colour), white on D and yellow on U. It SHALL leave exactly the case's two edges unpaired and every other edge paired. Corners and the positions of paired edges are not constrained.

#### Scenario: Only the case is unsolved
- **WHEN** a generated scramble is applied to a solved 4x4
- **THEN** all six centres are solved, with white on D
- **AND** the case's two edges, turned to the reported position, show the case's pictured pattern
- **AND** every other edge on the cube is paired

### Requirement: The colours keep changing
The two edges whose pieces form the case SHALL be chosen at random from the cube's 12 edges, with random orientation, so that over many scrambles every edge colour pair appears in the case. This includes edges with white or yellow.

#### Scenario: All edges occur
- **WHEN** many scrambles are generated
- **THEN** each of the 12 edge colour pairs appears in the case in some scramble

### Requirement: The case is turned to a random position
The case SHALL be placed in one of four positions, chosen at random: as the sheet shows it, or turned a quarter, half or three-quarter turn about the vertical axis. The rotation hint SHALL be the y turn (none, y, y2 or y') that, made before the alg, shows the case as the sheet does. For cases that look the same after y2 (1 and 2), the hint SHALL use the turn of fewest quarters (none instead of y2, y instead of y').

#### Scenario: All positions occur
- **WHEN** many scrambles are generated
- **THEN** each of the four positions appears

#### Scenario: Rotation hint
- **WHEN** the user makes the hinted y turn and then the case's alg
- **THEN** every edge is paired and every centre is solved

### Requirement: Scramble is only the setup and the case
A scramble SHALL be a setup of outer face turns, followed by the case's alg inverted and rewritten for the case's position, with redundant moves merged. The setup SHALL be a shortest sequence of outer face turns that brings the chosen edges, in their chosen orientation, to the slots where the inverted alg builds the case from. It SHALL contain no other moves.

#### Scenario: No filler moves
- **WHEN** a scramble is generated
- **THEN** it equals the setup followed by the rewritten inverse alg, after redundant moves are merged
- **AND** no shorter sequence of outer face turns places the chosen edges in those slots

### Requirement: Scramble notation
Scrambles SHALL use standard 4x4 notation: outer face turns (R L U D F B), two-layer wide turns (such as Rw, Lw, Uw), and the suffixes ' and 2. Scrambles SHALL contain no cube rotations. Adjacent turns of the same layer SHALL be merged, and turns that cancel out SHALL be removed.

#### Scenario: No rotations or redundant moves
- **WHEN** a scramble is generated
- **THEN** it contains no x, y or z
- **AND** it contains no two consecutive moves of the same layer

### Requirement: Case details accompany each scramble
Each scramble SHALL come with its case details: the case number, the alg as printed, the rotation hint, the cube after the scramble, and the positions of the case's pieces, so the screen can draw it.

#### Scenario: Case details match the cube
- **WHEN** a scramble is generated
- **THEN** the reported cube equals a solved cube after applying the scramble
