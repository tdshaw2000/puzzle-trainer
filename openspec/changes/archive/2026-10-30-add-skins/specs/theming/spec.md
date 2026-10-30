## ADDED Requirements

### Requirement: Skin picker
Every screen SHALL offer a gear-menu control, in the top-right corner, letting the user pick from a fixed list of skins. The menu SHALL list the skins by display label in this order: Minimal, Dark, DOS, Mario, Monkey, VHS. The current skin SHALL be marked in the menu.

#### Scenario: Opening the skin menu
- **WHEN** the user opens the gear menu on any screen (home, a trainer or not found)
- **THEN** they see "Minimal", "Dark", "DOS", "Mario", "Monkey" and "VHS" in that order
- **AND** the current skin is marked as current

#### Scenario: Picking a skin
- **WHEN** the user selects a skin from the menu
- **THEN** that skin's styling applies immediately, without a page reload
- **AND** the current scramble and whether the case is shown are unchanged
- **AND** the selected skin is now the one marked as current, and the menu closes

#### Scenario: Closing the menu without picking
- **WHEN** the menu is open and the user taps or clicks outside it
- **THEN** the menu closes and the skin is unchanged

### Requirement: Skin persistence
The user's skin choice SHALL persist on their device across visits and screens. The remembered skin SHALL be applied before the page is first drawn. If the device's storage cannot be read or written, picking a skin SHALL still apply it for the current visit.

#### Scenario: Returning with a previously chosen skin
- **WHEN** the user who picked a skin opens the app again later
- **THEN** that skin is applied without re-picking it

#### Scenario: Storage unavailable
- **WHEN** browser storage throws on read or write
- **THEN** the app shows the default skin and picking a skin still changes it

### Requirement: Default skin
A user with no remembered skin, or a remembered value that is not one of the listed skins, SHALL see Minimal.

#### Scenario: First-time visitor
- **WHEN** a visitor with no skin preference opens the app
- **THEN** they see Minimal, whatever their device's light/dark setting

#### Scenario: Unknown remembered value
- **WHEN** the remembered skin is not one of the six listed skins
- **THEN** the app shows Minimal

### Requirement: Cube colours are independent of the skin
Cube pictures SHALL use the real cube sticker colours in every skin.

#### Scenario: Case picture under another skin
- **WHEN** a skin other than Minimal is active and the case is shown
- **THEN** every sticker in the case pictures has the same colour it has under Minimal
