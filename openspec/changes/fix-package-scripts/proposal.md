## Why

当前 package.json 中的 npm scripts 存在多个问题：`ios` 和 `android` 命令需要先运行 `expo prebuild` 生成原生项目，但当前配置缺少这一步；`build:apk` 命令使用硬编码的绝对路径，在不同开发环境下无法正常工作。这些问题导致开发者无法正常使用标准的 npm run 命令来运行和构建应用。

## What Changes

- 修复 `ios` 命令：添加 `expo prebuild` 步骤生成 iOS 原生项目，然后运行
- 修复 `android` 命令：添加 `expo prebuild` 步骤生成 Android 原生项目，然后运行
- 优化 `build:apk` 命令：移除硬编码路径，改用环境变量或默认值
- 添加 `prebuild` 命令：方便开发者单独运行预构建步骤
- 添加 `build:android` 命令：生成 debug APK 用于测试
- 标准化脚本命名和顺序

## Capabilities

### New Capabilities
- `expo-scripts-fix`: 修复和标准化 Expo 项目脚本配置

### Modified Capabilities
- 无

## Impact

- 修改 `package.json` 的 scripts 字段
- 不影响现有业务逻辑代码
- 不添加新的依赖包
