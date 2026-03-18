## Context

当前 BeatMeter 项目使用 Expo SDK 55 和 React Native 0.83。package.json 中的脚本配置存在问题：
- `ios` 和 `android` 命令直接使用 `expo run:ios/android`，但没有先运行 `expo prebuild` 生成原生项目
- `build:apk` 使用硬编码的绝对路径（Java Home、Android SDK 路径），在不同开发环境不可移植

## Goals / Non-Goals

**Goals:**
- 修复 `npm run ios` 和 `npm run android` 命令，使其能够正常工作
- 修复 `npm run build:apk` 命令，使用更灵活的配置
- 添加实用的辅助命令（prebuild, build:android）
- 确保脚本在不同开发环境下具有一定的可移植性

**Non-Goals:**
- 不修改业务逻辑代码
- 不升级 Expo 或 React Native 版本
- 不添加额外的 npm 依赖

## Decisions

1. **使用 `expo prebuild` 作为前置步骤**
   - 理由：Expo SDK 50+ 要求显式运行 prebuild 生成原生项目
   - 替代方案：使用 `npx expo run:android --no-build-cache` 自动处理，但显式 prebuild 更可控

2. **移除硬编码的 JAVA_HOME 和 ANDROID_HOME 路径**
   - 理由：每个开发者的环境路径不同
   - 解决方案：让系统环境变量生效，或使用常见默认值

3. **分离 debug 和 release 构建**
   - `build:android`：生成 debug APK（更快，适合开发测试）
   - `build:apk`：生成 release APK（需要签名配置）

## Risks / Trade-offs

- [Risk] macOS 和 Windows 路径差异
  -  Mitigation：主要针对 macOS 开发，使用常见的 ~/Library/Android/sdk 路径

- [Risk] Android Studio 版本差异导致 Java 路径变化
  - Mitigation：优先使用环境变量中的 JAVA_HOME，让用户自行配置

- [Risk] iOS 构建需要 Xcode，可能在无 Xcode 环境下失败
  - Mitigation：这是系统依赖，无法避免，但错误信息清晰

## Migration Plan

1. 直接修改 package.json 的 scripts 字段
2. 开发者运行 `npm install` 更新依赖
3. 首次使用 `npm run prebuild` 生成原生项目
4. 之后可以使用 `npm run ios` 或 `npm run android`
