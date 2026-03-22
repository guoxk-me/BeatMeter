## ADDED Requirements

### Requirement: Fast metronome access
The system SHALL keep the metronome reachable as a primary destination after the app expands to dual modules.

#### Scenario: Reach metronome from app shell
- **WHEN** the user opens the app shell
- **THEN** the system allows the user to enter the metronome flow directly from a primary destination

#### Scenario: Return to metronome after browsing fitness content
- **WHEN** the user switches back from fitness guidance to metronome
- **THEN** the system returns the user to the metronome interface without unnecessary intermediate screens

### Requirement: Stable metronome control behavior
The system SHALL preserve play, pause, stop, BPM adjustment, and settings behavior while the new module structure is present.

#### Scenario: Use playback controls after module expansion
- **WHEN** the user plays, pauses, or stops the metronome in the updated app
- **THEN** the system performs the requested control action correctly

#### Scenario: Update BPM and settings after module expansion
- **WHEN** the user adjusts BPM or updates metronome settings in the updated app
- **THEN** the system saves and restores the values with behavior equivalent to the prior metronome experience

### Requirement: Visual beat feedback continuity
The system SHALL continue to present clear beat feedback after the app shell and branding changes are introduced.

#### Scenario: Show active beat feedback during playback
- **WHEN** the metronome is playing
- **THEN** the system highlights the current beat clearly enough for the user to distinguish the active state

#### Scenario: Preserve beat feedback after module switching
- **WHEN** the user navigates away from and back to the metronome
- **THEN** the system restores the beat feedback state without crashing or showing an obviously stale screen
