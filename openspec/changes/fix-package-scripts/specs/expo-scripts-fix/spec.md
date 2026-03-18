## ADDED Requirements

### Requirement: Expo prebuild command works correctly
The system SHALL provide a working `npm run prebuild` command that generates native iOS and Android projects using Expo prebuild.

#### Scenario: Prebuild generates iOS project
- **WHEN** developer runs `npm run prebuild`
- **THEN** Expo generates ios/ directory with native iOS project files

#### Scenario: Prebuild generates Android project
- **WHEN** developer runs `npm run prebuild`
- **THEN** Expo generates android/ directory with native Android project files

### Requirement: iOS run command works correctly
The system SHALL provide a working `npm run ios` command that builds and runs the app on iOS simulator.

#### Scenario: iOS command builds and runs
- **WHEN** developer runs `npm run ios` with valid iOS environment
- **THEN** Expo prebuilds native project, then builds and launches app on iOS simulator

### Requirement: Android run command works correctly
The system SHALL provide a working `npm run android` command that builds and runs the app on Android emulator.

#### Scenario: Android command builds and runs
- **WHEN** developer runs `npm run android` with valid Android environment
- **THEN** Expo prebuilds native project, then builds and launches app on Android emulator

### Requirement: Debug APK build command works correctly
The system SHALL provide a working `npm run build:android` command that generates a debug APK.

#### Scenario: Debug APK is generated
- **WHEN** developer runs `npm run build:android`
- **THEN** system generates a debug APK at android/app/build/outputs/apk/debug/

### Requirement: Release APK build command works correctly
The system SHALL provide a working `npm run build:apk` command that generates a release APK.

#### Scenario: Release APK is generated
- **WHEN** developer runs `npm run build:apk`
- **THEN** system generates a release APK at android/app/build/outputs/apk/release/

### Requirement: Start web command works correctly
The system SHALL provide a working `npm run web` command that starts the app in web mode.

#### Scenario: Web server starts
- **WHEN** developer runs `npm run web`
- **THEN** Expo starts the web development server
