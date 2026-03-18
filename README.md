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

- Node.js >= 18
- npm >= 9
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

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
# Android Release APK
npm run build:apk
```

The built APK is located in `android/app/build/outputs/apk/release/`.

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

| Command | Description |
|---------|-------------|
| `npm run start` | Start Expo development server |
| `npm run android` | Run Android app |
| `npm run ios` | Run iOS app (macOS only) |
| `npm run web` | Run in browser (dev preview only) |
| `npm run build:apk` | Build Android Release APK |
| `npx tsc --noEmit` | TypeScript type checking |

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
