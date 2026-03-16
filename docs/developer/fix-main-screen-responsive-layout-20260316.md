# 主界面响应式安全区布局优化

## 概述
优化 BeatMeter 主界面的安全区与响应式布局，让顶部操作区避开刘海/灵动岛，底部控制区更适合单手操作，并减少超高屏上的中部空白。

## 产出
- 引入 `react-native-safe-area-context`，实现安全区感知布局
- 为 BPM 顶部视觉区加入有上限的响应式高度与受控中间间距
- 收紧底部控制区内边距，提升拇指可达性

## 变更文件
- `App.tsx` - 切换安全区实现，计算顶部高度、底部停靠距离和中部间距
- `src/components/BPMDisplay.tsx` - 基于可用高度约束 BPM 圆环、字号和视觉区尺寸
- `src/components/PlaybackControls.tsx` - 缩小底部控制区冗余留白
- `package.json` - 添加 `react-native-safe-area-context` 依赖
- `package-lock.json` - 锁定新增依赖版本

## 验证
- [x] `npx tsc --noEmit` - 通过
- [x] 导入与类型结构检查 - 通过

## 后续
- 建议在 iPhone 带刘海机型和 Android 手势导航机型上各做一次真机验证
- 如需更细调，可按短屏/常规屏/超高屏再微调 `estimatedBottomHeight` 与 meter 上限
