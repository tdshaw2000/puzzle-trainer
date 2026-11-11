# pairing-scramble-generation Specification

## Purpose

Generates 4x4 scrambles that leave the cube at the start of the edge-pairing stage of Hoya: centres and white cross solved, most of the other edges unpaired.

## Requirements

### Requirement: Scramble orientation and colour scheme
Scrambles SHALL be written for a cube held with yellow on U and green on F, using the standard colour scheme (white D, blue B, orange R, red L).

#### Scenario: Reference holding
- **WHEN** a scramble is displayed
- **THEN** it is stated that it is applied holding yellow on top and green in front

### Requirement: Resulting cube state
Applying a scramble to a solved 4x4 SHALL leave:
- every centre solved, with white on D and yellow on U;
- the four white edges (DF, DR, DB, DL) paired, in their home slots and oriented;
- at least 6 of the other 8 edges unpaired.

Corners, and the positions of paired non-white edges, are not constrained.

#### Scenario: Only the edges are unsolved
- **WHEN** a generated scramble is applied to a solved 4x4
- **THEN** all six centres are solved, with white on D
- **AND** the white cross is solved
- **AND** at least 6 of the 8 non-white edges are unpaired

### Requirement: The case keeps changing
Over many scrambles, pieces of every one of the 8 non-white edges SHALL appear among the unpaired edges, and unpaired edges SHALL occur in both the top layer and the middle layer.

#### Scenario: Variety
- **WHEN** many scrambles are generated
- **THEN** each of the 8 non-white edges is unpaired in some scramble
- **AND** unpaired edges occur in both the top layer and the middle layer

### Requirement: Scramble is undone pairing
A scramble SHALL be a sequence of pairing steps undone from solved, each optionally preceded by a U turn: slice-flip steps (Uw or Dw, a flip trigger `R U R' F R' F' R` or `L' U' L F' L F L'` for any of the four sides, the slice undone) and insertion steps (`R U R'`, `R U' R'`, `R U2 R'`, `L' U L`, `L' U' L`, `L' U2 L` for any of the four sides). The scramble SHALL contain no other moves.

#### Scenario: Built from steps
- **WHEN** a scramble is generated
- **THEN** before merging it is a sequence of the steps above
- **AND** centres and cross are intact after every step

### Requirement: Length
A scramble SHALL be at most 60 moves after merging.

#### Scenario: Length cap
- **WHEN** many scrambles are generated
- **THEN** none is over 60 moves

### Requirement: Scramble notation
Scrambles SHALL use outer face turns (U D F B R L), the two-layer turns Uw and Dw, and the suffixes ' and 2, with no rotations. Adjacent turns of the same layer SHALL be merged, and turns that cancel out removed.

#### Scenario: No rotations or redundant moves
- **WHEN** a scramble is generated
- **THEN** it contains no x, y, z, M, E or S
- **AND** it contains no two consecutive moves of the same layer

### Requirement: Case details accompany each scramble
Each scramble SHALL come with the names of the unpaired edges, the positions of their wings, and the cube's stickers after the scramble.

#### Scenario: Details match the cube
- **WHEN** a scramble is generated
- **THEN** the reported edges are exactly the unpaired edges of the cube after applying the scramble to a solved cube
- **AND** the reported stickers equal those of that cube
