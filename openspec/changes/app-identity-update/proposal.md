## Why

当前 BeatMeter app 的名称、图标和启动画面是初始开发时设置的，缺乏统一的品牌设计和国际化考虑。现在需要对 app 进行品牌升级：添加中文名称、优化图标设计、统一启动画面，提供更专业的品牌形象。

## What Changes

- **App 名称国际化**：中文名"节拍器"，英文名"BeatMeter"
- **App 图标重新设计**：通过 AI 生成一套完整的图标（iOS、Android、Web）
- **启动画面重新设计**：简洁专业的启动画面，包含 Logo 和中英文名称
- **配置更新**：更新 app.json 中的名称配置

## Capabilities

### New Capabilities

- **app-identity**: 应用品牌标识系统，包含名称、图标、启动画面的完整设计规范和资源文件

### Modified Capabilities

- （无）现有功能需求不变，仅涉及资源文件和配置更新

## Impact

- 资源文件：`assets/` 目录下的图标文件
- 配置文件：`app.json` 中的 name、slug、icon、splash 配置
- 无需修改代码逻辑
