## 1. 图标生成

- [x] 1.1 使用 AI 生成主图标（1024x1024 PNG）
- [x] 1.2 验证生成的图标效果
- [x] 1.3 如需迭代，调整提示词重新生成

## 2. 图标资源处理

- [x] 2.1 导出 iOS 所需的各种尺寸图标 (暂时使用主图标)
- [x] 2.2 导出 Android Adaptive Icon 资源（foreground、background、monochrome）
- [x] 2.3 生成 Web favicon
- [x] 2.4 替换 assets/ 目录下的旧图标文件

## 3. 启动画面设计

- [x] 3.1 设计启动画面专用 Logo 图（1024x1024）
- [x] 3.2 导出为 splash-icon.png
- [x] 3.3 验证启动画面显示效果

## 4. 配置文件更新

- [x] 4.1 统一 app.json 中的默认 name 为"BeatMeter"
- [x] 4.2 更新 iOS 的 CFBundleDisplayName 为"节拍器"
- [x] 4.3 验证配置更新后 app 名称显示正确

## 5. 验证与测试

- [ ] 5.1 在 iOS 模拟器上验证图标和名称
- [x] 5.2 在 Android 模拟器上验证图标和名称
- [x] 5.3 验证启动画面显示正常
- [x] 5.4 运行 npx tsc --noEmit 确保无类型错误
