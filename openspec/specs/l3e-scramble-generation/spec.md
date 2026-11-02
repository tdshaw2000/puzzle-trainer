# l3e-scramble-generation Specification

## Purpose

Generates 5x5 scrambles that leave the cube at the start of the last stage of Hoya 3-2-3 edge pairing: centres and white cross solved, and the last 3 edges unpaired in the middle layer.

## Requirements

### Requirement: Scramble orientation and colour scheme
Scrambles SHALL be written for a cube held with yellow on U and green on F, using the standard colour scheme (white D, blue B, orange R, red L), the same as the other 5x5 trainers.

#### Scenario: Reference holding
- **WHEN** a scramble is displayed
- **THEN** it is stated that it is applied holding yellow on top and green in front

### Requirement: Resulting cube state
Applying a scramble to a solved 5x5 SHALL leave:
- every centre solved, with white on D and yellow on U;
- the four white edges (DF, DR, DB, DL) paired, in their home slots and oriented;
- exactly three edges unpaired, all three in slots of the middle layer (FR, FL, BR, BL);
- every other edge paired.

Corners, and the positions of paired non-white edges, are not constrained.

#### Scenario: Only the last 3 edges are unsolved
- **WHEN** a generated scramble is applied to a solved 5x5
- **THEN** all six centres are solved, with white on D
- **AND** the white cross is solved
- **AND** exactly three edges are unpaired, each in FR, FL, BR or BL
- **AND** every other edge is paired

### Requirement: The case keeps changing
Which three middle-layer slots hold the unpaired edges, and which edges' pieces they hold, SHALL vary at random. Over many scrambles, every choice of three of the four middle-layer slots SHALL occur, and pieces of every one of the 8 non-white edges SHALL appear among the unpaired edges.

#### Scenario: All slot sets occur
- **WHEN** many scrambles are generated
- **THEN** each of the four sets of three middle-layer slots is the unpaired set in some scramble

#### Scenario: All colours occur
- **WHEN** many scrambles are generated
- **THEN** pieces of each of the 8 non-white edges appear among the unpaired edges in some scramble

### Requirement: Scramble is undone pairing
A scramble SHALL be a sequence of pairing steps undone from solved, each optionally preceded by a U turn:
- a slice-flip step: a slice turn Uw or Dw, a flip trigger (`R U R' F R' F' R` or `L' U' L F' L F L'`, rewritten for any of the four sides), and that slice turn undone;
- an insertion step: `R U R'`, `R U' R'`, `R U2 R'`, `L' U L`, `L' U' L` or `L' U2 L`, rewritten for any of the four sides.

After every step, at most three edges SHALL be unpaired, all in the middle layer. A scramble SHALL contain at least 3 slice-flip steps. It SHALL contain no other moves.

#### Scenario: Built from steps
- **WHEN** a scramble is generated
- **THEN** before merging it is a sequence of the steps above, at least 3 of them slice-flip steps

### Requirement: Scramble notation
Scrambles SHALL use outer face turns (U D F B R L), the two-layer turns Uw and Dw, and the suffixes ' and 2. They SHALL contain no cube rotations and no single-slice turns. Adjacent turns of the same layer SHALL be merged, and turns that cancel out SHALL be removed.

#### Scenario: No rotations or redundant moves
- **WHEN** a scramble is generated
- **THEN** it contains no x, y, z, M, E or S
- **AND** it contains no two consecutive moves of the same layer

### Requirement: Case details accompany each scramble
Each scramble SHALL come with the names of the three slots holding the unpaired edges, the positions of their pieces, and the cube's stickers after the scramble, so the screen can draw it.

#### Scenario: Details match the cube
- **WHEN** a scramble is generated
- **THEN** the reported slots are exactly the unpaired slots of the cube after applying the scramble to a solved cube
- **AND** the reported stickers equal those of that cube
