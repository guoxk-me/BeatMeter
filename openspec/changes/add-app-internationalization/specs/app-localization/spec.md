## ADDED Requirements

### Requirement: App MUST support Chinese and English localization
The system MUST provide localized user-facing text in Simplified Chinese and English for the primary metronome experience. This coverage MUST include the main screen text, settings panel text, alert text, preset labels and descriptions, and sound preset labels and descriptions. BPM numeric values and the version string are excluded from localization.

#### Scenario: App renders Chinese text
- **WHEN** the effective app language is `zh`
- **THEN** the primary user-facing text MUST render in Simplified Chinese

#### Scenario: App renders English text
- **WHEN** the effective app language is `en`
- **THEN** the primary user-facing text MUST render in English

### Requirement: Users MUST be able to choose language from settings
The system MUST provide a language setting inside the Settings panel with exactly three options: follow system, Simplified Chinese, and English.

#### Scenario: User opens language setting
- **WHEN** the user opens the Settings panel
- **THEN** the panel MUST expose a language preference control with the supported options

### Requirement: Manual language preference MUST override system language
The system MUST treat an explicit user-selected language as higher priority than the current system locale.

#### Scenario: User locks app to Chinese
- **WHEN** the user selects `zh` and the system language is English
- **THEN** the app MUST continue to display Chinese text

#### Scenario: User locks app to English
- **WHEN** the user selects `en` and the system language is Chinese
- **THEN** the app MUST continue to display English text

### Requirement: Follow-system mode MUST use supported system locales and fall back safely
The system MUST support a `system` language preference that resolves the effective app language from the current device locale. If the system locale is unsupported, the app MUST fall back to English.

#### Scenario: Supported system locale is used
- **WHEN** the user preference is `system` and the device locale resolves to Chinese
- **THEN** the app MUST display Chinese text

#### Scenario: Unsupported system locale falls back to English
- **WHEN** the user preference is `system` and the device locale is neither Chinese nor English
- **THEN** the app MUST display English text

### Requirement: Language preference MUST persist across restarts
The system MUST persist the user's language preference and restore it on the next app launch. First install MUST default to `system`.

#### Scenario: Preference persists after restart
- **WHEN** the user selects a language preference and restarts the app
- **THEN** the app MUST restore the same stored preference

#### Scenario: First launch defaults to system
- **WHEN** the app is launched without any previously stored settings
- **THEN** the language preference MUST default to `system`

### Requirement: Language changes MUST update the UI immediately
The system MUST apply a changed language preference without requiring the user to restart the app, and the change MUST NOT reset metronome playback state or other existing settings.

#### Scenario: User changes language while app is open
- **WHEN** the user selects a different language preference in Settings
- **THEN** the visible interface text MUST update immediately

#### Scenario: Language change does not reset metronome state
- **WHEN** the user changes the language preference while the app is open
- **THEN** the current BPM, playback state, sound settings, and haptic settings MUST remain unchanged
