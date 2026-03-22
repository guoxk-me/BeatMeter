# Fitness guidance and rebrand MVP

## 概述
完成 TempoFit 双模块 MVP：在保留节拍器逻辑的前提下，新增健身指导壳层、训练内容浏览、训练计时与最近结果持久化，以及关于/反馈入口。

## 产出
- 新增健身指导首页、分类/动作详情、器械列表/详情和静态媒体占位展示
- 接入应用内品牌常量、关于页入口、外链兜底处理和最近训练记录展示

## 变更文件
- `App.tsx` - 接入双模块壳层、关于弹层、训练计时、外链兜底与节拍器保留逻辑
- `src/components/FitnessGuidanceView.tsx` - 实现健身指导 MVP 浏览与训练计时 UI
- `src/components/AboutPanel.tsx` - 复用品牌化关于页
- `src/components/SettingsPanel.tsx` - 使用新的品牌版本文案
- `src/components/index.ts` - 导出新组件
- `openspec/changes/add-fitness-guidance-and-rebrand/tasks.md` - 勾选本次完成任务

## 验证
- [x] `npx tsc --noEmit` - 通过
- [ ] 手动验证双模块导航、训练计时、关于页外链与节拍器回归 - 待本地运行确认

## 后续
- 将 `example.com` 占位博客/反馈链接替换为正式地址
- 若后续补充真实媒体资源，可将动作媒体卡片替换为 bundled 图片或视频封面
