# Spec Delta

## Purpose

Generates 5x5 scrambles that leave the cube in a random case from the Kewbz last-two-edges guide, with the edge colours and the case's position randomised, for Hoya-method L2E practice.

## ADDED Requirements

### Requirement: Case pool is the 12 guide cases
The generator SHALL pick each scramble's case uniformly at random from the 12 cases of the Kewbz 5x5 L2E guide. Cases are numbered 1 to 12 in page order (left to right, top to bottom). Each case SHALL be defined by its pictured state: two edges on the U layer, the guide's front edge (UF in the picture) and back edge (UB in the picture), each made of a left wing, a midge and a right wing.

Each case SHALL carry the alg the trainer shows for it. For cases 2 to 12 this is the guide's alg exactly as printed. For case 1 it is `M U' R' U R' F R F' M'`, because the printed `M' U' R' U R' F R F' M` does not solve the pictured case on a standard cube. *(Pending the user's choice: see the proposal.)*

#### Scenario: Every case can be produced
- **WHEN** many scrambles are generated
- **THEN** each of the 12 cases appears

#### Scenario: Each alg solves its picture
- **WHEN** a case's alg is applied to that case's pictured state
- **THEN** all edges are paired and all centres are solved

### Requirement: Scramble orientation and colour scheme
Scrambles SHALL be written for a cube held with yellow on U and green on F, using the standard colour scheme (white D, blue B, orange R, red L), the same as the L2C trainer.

#### Scenario: Reference holding
- **WHEN** a scramble is displayed
- **THEN** it is stated that it is applied holding yellow on top and green in front

### Requirement: Resulting cube state
Applying a scramble to a solved cube SHALL leave every centre solved, white on D and yellow on U. It SHALL leave exactly the case's unpaired edges unpaired (two for every case except case 3, whose back edge is already paired), and every other edge paired. Corners and the positions of paired edges are not constrained.

#### Scenario: Only the case is unsolved
- **WHEN** a generated scramble is applied to a solved 5x5
- **THEN** all six centres are solved, with white on D
- **AND** the two U-layer edges at the case's position show the case's pictured pattern, with the guide's front edge at the reported position
- **AND** every other edge on the cube is paired

### Requirement: The colours keep changing
The edges whose pieces form the case (two, or one for case 3) SHALL be chosen at random from the cube's 12 edges, with random orientation, so that over many scrambles every edge colour pair appears in the case. This includes edges with white or yellow.

#### Scenario: All edges occur
- **WHEN** many scrambles are generated
- **THEN** each of the 12 edge colour pairs appears in the case in some scramble

### Requirement: The case moves around the U layer
The guide's front edge SHALL be placed at UF, UR, UB or UL, chosen at random, with the guide's back edge opposite it. The reported rotation hint SHALL be the y turn (none, y, y2 or y') that brings the guide's front edge to UF. For cases that look the same after y2 (1, 2, 7, 8, 11 and 12), the hint SHALL use the turn of fewest quarters (none instead of y2, y instead of y'), so a hint is never longer than it needs to be.

#### Scenario: All positions occur
- **WHEN** many scrambles are generated
- **THEN** the guide's front edge appears at each of UF, UR, UB and UL

#### Scenario: Rotation hint
- **WHEN** the guide's front edge is at UF, UR, UB or UL in a case that does not look the same after y2
- **THEN** the hint is none, y, y2 or y' respectively

### Requirement: Scramble is only the setup and the case
A scramble SHALL be a setup of outer face turns, followed by the case's alg inverted and rewritten for the case's position, with redundant moves merged. The setup SHALL be a shortest sequence of outer face turns that brings the chosen edges, in their chosen orientation, to the slots where the inverted alg builds the case from. It SHALL contain no other moves.

#### Scenario: No filler moves
- **WHEN** a scramble is generated
- **THEN** it equals the setup followed by the rewritten inverse alg, after redundant moves are merged
- **AND** no shorter sequence of outer face turns places the chosen edges in those slots

### Requirement: Scramble notation
Scrambles SHALL use standard notation: outer face turns (R L U D F B), two-layer wide turns (such as Rw, Lw, Fw), the single central slices M and S, and the suffixes ' and 2. On the 5x5, M and S mean only the central (third) layer, M turning like L and S turning like F. Scrambles SHALL contain no cube rotations. Adjacent turns of the same layer SHALL be merged, and turns that cancel out SHALL be removed.

#### Scenario: No rotations or redundant moves
- **WHEN** a scramble is generated
- **THEN** it contains no x, y or z
- **AND** it contains no two consecutive moves of the same layer

### Requirement: Case details accompany each scramble
Each scramble SHALL come with its case details: the case number, the alg the trainer shows, where the guide's front edge is, the rotation hint, and the stickers of the U layer and the U-layer edges' side stickers after the scramble, so the screen can draw it.

#### Scenario: Case details match the cube
- **WHEN** a scramble is generated
- **THEN** the reported stickers equal those on the cube after applying the scramble to a solved cube
