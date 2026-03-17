# 全应用国际化 (i18n) — 简体中文 + 英语

## 概述
为 BeatMeter 添加中英双语支持，语言偏好持久化到 AsyncStorage，切换语言无需重启应用。

## 产出
- 新建 `src/i18n/` 模块，包含类型安全的翻译接口与 `useI18n` hook
- 所有硬编码中文 UI 文本替换为 `t.*` 键
- Settings 面板底部新增语言选择卡片（Follow System / Chinese / English）
- 安装 `expo-localization` 用于系统语言检测

## 变更文件

| 文件 | 说明 |
|------|------|
| `src/i18n/locales/en.ts` | **新建** — `Translations` 接口 + 英文翻译对象 |
| `src/i18n/locales/zh.ts` | **新建** — 简体中文翻译对象 |
| `src/i18n/index.ts` | **新建** — `useI18n` hook、`getSoundPresetI18n` helper、`LanguagePreference` 类型 |
| `src/hooks/useSettings.ts` | 新增 `languagePreference: LanguagePreference` 字段（默认 `'system'`）及 `setLanguagePreference` 方法 |
| `src/components/BPMDisplay.tsx` | 新增可选 prop `tapBpmLabel?: string`，替换硬编码 `'TAP BPM'` |
| `src/components/PresetButtons.tsx` | 新增 `languagePreference` prop，内部调用 `useI18n`，本地化 label/description |
| `src/components/SettingsPanel.tsx` | 新增 `t`、`languagePreference`、`onLanguageChange` props；替换全部硬编码文本；新增语言选择卡片 |
| `App.tsx` | 引入 `useI18n`、`getSoundPresetI18n`；将 `t` 传入所有子组件和 Alert 调用 |
| `package.json` / `package-lock.json` | 安装 `expo-localization` |

## 设计决策

- `Translations` 定义为显式 `interface`（而非 `typeof en as const`），使 `zh` 对象可以赋值为该类型，避免字符串字面量类型冲突。
- `useI18n` 是纯函数风格 hook（无内部 state），由 `settings.languagePreference` 驱动，每次 render 时 `t` 自动反映最新语言。
- `getSoundPresetLabel`（`src/constants/sounds.ts`）保持不变，仍可在其他地方使用。
- `handleImportCustomSound` 的 `useCallback` deps 数组加入了 `t`，确保语言切换后 Alert 文案正确。

## 验证
- [x] `npx tsc --noEmit` — 0 errors
- [ ] 手动验证：语言切换（Settings → Language 卡片）后所有 UI 文本即时更新
- [ ] 手动验证：系统语言跟随模式（中文系统 → 中文，英文系统 → 英文）
- [ ] 手动验证：Alert 文案随语言切换正确
- [ ] 手动验证：声音预设 / 跑步预设 label 随语言切换正确
- [ ] 未在 iOS/Android 真机上验证 `expo-localization` 的 `getLocales()` 行为

## 后续
- 可考虑将 `getLocales()` 的调用缓存到 `useRef`（目前每次 render 调用一次，代价极低但非零）
- 若后续支持更多语言，只需在 `src/i18n/locales/` 新增文件并扩展 `LanguagePreference` 类型
- `expo-localization` 已添加为 config plugin，若使用 bare workflow 需 `npx expo prebuild` 重新生成原生代码
