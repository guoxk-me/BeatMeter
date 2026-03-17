import type { Translations } from './en';

export const zh: Translations = {
  tapBpm: 'TAP BPM',

  settings: '设置',
  done: '完成',
  sectionSound: '音效',
  currentSound: '当前音效',
  backgroundTrackNote: '后台播放将使用当前选中的音效生成循环轨道',
  customWav: '自定义 WAV',
  importedCustomSound: '已导入自定义音效',
  importCustomWav: '导入自定义 WAV',
  reimportCustomWav: '重新导入自定义 WAV',
  hapticFeedback: '触觉反馈',
  hapticFeedbackSub: '仅在前台提供每拍震动提示',
  beatSound: '节拍音效',
  beatSoundSub: '关闭后静音播放，但保持节拍状态',
  volume: '音量',
  language: '语言',
  languageFollowSystem: '跟随系统',
  languageChinese: '中文',
  languageEnglish: 'English',

  alertWavOnlyTitle: '仅支持 WAV',
  alertWavOnlyMessage: '请选择 .wav 格式的音效文件。',
  alertImportSuccessTitle: '导入成功',
  alertImportSuccessMessage: (name: string) => `已切换为自定义音效：${name}`,
  alertImportFailTitle: '导入失败',
  alertImportFailMessage: '无法使用这个 WAV 文件，请确认文件可用且为标准 WAV 格式。',

  presets: {
    walk:   { label: '步行',   description: '轻松步行' },
    jog:    { label: '轻松跑', description: '有氧慢跑' },
    tempo:  { label: '节奏跑', description: '配速训练' },
    sprint: { label: '冲刺',   description: '高强冲刺' },
  },

  soundPresets: {
    'classic-click':  { label: '经典 Click',     description: '短促清晰，适合稳定打拍' },
    'soft-beep':      { label: '柔和 Beep',      description: '更圆润柔和，长时间听感更轻' },
    'sharp-digital':  { label: '数字 Sharp',     description: '更亮更利落，穿透感更强' },
    'woodblock':      { label: '木鱼 Woodblock', description: '自然木质敲击声，有机且温和' },
    'cowbell':        { label: '牛铃 Cowbell',   description: '经典拉丁打击乐，穿透力强' },
    'hi-hat':         { label: '踩镲 Hi-Hat',    description: '极短促的金属声，适合密集节奏' },
    'clave':          { label: '响板 Clave',     description: '清脆的硬木撞击声，节奏感分明' },
  },

  customWavFallback: '自定义 WAV',
};
