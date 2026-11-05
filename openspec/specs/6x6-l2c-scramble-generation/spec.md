# 6x6-l2c-scramble-generation Specification

## Purpose

Generates 6x6 scrambles that leave the cube in a random case from the SpeedCubeDB 6x6 last-two-centres sheet, with the colours and orientation randomised, for L2C practice.

## Requirements

### Requirement: Case pool is the 32 sheet cases
The generator SHALL pick each scramble's case uniformly at random from the 32 distinct cases of the sheet "6x6 Last Two Centers" (33 entries, the two identical "Pair and a Nice 3 Bar" / "L and a Bar" entries merged), numbered 1 to 32 in sheet order, with the pictures and algs of the table in the proposal. Each case SHALL carry all the algs the sheet prints for it, exactly as printed, in sheet order (one alg for every case except Inner Center and Outer Center, which have two). The solved case SHALL never be chosen.

#### Scenario: Every case can be produced
- **WHEN** many scrambles are generated
- **THEN** each of the 32 cases appears
- **AND** no scramble produces already-solved centres

#### Scenario: Each alg solves its picture
- **WHEN** a case's alg is applied to that case's pictured state (yellow U, green F, other centres solved)
- **THEN** every centre of the 6x6 is solved

### Requirement: Scramble orientation and colour scheme
Scrambles SHALL be written for a cube held with yellow on U and green on F, using the standard colour scheme (white D, blue B, red L, orange R), the same as the other trainers. White SHALL stay on D; no scramble uses whole-cube rotations.

#### Scenario: Reference holding
- **WHEN** a scramble is displayed
- **THEN** it is stated that it is applied holding yellow on top and green in front

### Requirement: Resulting centre state
Applying a scramble to a solved 6x6 SHALL leave the U (yellow) and D (white) centres solved, plus the two side centres not involved in the case. The other two side centres SHALL form the chosen case: the face playing the sheet's top has the sheet's U pattern turned by its chosen orientation, and the face playing the sheet's front the F pattern turned by its chosen orientation.

#### Scenario: Only the case faces are unsolved
- **WHEN** a generated scramble is applied to a solved 6x6
- **THEN** D and U centres are fully solved, and so are the two side faces not holding the case
- **AND** the two case faces show the case's patterns as described, using their own colours as "own" and each other's as "other"

### Requirement: The case moves around the cube
The pair of adjacent side faces holding the case SHALL be chosen at random from the four adjacent pairs, and which of the two plays the sheet's top SHALL also be random.

#### Scenario: All face pairs occur
- **WHEN** many scrambles are generated
- **THEN** the case appears on each of the four pairs green/orange, orange/blue, blue/red and red/green, with each face of each pair playing the sheet-top role in some scrambles

### Requirement: Face orientation is randomised
Each of the two case faces SHALL be turned independently by a random 0, 1, 2 or 3 quarter turns relative to the sheet's presentation. A turn that leaves that face's 4x4 centre block looking the same SHALL be reduced to the fewest turns giving the same centres. The reported turns SHALL be the turns applied.

#### Scenario: All orientations occur
- **WHEN** many scrambles are generated
- **THEN** each combination of orientations of the two faces that gives a distinct look occurs

#### Scenario: No wasted orientation turn
- **WHEN** a scramble is generated
- **THEN** leaving out either face's orientation turn would give different centres on that face

### Requirement: Scramble is only the case setup
A scramble SHALL consist only of the case alg inverted and rewritten for the chosen faces, followed by the orientation turns of the two case faces, with redundant moves merged. It SHALL contain no other moves.

#### Scenario: No filler moves
- **WHEN** a scramble is generated
- **THEN** it equals the case setup followed by at most one outer turn of each case face, after redundant moves are merged

### Requirement: Scramble notation
Scrambles SHALL use standard 6x6 notation: outer face turns (R L U D F B), two-layer wide turns (such as Rw), three-layer wide turns (such as 3Rw), single third-layer turns (such as 3R, 3L, 3U), and the suffixes ' and 2. Adjacent turns of the same layer SHALL be merged, turns that cancel SHALL be removed, and there SHALL be no cube rotations.

#### Scenario: No redundant moves
- **WHEN** a scramble is generated
- **THEN** it contains no two consecutive moves of the same layer and no x, y or z

### Requirement: Case details accompany each scramble
Each scramble SHALL come with its case number and name, the alg as printed, the two faces holding it (by position and colour), which plays the sheet's top and which the sheet's front, the turns applied, the rotation hint, and the two faces' centres after the scramble.

#### Scenario: Case details match the cube
- **WHEN** a scramble is generated
- **THEN** the reported face centres equal the centres of those faces after applying the scramble to a solved cube
