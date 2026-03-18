## Why

BeatMeter 当前界面文案主要以中文硬编码在组件和常量中，无法根据用户偏好或系统语言切换展示语言。这限制了英文用户的使用体验，也让后续新增界面文案缺少统一的国际化扩展基础。

## What Changes

- 为应用引入中英文国际化能力，覆盖主界面、设置面板、弹窗提示、预设文案、音效文案等主要用户可见文本。
- 新增语言偏好设置，支持用户手动选择简体中文、英文，或设置为跟随系统。
- 定义语言解析优先级：用户手动选择优先于系统语言；首次安装默认跟随系统。
- 为不支持的系统语言和缺失翻译建立统一兜底策略，确保界面稳定可用。

## Capabilities

### New Capabilities
- `app-localization`: Defines app-wide localization behavior for Chinese and English, including language preference persistence, system-follow mode, fallback behavior, and translation coverage for primary user-facing text.

### Modified Capabilities

None.

## Impact

- Affected code: `App.tsx`, `src/components/SettingsPanel.tsx`, `src/components/BPMDisplay.tsx`, `src/components/PresetButtons.tsx`, `src/constants/presets.ts`, `src/constants/sounds.ts`, `src/hooks/useSettings.ts`.
- New code areas likely needed: localization resources and a shared i18n access layer under `src/`.
- User impact: users can view the app in Chinese or English, manually lock a preferred language, or follow the system language without losing their preference across app restarts.
