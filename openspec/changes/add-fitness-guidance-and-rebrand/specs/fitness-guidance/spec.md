## ADDED Requirements

### Requirement: Fitness guidance module entry
The system SHALL provide a dedicated fitness guidance module that is reachable as a first-level destination alongside the metronome module.

#### Scenario: Enter fitness guidance from app shell
- **WHEN** the user opens the app and selects the fitness guidance destination
- **THEN** the system displays the fitness guidance home view without requiring more than one intermediate step

#### Scenario: Return to metronome from fitness guidance
- **WHEN** the user switches from the fitness guidance module back to the metronome module
- **THEN** the system provides a clear navigation path and does not leave the user in a dead end state

### Requirement: Training categories and action details
The system SHALL present at least chest, shoulders, back, and legs as fitness guidance categories, and SHALL provide structured action detail content for each supported action.

#### Scenario: Browse supported training categories
- **WHEN** the user opens the fitness guidance home view
- **THEN** the system shows chest, shoulders, back, and legs as available training categories

#### Scenario: View action detail content
- **WHEN** the user selects an action from a training category
- **THEN** the system shows the action name, target muscle groups, action steps, and safety guidance

### Requirement: Equipment guidance
The system SHALL provide equipment guidance for common fitness equipment and SHALL expose a navigable path from fitness guidance to each supported equipment detail page.

#### Scenario: Browse equipment guidance
- **WHEN** the user opens the equipment guidance section
- **THEN** the system shows at least eight supported equipment items

#### Scenario: View equipment detail guidance
- **WHEN** the user selects an equipment item
- **THEN** the system shows the equipment name, target usage area, basic usage method, and precautions

### Requirement: Training duration tracking
The system SHALL allow the user to start and stop a training timer from the fitness guidance module and SHALL persist the most recent training result locally.

#### Scenario: Complete a tracked training session
- **WHEN** the user starts a training session and later ends it
- **THEN** the system records the elapsed duration and shows the result in the UI

#### Scenario: Restore the most recent training result
- **WHEN** the user relaunches the app after finishing a tracked training session
- **THEN** the system restores the most recent saved training result from local storage

### Requirement: Placeholder action media
The system SHALL provide preloaded placeholder media for key actions and SHALL NOT require live AI image or video generation for the v2.0.0 release.

#### Scenario: Display placeholder media in action detail
- **WHEN** the user opens an action detail page that has media support
- **THEN** the system shows a bundled image or placeholder video block that matches the action content

#### Scenario: No AI dependency for action media
- **WHEN** the user uses the fitness guidance module without network connectivity or AI service access
- **THEN** the system still presents the supported placeholder media experience
