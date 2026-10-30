## ADDED Requirements

### Requirement: Scramble is only the case setup
A scramble SHALL consist only of the sheet case alg inverted and rewritten for the chosen face pair, followed by the orientation turns of the two case faces, with redundant moves merged. It SHALL contain no other moves: no outer turns of U, D, or the two side faces not holding the case.

#### Scenario: No filler moves
- **WHEN** a scramble is generated
- **THEN** it equals the case setup moves followed by at most one outer turn of each case face, after redundant moves are merged
- **AND** it contains no outer U or D turns and no turns of the two side faces not holding the case

## MODIFIED Requirements

### Requirement: Face orientation is randomised
Each of the two case faces SHALL be rotated independently by a random 0, 1, 2 or 3 quarter turns relative to the sheet's presentation. A turn that leaves that face's centres looking the same SHALL be reduced to the smallest turn giving the same centres, so no orientation turn is wasted. The reported turns SHALL be the turns actually applied.

#### Scenario: Non-ideal orientations occur
- **WHEN** many scrambles are generated
- **THEN** each of the 16 combinations of rotations of the two faces occurs

#### Scenario: No wasted orientation turn
- **WHEN** a scramble is generated
- **THEN** leaving out either face's orientation turn would give different centres on that face

## REMOVED Requirements

### Requirement: Rest of the cube is scrambled
**Reason**: Outer-face filler turns never change the centres, which are the point of this trainer, so the user wants them gone.
**Migration**: None. Edges and corners are left however the case setup leaves them.
