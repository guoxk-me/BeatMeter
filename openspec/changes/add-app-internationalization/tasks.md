## 1. Localization foundation

- [x] 1.1 Add shared localization resources for Chinese and English with a stable translation key structure
- [x] 1.2 Add locale resolution logic for `system`, `zh`, and `en`, including unsupported-locale fallback to English
- [x] 1.3 Extend persisted settings to store language preference with a default value of `system`

## 2. Settings and UI integration

- [x] 2.1 Add a language preference control to the Settings panel with follow-system, Chinese, and English options
- [x] 2.2 Wire the selected language preference into the app-level localization flow so changes update visible text immediately
- [x] 2.3 Ensure language switching does not reset playback state, BPM, sound settings, or haptic settings

## 3. Translation coverage

- [x] 3.1 Replace hardcoded main-screen and settings-panel text with translation keys
- [x] 3.2 Localize alert copy related to custom WAV import flows
- [x] 3.3 Localize preset labels/descriptions and sound preset labels/descriptions
- [x] 3.4 Preserve non-localized values such as BPM numbers, `BPM`, version string, and user file names

## 4. Verification

- [x] 4.1 Verify first launch defaults to follow-system behavior
- [x] 4.2 Verify manual Chinese and English selection persist across restart and override system locale
- [x] 4.3 Verify follow-system mode uses Chinese or English when supported and falls back to English otherwise
- [x] 4.4 Verify UI text updates immediately after language changes without regressions in metronome behavior
