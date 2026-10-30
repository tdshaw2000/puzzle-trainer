# Spec Delta

## Purpose

Generates 5x5 scrambles that leave the cube in a random case from the CubeSkills last-two-centres sheet, with the colours and orientation randomised, for Hoya-method L2C practice.

## ADDED Requirements

### Requirement: Case pool is the 19 sheet cases
The generator SHALL pick each scramble's case uniformly at random from the 19 non-solved cases of the CubeSkills 5x5 L2C sheet, each identified by its reference alg. The solved case SHALL never be chosen.

#### Scenario: Every case can be produced
- **WHEN** many scrambles are generated
- **THEN** each of the 19 cases appears
- **AND** no scramble produces already-solved centres

### Requirement: Scramble orientation and colour scheme
Scrambles SHALL be written for a cube held with yellow on U and green on F, using the standard colour scheme (white D, blue B, red L, orange R).

#### Scenario: Reference holding
- **WHEN** a scramble is displayed
- **THEN** it is stated that it is applied holding yellow on top and green in front

### Requirement: Resulting centre state
Applying a scramble to a solved cube SHALL leave the U (yellow) and D (white) centres solved, plus the two side centres not involved in the case. The other two side centres SHALL form the chosen case.

#### Scenario: Only the case faces are unsolved
- **WHEN** a generated scramble is applied to a solved 5x5
- **THEN** the white centre on D and the yellow centre on U are fully solved
- **AND** exactly two adjacent side faces have unsolved centres
- **AND** the face playing the sheet's top has the sheet's U-face case pattern turned by that face's chosen orientation
- **AND** the face playing the sheet's front has the sheet's F-face case pattern turned by that face's chosen orientation

### Requirement: The case moves around the cube
The pair of adjacent side faces holding the case SHALL be chosen at random from the four adjacent side-face pairs. Which face of the pair plays the role of the sheet's top face SHALL also be random.

#### Scenario: All face pairs occur
- **WHEN** many scrambles are generated
- **THEN** the case appears on each of the four pairs green/orange, orange/blue, blue/red and red/green
- **AND** for each pair, each face plays the sheet-top role in some scrambles

### Requirement: Face orientation is randomised
Each of the two case faces SHALL be rotated independently by a random 0, 1, 2 or 3 quarter turns relative to the sheet's presentation.

#### Scenario: Non-ideal orientations occur
- **WHEN** many scrambles are generated
- **THEN** each of the 16 combinations of rotations of the two faces occurs

### Requirement: Rest of the cube is scrambled
A scramble SHALL begin with a random sequence of at least 20 outer-face turns, so edges and corners are mixed up. No constraint is placed on the final state of edges and corners.

#### Scenario: Prefix scrambles the cube
- **WHEN** a scramble is generated
- **THEN** it starts with at least 20 outer-face turns, counted after redundant moves are merged
- **AND** no two consecutive turns in that prefix are on the same face

### Requirement: Scramble notation
Scrambles SHALL use standard cube notation: outer face turns (R L U D F B), two-layer wide turns (such as Uw, Dw), the single central slice E, and the suffixes ' and 2. On the 5x5, E means only the central (third) layer, turning like D. Adjacent turns of the same layer SHALL be merged, and turns that cancel out SHALL be removed.

#### Scenario: No redundant moves
- **WHEN** a scramble is generated
- **THEN** it contains no two consecutive moves of the same layer
- **AND** it contains no cube rotations

### Requirement: Case details accompany each scramble
Each scramble SHALL come with its case: the sheet case it uses, its reference alg, the two faces holding it (by position and centre colour), which of them plays the sheet's top (U) face and which the sheet's front (F) face, and the centre colours of those two faces after the scramble.

#### Scenario: Case details match the cube
- **WHEN** a scramble is generated
- **THEN** the reported face centres equal the centres of those faces after applying the scramble to a solved cube
