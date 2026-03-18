## 1. 修改 package.json scripts

- [x] 1.1 修改 `start` 命令：保持 `expo start` 不变
- [x] 1.2 修改 `prebuild` 命令：添加 `expo prebuild` 生成原生项目
- [x] 1.3 修改 `ios` 命令：改为 `expo run:ios` (Expo 会自动处理 prebuild)
- [x] 1.4 修改 `android` 命令：改为 `expo run:android` (Expo 会自动处理 prebuild)
- [x] 1.5 修改 `web` 命令：保持 `expo start --web` 不变
- [x] 1.6 添加 `build:android` 命令：生成 debug APK
- [x] 1.7 修改 `build:apk` 命令：移除硬编码路径，使用环境变量

## 2. 验证脚本

- [x] 2.1 运行 `npm run start` 验证开发服务器
- [x] 2.2 运行 `npm run web` 验证 web 模式
- [x] 2.3 运行 `npm run prebuild` 验证原生项目生成
- [x] 2.4 运行 `npm run build:android` 验证 debug APK 构建
- [x] 2.5 运行 `npm run build:apk` 验证 release APK 构建

## 3. 更新文档

- [x] 3.1 更新 AGENTS.md 中的命令说明（如果需要）
