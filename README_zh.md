# BeatMeter 节拍器

> 纯 AI 生成的节拍器应用，使用 Expo 和 React Native 构建。专为跑步和健身爱好者设计，帮助在锻炼时保持精确的步频控制。

<p align="center">
  <img src="./assets/icon.png" alt="BeatMeter Logo" width="120" />
</p>

<p align="center">
  <strong>跑步 & 健身步频控制节拍器</strong>
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
  📄 其他语言: <a href="./README.md">English</a>
</p>

---

## 📱 应用简介

BeatMeter 是一款专为跑步和健身设计的步频控制节拍器应用。通过预设的步频节奏，帮助用户在运动时保持稳定的步伐节奏，提升运动效果。

### 核心功能

| 功能 | 描述 |
|------|------|
| 🎵 **精确节拍** | BPM 范围 40-220，支持精确的节拍控制 |
| 🏃 **跑步预设** | 步行(110)、轻松跑(160)、节奏跑(170)、冲刺(180) BPM |
| 👆 **敲击测速** | Tap Tempo 功能，通过敲击自动计算目标 BPM |
| 📳 **触觉反馈** | 每拍振动提示，无需观看屏幕即可感知节奏 |
| 🎶 **自定义音效** | 支持导入自定义 WAV 音效文件 |
| 💾 **设置记忆** | 自动保存上次使用的 BPM 和各项设置 |
| 🌙 **后台运行** | 支持后台播放，配合音乐同步使用 |

---

## 🛠 技术栈

| 技术 | 用途 |
|------|------|
| [Expo](https://expo.dev) | 跨平台移动应用开发框架 |
| [React Native](https://reactnative.dev) | 原生移动 UI 框架 |
| [TypeScript](https://www.typescriptlang.org) | 类型安全的 JavaScript |
| [expo-av](https://docs.expo.dev/versions/latest/sdk/audio/) | 音频播放 |
| [expo-haptics](https://docs.expo.dev/versions/latest/sdk/haptics/) | 触觉反馈 |
| [expo-notifications](https://docs.expo.dev/versions/latest/sdk/notifications/) | 本地通知 |
| [@react-native-async-storage/async-storage](https://react-native-async-storage.github.io.AsyncStorage/) | 设置持久化 |
| [react-native-reanimated](https://docs.swmansion.com/react-native-reanimated/) | 流畅动画 |

---

## 🚀 快速开始

### 环境要求

- Node.js >= 18
- npm >= 9
- Android Studio (Android 开发)
- Xcode (iOS 开发，仅 macOS)

### 安装步骤

```bash
# 1. 克隆项目
git clone https://github.com/your-repo/beatmeter.git
cd beatmeter

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npm run start

# 4. 运行应用
# Android
npm run android

# iOS (仅 macOS)
npm run ios
```

### 构建 APK

```bash
# Android Release APK
npm run build:apk
```

构建完成的 APK 位于 `android/app/build/outputs/apk/release/` 目录。

---

## 📖 功能详解

### BPM 控制

- **滑动调节**：拖动滑块快速调整 BPM
- **按钮微调**：点击 + / - 按钮精确调整
- **长按加速**：长按按钮可快速增减 BPM
- **敲击测速**：连续敲击屏幕 3 次以上自动计算 BPM

### 跑步预设

| 预设 | BPM | 适用场景 |
|------|-----|----------|
| 步行 | 110 | 轻松步行、热身 |
| 轻松跑 | 160 | 有氧慢跑、长距离 |
| 节奏跑 | 170 | 配速训练、节奏跑 |
| 冲刺 | 180 | 高强度冲刺、间歇训练 |

### 设置选项

- **触觉反馈**：开启/关闭每拍振动
- **声音**：开启/关闭节拍音效
- **音量**：调节节拍音量大小
- **自定义音效**：导入自定义 WAV 文件

---

## 📁 项目结构

```
BeatMeter/
├── App.tsx                    # 应用入口
├── src/
│   ├── components/            # UI 组件
│   │   ├── BPMDisplay.tsx    # BPM 显示组件
│   │   ├── BeatIndicator.tsx # 节拍指示器
│   │   ├── BPMSlider.tsx    # BPM 滑块
│   │   ├── PresetButtons.tsx # 预设按钮组
│   │   ├── PlaybackControls.tsx # 播放控制
│   │   └── SettingsPanel.tsx # 设置面板
│   ├── hooks/                 # 业务逻辑
│   │   ├── useMetronome.ts   # 节拍器核心逻辑
│   │   ├── useSettings.ts    # 设置管理
│   │   └── useNotifications.ts # 通知管理
│   ├── utils/                 # 工具函数
│   │   ├── wav.ts            # WAV 音频处理
│   │   ├── customSound.ts   # 自定义音效管理
│   │   └── base64.ts        # Base64 编码
│   └── constants/            # 常量定义
│       ├── colors.ts         # 颜色主题
│       ├── presets.ts        # 步频预设
│       └── sounds.ts         # 音效配置
├── assets/                   # 静态资源
│   └── sounds/               # 音效文件
└── android/                  # Android 原生项目
```

---

## 📋 可用命令

| 命令 | 说明 |
|------|------|
| `npm run start` | 启动 Expo 开发服务器 |
| `npm run android` | 运行 Android 应用 |
| `npm run ios` | 运行 iOS 应用 (仅 macOS) |
| `npm run web` | 在浏览器中运行 (仅开发预览) |
| `npm run build:apk` | 构建 Android Release APK |
| `npx tsc --noEmit` | TypeScript 类型检查 |

---

## 🔧 开发指南

### 代码规范

- 使用 TypeScript 严格模式
- 使用 2 空格缩进
- 使用单引号
- 语句末尾使用分号
- 多行对象/数组保留尾随逗号

### 验证流程

1. 运行 `npx tsc --noEmit` 进行类型检查
2. 根据修改范围选择运行：
   - UI/交互：`npm run start` 或 `npm run web`
   - Android：`npm run android`
   - iOS：`npm run ios`

---

## 📄 许可证

本项目基于 [MIT](./LICENSE) 许可证开源。

---

## 🙏 致谢

- [Expo](https://expo.dev) - 优秀的跨平台开发框架
- [React Native](https://reactnative.dev) - 强大的原生应用框架
- 所有开源库的贡献者
