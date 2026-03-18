# AGENTS.md

Guidance for coding agents working in this repository.

## Repository snapshot

- App type: Expo + React Native mobile app
- Language: TypeScript
- Package manager: npm (`package-lock.json` is present)
- TypeScript mode: strict (`tsconfig.json` sets `strict: true`)
- Primary entry: `App.tsx`
- Current feature focus: metronome playback, BPM controls, settings persistence, custom WAV import

## Source layout

- `App.tsx` — app composition, layout, BPM interactions, settings modal wiring
- `src/components/` — UI components such as BPM display, playback controls, settings panel
- `src/hooks/` — stateful app logic (`useMetronome`, `useSettings`, notifications)
- `src/utils/` — WAV parsing, base64 helpers, custom sound file utilities
- `src/constants/` — colors, presets, sound preset metadata, shared constants
- `assets/` — icons, splash, bundled assets
- `android/` — native Android project used by `build:apk`

## Install

Run from repo root:

```bash
npm install
```

## Available commands

Use only commands that are actually configured in this repo.

```bash
npm run start
npm run prebuild
npm run android
npm run ios
npm run web
npm run build:android
npm run build:apk
npx tsc --noEmit
```

### What each command does

- `npm run start` — starts the Expo dev server (for development)
- `npm run prebuild` — generates native iOS and Android projects using Expo prebuild
- `npm run android` — runs the app on Android device/emulator (requires Android SDK + emulator/device)
- `npm run ios` — runs the app on iOS simulator (requires Xcode + simulator)
- `npm run web` — starts Expo in web mode (for quick testing)
- `npm run build:android` — builds a debug APK (no emulator/device required)
- `npm run build:apk` — builds a release APK (no emulator/device required)
- `npx tsc --noEmit` — typecheck only; this is the current verification baseline

## Lint / test status

This repository does **not** currently have dedicated lint or automated test commands configured.

- Lint command: **not configured**
- Test command: **not configured**
- Single-test command: **not available** because no test runner or test files are configured
- Format command: **not configured**

Do not invent commands like `npm run lint`, `npm test`, `vitest`, or `jest` unless you add and document that tooling in the same change.

## Single-test guidance

There is no single-test workflow yet.

If future work adds a test framework:

1. Add the repo-level test command to `package.json`
2. Add a documented single-test example here
3. Prefer file-scoped or test-name-scoped execution
4. Keep the examples accurate to the installed toolchain

Until then, use targeted manual verification plus `npx tsc --noEmit`.

## Recommended verification workflow

For most changes:

1. Run `npx tsc --noEmit`
2. Run the narrowest relevant app command:
   - UI / interaction work: `npm run start` or `npm run web`
   - Android build only: `npm run build:android`
   - Android device/emulator: `npm run android`
   - iOS simulator: `npm run ios`
   - APK / release packaging work: `npm run build:apk`
3. Manually exercise only the feature area you changed
4. Report exactly what you verified and what you did not verify

## Manual verification guidance

Because automated tests are not configured, agents should include manual checks when changes affect behavior.

### Common flows to verify

- BPM increases / decreases correctly
- Tap tempo updates BPM sensibly after repeated taps
- Play / pause / stop controls behave correctly
- Beat indicator updates while playback is active
- Settings modal opens, updates values, and closes correctly
- Settings persist across app reload when changed
- Sound enable / disable and volume updates behave correctly
- Custom WAV import accepts valid `.wav` files and rejects invalid files
- App handles recoverable failures with user-facing feedback instead of crashing

### For audio or timing changes

Also verify:

- Playback starts without obvious delay regressions
- Current beat stays visually aligned with playback
- Background / foreground transitions do not leave stale timers or broken state
- Haptics still trigger only when enabled

### For storage or file handling changes

Also verify:

- AsyncStorage-backed settings still load on startup
- Imported custom files are persisted and referenced correctly
- Invalid or missing file data is handled gracefully

## Code style conventions observed in this repo

Follow existing local patterns unless the task explicitly changes them.

- Use TypeScript everywhere
- Keep strict typing intact; do not weaken types casually
- Use semicolons
- Use single quotes
- Use 2-space indentation
- Keep trailing commas in multiline literals, objects, arrays, and calls
- Prefer named exports across `src/`; `App` is the main default export exception
- Props and structured data commonly use `interface`
- `React.FC` is used in existing component files; stay consistent within touched files
- Keep `StyleSheet.create(...)` at the bottom of React Native component files
- Use guard clauses for invalid or early-return paths
- Use `useCallback`, `useMemo`, and refs when they support existing performance / lifecycle patterns
- Reuse shared constants from `src/constants` rather than duplicating values
- Keep recoverable runtime failures non-fatal; use `console.warn` and `Alert.alert` where appropriate

## Implementation guidance

- Read nearby files before editing so your changes match established patterns
- Prefer small, targeted changes over broad refactors
- Do not migrate tooling or architecture unless explicitly asked
- Preserve Expo / React Native compatibility
- Avoid introducing new dependencies unless necessary for the task
- Keep user-facing copy consistent with existing language usage in the touched area
- When adding shared logic, prefer `src/hooks/`, `src/utils/`, or `src/constants/` over bloating `App.tsx`

## File-specific notes

### `App.tsx`

- Coordinates screen layout and composes core components
- Wires BPM changes to both in-memory metronome state and persisted settings
- Handles custom WAV import flow and user-visible alerts

### `src/hooks/useMetronome.ts`

- Timing-sensitive logic lives here
- Be careful with intervals, timeouts, refs, and app state transitions
- Clean up timers and players defensively

### `src/hooks/useSettings.ts`

- Settings are persisted through AsyncStorage
- Preserve merge behavior when updating partial settings
- Avoid introducing blocking startup behavior

### `src/utils/customSound.ts` and `src/utils/wav.ts`

- File handling and WAV validation are sensitive to malformed input
- Prefer explicit validation and graceful failure paths

## Commands and environment caveats

### Build Commands (no device/emulator required)

- `npm run build:android` — generates debug APK at `android/app/build/outputs/apk/debug/`
- `npm run build:apk` — generates release APK at `android/app/build/outputs/apk/release/`
- Requires: JAVA_HOME and ANDROID_HOME environment variables set

### Run Commands (device/emulator required)

- `npm run android` — builds and runs on Android device/emulator
  - Requires: Android SDK installed, device connected OR emulator running
- `npm run ios` — builds and runs on iOS simulator
  - Requires: macOS with Xcode installed, iOS simulator available

### Development Commands

- `npm run start` — starts Expo dev server (QR code for mobile, or browser for web)
- `npm run web` — starts Expo in web mode (runs in browser)
- `npm run prebuild` — regenerates native iOS/Android projects (run after adding new native modules)

### Environment Setup

#### macOS

```bash
# Install JDK 17 via Homebrew
brew install openjdk@17

# Set environment variables in ~/.zshrc
export JAVA_HOME="$(brew --prefix)/opt/openjdk@17"
export ANDROID_HOME="$HOME/Library/Android/sdk"
export ANDROID_SDK_ROOT="$ANDROID_HOME"
export PATH="$JAVA_HOME/bin:$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator:$PATH"

# Then reload: source ~/.zshrc
```

#### Windows

```powershell
# Install JDK 17 from https://adoptium.net/temurin/releases/
# Or use winget: winget install EclipseAdoptium.Temurin.17.JDK

# Set environment variables in System Properties → Environment Variables
# JAVA_HOME = C:\Program Files\Eclipse Adoptium\jdk-17.0.x-x
# ANDROID_HOME = C:\Users\<YourName>\AppData\Local\Android\Sdk
# ANDROID_SDK_ROOT = %ANDROID_HOME%

# Add to PATH:
# %JAVA_HOME%\bin
# %ANDROID_HOME%\platform-tools
```

#### Android Studio Setup (Both Platforms)

1. Download Android Studio from https://developer.android.com/studio
2. During installation, ensure "Android SDK" option is checked
3. After installation, open Android Studio → Tools → SDK Manager
4. Install:
   - Android SDK Build-Tools (latest)
   - Android SDK Platform-Tools
   - Android SDK Platform (latest, e.g., API 35)

### Platform-Specific Notes

- **iOS builds**: Only work on macOS with Xcode installed
- **Android builds**: Work on both macOS and Windows
- **Web builds**: Work on all platforms via `npm run web`

### Alternative: Using system Java on macOS

If Android Studio is installed, you can use its bundled JDK:

```bash
export JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home"
```

This is the default used by the npm scripts in `package.json`.

## Cursor / Copilot rules status

No repo-specific Cursor or Copilot instruction files are currently present.

- `.cursor/rules/` — not present
- `.cursorrules` — not present
- `.github/copilot-instructions.md` — not present

Do not claim repo-level Cursor/Copilot rules exist unless they are added later.

## Reporting expectations for future agents

When you finish a task, report concisely:

1. What changed
2. Which files were touched
3. What commands you ran
4. What manual checks you performed
5. Any verification you could not perform
6. Remaining risks, edge cases, or follow-ups

Good example:

- Changed custom WAV import validation in `App.tsx` and `src/utils/customSound.ts`
- Ran `npx tsc --noEmit`
- Manually verified valid WAV import, invalid file rejection, and settings persistence on Expo web
- Did not verify iOS native behavior locally
- Remaining risk: device-specific audio decoding differences may still need on-device validation

## Setting up on a new machine

This project includes native Android and iOS project files, so it can be built on a new machine after cloning.

### Prerequisites

| Component | macOS | Windows | Linux |
|-----------|-------|---------|-------|
| Node.js >= 18 | ✅ | ✅ | ✅ |
| npm >= 9 | ✅ | ✅ | ✅ |
| Android Studio | ✅ | ✅ | ✅ |
| Xcode | ✅ (macOS only) | ❌ | ❌ |
| CocoaPods | ✅ (macOS only) | ❌ | ❌ |

### Steps to build after clone

```bash
# 1. Clone the repository
git clone <repo-url>
cd BeatMeter

# 2. Install dependencies
npm install

# 3. Android: Build APK (both platforms work)
npm run build:apk

# 4. iOS: Install pods and build (macOS only)
cd ios && pod install && cd ..
npm run ios
```

### Common issues on new machines

1. **"Unable to locate Java Runtime"** - Set JAVA_HOME, see Environment Setup section above
2. **"Android SDK not found"** - Set ANDROID_HOME, see Environment Setup section above
3. **iOS build fails** - Only works on macOS with Xcode installed

### Why native files are committed

This repository commits native project files (`android/`, `ios/`) so that:
- New contributors don't need to run `expo prebuild`
- CI/CD pipelines can build without additional setup
- The project works immediately after clone

Files that should NOT be committed (already in .gitignore):
- Build outputs (`android/app/build/`, `ios/build/`)
- Caches (`android/.gradle/`, `ios/DerivedData/`)
- Pods (`ios/Pods/`)
- Signing keys (`android/app/debug.keystore`)

## When adding new tooling

If you introduce linting, formatting, or tests in a future change, update this file in the same PR to include:

- Exact install / setup expectations
- Repo-level commands
- Single-test command examples
- Any new agent-specific workflow changes

Keep this document accurate and repository-specific.
