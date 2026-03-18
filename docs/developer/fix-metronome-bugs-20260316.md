# Fix: Metronome 4 Bugs

## 概述
修复了节拍器的4个运行时 Bug：旧音效残留双重播放、音量过低、震动开关失效后无法恢复。

## 产出
- Bug 1 & 2：切换音效/BPM 时旧 player 不再残留播放
- Bug 3：默认音量从 0.8 提升至 1.0（hookparam + 持久化默认值同步）
- Bug 4：haptic 重新开启时自动重启调度链

## 变更文件

### `src/hooks/useMetronome.ts`
- **第26行**：`volume` 参数默认值 `0.8` → `1.0`
- **第82行**：`removeCurrentPlayer` 在 `existing.remove()` 前先调用 `existing.pause()`，防止旧 player 继续输出音频
- **第132-138行**：新增 `useEffect`，监听 `hapticEnabled`，当其变为 `true` 且当前正在播放时调用 `scheduleNextHaptic()` 重启调度链

### `src/hooks/useSettings.ts`
- **第22行**：`DEFAULT_SETTINGS.volume` `0.8` → `1.0`，与 hook 参数默认值保持一致

## 验证
- [x] `npx tsc --noEmit` — 零错误，零警告

## 后续
- 需要在真机上手动验证：切换音效/BPM 时无双重播放、关闭再开启 haptic 后震动恢复正常
- 如果用户已有持久化设置（volume=0.8），需本人手动调整音量，或在迁移时重置 volume 字段
