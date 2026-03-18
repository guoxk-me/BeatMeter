# BeatMeter

> A pure AI-generated metronome app built with Expo and React Native. Designed for running and fitness enthusiasts who need precise tempo control during workouts.

<p align="center">
  <img src="./assets/icon.png" alt="BeatMeter Logo" width="120" />
</p>

<p align="center">
  <strong>Running & Fitness Tempo Metronome</strong>
</p>

<p align="center">
  <a href="https://github.com/beatmeter/beatmeter">
    <img src="https://img.shields.io/badge/platform-iOS%20%7C%20Android-007AFF?style=flat-square" alt="Platform" />
  </a>
  <a href="https://github.com/beatmeter/beatmeter/releases">
    <img src="https://img.shields.io/badge/version-1.0.0-007AFF?style=flat-square" alt="Version" />
  </a>
  <a href="./LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-007AFF?style=flat-square" alt="License" />
  </a>
  <a href="https://expo.dev">
    <img src="https://img.shields.io/badge/built%20with-Expo-4630EB?style=flat-square" alt="Built with Expo" />
  </a>
</p>

<p align="center">
  📄 Other languages: <a href="./README_zh.md">中文</a>
</p>

---

## 📱 Overview

BeatMeter is a tempo control metronome app designed specifically for running and fitness. With preset tempo rhythms, it helps users maintain a steady pace during exercise, improving workout efficiency.

### Key Features

| Feature | Description |
|---------|-------------|
| 🎵 **Precise Beat** | BPM range 40-220 with accurate tempo control |
| 🏃 **Running Presets** | Walk (110), Jog (160), Tempo (170), Sprint (180) BPM |
| 👆 **Tap Tempo** | Tap rhythm to automatically calculate target BPM |
| 📳 **Haptic Feedback** | Vibration feedback on each beat - no need to watch the screen |
| 🎶 **Custom Sounds** | Import custom WAV sound files |
| 💾 **Settings Memory** | Auto-saves last used BPM and settings |
| 🌙 **Background Play** | Continue playing in background, sync with music |

---

## 🛠 Tech Stack

| Technology | Purpose |
|------------|---------|
| [Expo](https://expo.dev) | Cross-platform mobile development framework |
| [React Native](https://reactnative.dev) | Native mobile UI framework |
| [TypeScript](https://www.typescriptlang.org) | Type-safe JavaScript |
| [expo-av](https://docs.expo.dev/versions/latest/sdk/audio/) | Audio playback |
| [expo-haptics](https://docs.expo.dev/versions/latest/sdk/haptics/) | Haptic feedback |
| [expo-notifications](https://docs.expo.dev/versions/latest/sdk/notifications/) | Local notifications |
| [@react-native-async-storage/async-storage](https://react-native-async-storage.github.io.AsyncStorage/) | Settings persistence |
| [react-native-reanimated](https://docs.swmansion.com/react-native-reanimated/) | Smooth animations |

---

## 🚀 Getting Started

### Requirements

| Component | macOS | Windows | Notes |
|-----------|-------|---------|-------|
| Node.js >= 18 | ✅ | ✅ | Use nvm or official installer |
| npm >= 9 | ✅ | ✅ | Comes with Node.js |
| Android Studio | ✅ | ✅ | For Android builds |
| Xcode | ✅ (macOS only) | ❌ | For iOS builds |
| Java JDK 17+ | ✅ | ✅ | See setup below |

### Environment Setup

#### macOS

```bash
# Install Homebrew if needed
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install JDK 17
brew install openjdk@17

# Set JAVA_HOME (add to ~/.zshrc for permanent setup)
export JAVA_HOME="$(brew --prefix)/opt/openjdk@17"
export ANDROID_HOME="$HOME/Library/Android/sdk"
export ANDROID_SDK_ROOT="$ANDROID_HOME"
export PATH="$JAVA_HOME/bin:$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator:$PATH"

# Install Android Studio from https://developer.android.com/studio
# During installation, check "Android SDK" option

# After installation, open Android Studio → Tools → SDK Manager
# Install "Android SDK Build-Tools" and "Android SDK Platform-Tools"
```

#### Windows

```powershell
# Install JDK 17 from https://adoptium.net/temurin/releases/
# Or use winget: winget install EclipseAdoptium.Temurin.17.JDK

# Set environment variables (System Properties → Environment Variables)
# JAVA_HOME = C:\Program Files\Eclipse Adoptium\jdk-17.0.x-x
# ANDROID_HOME = C:\Users\<YourName>\AppData\Local\Android\Sdk
# ANDROID_SDK_ROOT = %ANDROID_HOME%

# Add to PATH:
# %JAVA_HOME%\bin
# %ANDROID_HOME%\platform-tools
# %ANDROID_HOME%\cmdline-tools\latest\bin

# Install Android Studio from https://developer.android.com/studio
# During installation, check "Android SDK" option

# After installation, open Android Studio → Tools → SDK Manager
# Install "Android SDK Build-Tools" and "Android SDK Platform-Tools"
```

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-repo/beatmeter.git
cd beatmeter

# 2. Install dependencies
npm install

# 3. Start development server
npm run start

# 4. Run the app
# Android
npm run android

# iOS (macOS only)
npm run ios
```

### Build APK

```bash
# Android Debug APK
npm run build:android

# Android Release APK
npm run build:apk
```

The built APK is located in:
- Debug: `android/app/build/outputs/apk/debug/`
- Release: `android/app/build/outputs/apk/release/`

### Build iOS App

```bash
# Install CocoaPods dependencies (macOS only)
cd ios && pod install && cd ..

# Run on iOS Simulator (macOS only)
npm run ios
```

> **Note**: iOS builds are only supported on macOS with Xcode installed.

---

## 📖 Features

### BPM Control

- **Slider**: Drag slider to quickly adjust BPM
- **Buttons**: Click +/- buttons for precise adjustment
- **Long Press**: Hold buttons for rapid BPM changes
- **Tap Tempo**: Tap screen 3+ times to auto-calculate BPM

### Running Presets

| Preset | BPM | Use Case |
|--------|-----|----------|
| Walk | 110 | Light walking, warm-up |
| Jog | 160 | Aerobic jogging, long distance |
| Tempo | 170 | Pace training, tempo run |
| Sprint | 180 | High intensity, intervals |

### Settings

- **Haptics**: Enable/disable vibration on each beat
- **Sound**: Enable/disable beat sound effects
- **Volume**: Adjust beat volume level
- **Custom Sound**: Import custom WAV files

---

## 📁 Project Structure

```
BeatMeter/
├── App.tsx                    # App entry point
├── src/
│   ├── components/            # UI components
│   │   ├── BPMDisplay.tsx    # BPM display component
│   │   ├── BeatIndicator.tsx # Beat indicator
│   │   ├── BPMSlider.tsx    # BPM slider
│   │   ├── PresetButtons.tsx # Preset buttons
│   │   ├── PlaybackControls.tsx # Playback controls
│   │   └── SettingsPanel.tsx # Settings panel
│   ├── hooks/                 # Business logic
│   │   ├── useMetronome.ts   # Metronome core logic
│   │   ├── useSettings.ts    # Settings management
│   │   └── useNotifications.ts # Notifications
│   ├── utils/                 # Utilities
│   │   ├── wav.ts            # WAV audio processing
│   │   ├── customSound.ts   # Custom sound management
│   │   └── base64.ts        # Base64 encoding
│   └── constants/            # Constants
│       ├── colors.ts         # Color theme
│       ├── presets.ts        # Tempo presets
│       └── sounds.ts         # Sound configuration
├── assets/                   # Static assets
│   └── sounds/               # Sound files
└── android/                  # Android native project
```

---

## 📋 Available Commands

| Command | Platform | Description |
|---------|----------|-------------|
| `npm run start` | All | Start Expo development server |
| `npm run android` | All | Run Android app (device/emulator) |
| `npm run ios` | macOS only | Run iOS app (simulator) |
| `npm run web` | All | Run in browser (dev preview) |
| `npm run build:android` | All | Build Android Debug APK |
| `npm run build:apk` | All | Build Android Release APK |
| `npx tsc --noEmit` | All | TypeScript type checking |

## 🔧 Troubleshooting

### Java Not Found

If you see "Unable to locate a Java Runtime", set the JAVA_HOME environment variable:

**macOS:**
```bash
export JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home"
```

**Windows:**
```powershell
set JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-17.0.x-x
```

### Android SDK Not Found

If Android SDK is not found, set ANDROID_HOME:

**macOS:**
```bash
export ANDROID_HOME="$HOME/Library/Android/sdk"
```

**Windows:**
```powershell
set ANDROID_HOME=C:\Users\<YourName>\AppData\Local\Android\Sdk
```

### Build Fails on Windows

If build fails on Windows with permission errors, try:
```powershell
# Run PowerShell as Administrator
# Or use: npx react-native bundle --platform android ...
```

### iOS Build Only Works on macOS

iOS builds require:
- macOS operating system
- Xcode installed
- Xcode Command Line Tools

---

## 🔧 Development Guide

### Code Style

- Use TypeScript strict mode
- 2-space indentation
- Single quotes
- Semicolons at statement end
- Trailing commas in multiline objects/arrays

### Verification Process

1. Run `npx tsc --noEmit` for type checking
2. Run appropriate command based on changes:
   - UI/Interaction: `npm run start` or `npm run web`
   - Android: `npm run android`
   - iOS: `npm run ios`

---

## 📄 License

This project is open source under the [MIT](./LICENSE) license.

---

## 🙏 Acknowledgments

- [Expo](https://expo.dev) - Excellent cross-platform development framework
- [React Native](https://reactnative.dev) - Powerful native app framework
- All open source library contributors
