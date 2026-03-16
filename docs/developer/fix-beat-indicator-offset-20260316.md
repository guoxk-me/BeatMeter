# Beat indicator offset

## 概述
对 BPM 圆圈下方的节拍指示点做了一个很小的下移调整。

## 产出
- 为 `BeatIndicator` 增加了外层包裹样式
- 将节拍点区域整体下移 10px

## 变更文件
- `src/components/BPMDisplay.tsx` - 为 `BeatIndicator` 添加外层 `View` 并设置下移样式

## 验证
- [ ] TypeScript 编译 - 未运行（本次为极小样式调整）
- [ ] 视觉检查 - 未运行（需在设备或模拟器确认）

## 后续
- 在模拟器或真机上确认 10px 偏移是否符合预期
- 如需更细微调整，可在 `8~12px` 区间继续微调
