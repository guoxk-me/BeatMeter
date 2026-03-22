## ADDED Requirements

### Requirement: Dual-module app shell
The system SHALL expose metronome and fitness guidance as the two primary destinations in the application shell.

#### Scenario: View primary destinations
- **WHEN** the user lands on the main application shell
- **THEN** the system presents both metronome and fitness guidance as primary entry points

#### Scenario: Keep destination naming consistent
- **WHEN** the user navigates between top-level destinations
- **THEN** the system uses consistent naming and does not show conflicting legacy labels

### Requirement: In-app branding update
The system SHALL use the new in-app product branding across key surfaces, and SHALL centralize the display name so it can be replaced without editing scattered strings.

#### Scenario: Render branded app title
- **WHEN** the user views major branded surfaces such as the home header or about page
- **THEN** the system shows the same configured product name on each surface

#### Scenario: Preserve behavior while branding changes
- **WHEN** the in-app product name is updated through configuration or constants
- **THEN** the system updates display text without breaking core app behavior

### Requirement: About page and feedback entry
The system SHALL provide an about page that explains the product background, free usage positioning, and available feedback channel.

#### Scenario: Read product background on about page
- **WHEN** the user opens the about page
- **THEN** the system explains that the product is AI-assisted and human-reviewed and identifies the app as free to use

#### Scenario: Access blog and feedback destinations
- **WHEN** the user interacts with the about page links
- **THEN** the system provides a reachable blog destination and at least one reachable feedback destination or fallback contact method
