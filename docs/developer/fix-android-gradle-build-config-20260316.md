# Android Gradle build config fixes

## 概述
更新了 Android Gradle 配置中当前值得处理的告警相关项，包括提升 Gradle 内存配置、补充标准 release APK 构建脚本，以及将项目可控的 Groovy 属性赋值改为现代 `=` 语法。

## 产出
- 提升 Gradle daemon 堆内存与 metaspace 配置
- 增加 `build:apk` 生产 APK 构建脚本
- 安全地现代化 Android Gradle 项目内受控属性赋值语法

## 变更文件
- `android/gradle.properties` - 提升 `org.gradle.jvmargs` 内存与 metaspace
- `android/build.gradle` - 将 JitPack 仓库地址改为 `url = uri(...)`
- `android/app/build.gradle` - 按要求更新安全范围内的 Groovy 属性赋值语法
- `package.json` - 新增 `build:apk` 脚本

## 验证
- [x] 已回读 `android/gradle.properties` - 配置已更新为 `-Xmx4096m -XX:MaxMetaspaceSize=1024m`
- [x] 已回读 `android/build.gradle` / `android/app/build.gradle` / `package.json` - 目标语法与脚本已写入

## 后续
- 如需进一步确认，可在本地执行 `npm run build:apk` 进行 release APK 构建验证
- 如果后续重新 prebuild Expo，建议留意生成文件是否覆盖这些受控修改
