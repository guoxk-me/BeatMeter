## ADDED Requirements

### Requirement: Metronome audio SHALL mix with external audio apps
The system SHALL configure the metronome playback audio session to mix with other device audio so users can hear the metronome while another audio app is playing.

#### Scenario: Starting metronome while music app is already playing
- **WHEN** the user starts the metronome while another app is already outputting audio
- **THEN** the metronome SHALL become audible without requiring the other app to pause

### Requirement: Metronome playback SHALL remain recoverable across external audio changes
The system SHALL keep the metronome in a recoverable playback state when another app starts, resumes, pauses, or changes tracks, so transient audio-session changes do not leave the metronome silently unusable.

#### Scenario: External app changes tracks during metronome playback
- **WHEN** the metronome is playing and another audio app changes to a new track
- **THEN** the metronome SHALL remain audible or resume audibly without requiring the user to restart the app

#### Scenario: External audio interruption affects playback startup
- **WHEN** the app encounters a recoverable audio-session interruption while starting or rebuilding metronome playback
- **THEN** the app SHALL keep metronome controls responsive and allow playback to be retried cleanly

### Requirement: Existing metronome audio guarantees SHALL be preserved
The system SHALL preserve the metronome's existing silent-mode playback support, background playback support, and non-fatal error handling while enabling external audio mixing.

#### Scenario: Mixed audio with silent-mode playback enabled
- **WHEN** the device is in silent mode and the user starts the metronome alongside another audio app
- **THEN** the metronome SHALL still follow the app's configured silent-mode playback behavior

#### Scenario: Mixed audio while app state changes
- **WHEN** the metronome is playing with another audio app and the BeatMeter app moves between foreground and background states
- **THEN** the metronome SHALL preserve its existing background playback behavior and recover UI-only timers when the app becomes active again
