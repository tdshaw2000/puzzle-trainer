## MODIFIED Requirements

### Requirement: The target case can be revealed
The screen SHALL offer a "Show case" action. Using it SHALL reveal the case for the current scramble:
- a picture of the two case faces as they look after the scramble (centres coloured, the outer ring neutral), drawn side by side as seen looking at their shared vertical edge with yellow on top and white at the bottom;
- the face positions and colours, and which face plays the sheet's top (U) face and which the sheet's front (F) face;
- the y rotation (none, y, y' or y2) that brings the left face of the pair (the left one in the picture) to the front;
- the sheet's reference picture (sheet top face above sheet front face, in the colours of the faces playing those roles) and its alg.

The action SHALL be a toggle. While the case is shown it SHALL read "Hide case", and using it SHALL hide the case again; using it once more SHALL show the same case for the same scramble. The action SHALL stay available (never disabled) in both states.

#### Scenario: Revealing the case
- **WHEN** the user selects "Show case"
- **THEN** the case picture, face labels, rotation hint and reference alg for the current scramble are shown
- **AND** the action now reads "Hide case"

#### Scenario: Hiding the case again
- **WHEN** the case is shown and the user selects "Hide case"
- **THEN** the case is hidden
- **AND** the action reads "Show case" again

#### Scenario: Showing the same case again
- **WHEN** the user hides the case and then selects "Show case" again without moving to the next scramble
- **THEN** the same case is shown as before

#### Scenario: Rotation hint
- **WHEN** the case is on the pair green/orange, orange/blue, blue/red or red/green (left face first)
- **THEN** the rotation hint is none, y, y2 or y' respectively

#### Scenario: Sheet roles are shown
- **WHEN** the case is revealed
- **THEN** the screen says which face colour plays the sheet's top face and which plays the sheet's front face

#### Scenario: Picture matches the scramble
- **WHEN** the case is revealed
- **THEN** every centre sticker in the picture has the colour that face position has after applying the scramble to a solved cube held yellow-top, green-front

### Requirement: Moving to the next scramble
The screen SHALL offer a "Next" action that replaces the current scramble with a new one and hides the case again, with the toggle reading "Show case". Next SHALL also be reachable with the space bar.

#### Scenario: Next scramble
- **WHEN** the user selects "Next" or presses space
- **THEN** a new scramble is shown
- **AND** the case is hidden and the toggle reads "Show case"
- **AND** a single press of space produces exactly one new scramble, even when the Next button has focus
