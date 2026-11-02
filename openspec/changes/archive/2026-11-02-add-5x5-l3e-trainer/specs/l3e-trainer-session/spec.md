# Spec Delta

## Purpose

Defines the practice loop on the 5x5 Last 3 Edges screen: show a scramble, let the user reveal (and hide again) the case, then move on to the next scramble.

## ADDED Requirements

### Requirement: A scramble is shown on arrival
When the Last 3 Edges screen opens, it SHALL show a freshly generated scramble in a large, readable font, with the reminder to hold the cube with yellow on top and green in front. The case SHALL be hidden.

#### Scenario: Opening the trainer
- **WHEN** the user opens 5x5 › Last 3 Edges
- **THEN** a scramble is displayed
- **AND** the toggle reads "Show case"
- **AND** there is no "Show solution" control

### Requirement: The case can be revealed
The screen SHALL offer a "Show case" toggle. Showing the case SHALL reveal:
- a picture of the cube as it is after the scramble: the U face, with the F, R, B and L faces folded out around it, green at the bottom. Only the stickers of the pieces in the three unpaired slots are coloured; all other stickers are neutral;
- the three slots, as text in F, R, B, L order (for example "Unpaired: FR, FL, BL").

While the case is shown, the toggle SHALL read "Hide case", and using it SHALL hide the case. Using it again SHALL show the same case for the same scramble. The toggle SHALL never be disabled.

#### Scenario: Revealing and hiding the case
- **WHEN** the user selects "Show case"
- **THEN** the picture and the slot names are shown
- **AND** the toggle reads "Hide case"
- **WHEN** the user then selects "Hide case"
- **THEN** the case is hidden and the toggle reads "Show case"

#### Scenario: Picture matches the scramble
- **WHEN** the case is revealed
- **THEN** every coloured sticker in the picture has the colour that position has after applying the scramble to a solved cube held yellow-top, green-front

### Requirement: Moving to the next scramble
The screen SHALL offer a "Next" action, also reachable with the space bar, that shows a new scramble and hides the case, resetting the toggle.

#### Scenario: Next scramble
- **WHEN** the user selects "Next" or presses space
- **THEN** a new scramble is shown with the case hidden
- **AND** a single press of space produces exactly one new scramble, even when the Next button has focus

### Requirement: Usable on a phone
The screen SHALL be usable 375px wide with no horizontal scrolling, with the case shown.

#### Scenario: Narrow viewport
- **WHEN** the screen is viewed 375px wide with the case shown
- **THEN** the scramble, buttons and case fit without horizontal scrolling
