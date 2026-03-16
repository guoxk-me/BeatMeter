export const CUSTOM_SOUND_PRESET_ID = 'custom';
export const DEFAULT_SOUND_PRESET_ID = 'classic-click';

export interface SoundPresetOption {
  id: string;
  label: string;
  description: string;
}

export const SOUND_PRESETS: SoundPresetOption[] = [
  {
    id: DEFAULT_SOUND_PRESET_ID,
    label: '经典 Click',
    description: '短促清晰，适合稳定打拍',
  },
  {
    id: 'soft-beep',
    label: '柔和 Beep',
    description: '更圆润柔和，长时间听感更轻',
  },
  {
    id: 'sharp-digital',
    label: '数字 Sharp',
    description: '更亮更利落，穿透感更强',
  },
  {
    id: 'woodblock',
    label: '木鱼 Woodblock',
    description: '自然木质敲击声，有机且温和',
  },
  {
    id: 'cowbell',
    label: '牛铃 Cowbell',
    description: '经典拉丁打击乐，穿透力强',
  },
  {
    id: 'hi-hat',
    label: '踩镲 Hi-Hat',
    description: '极短促的金属声，适合密集节奏',
  },
  {
    id: 'clave',
    label: '响板 Clave',
    description: '清脆的硬木撞击声，节奏感分明',
  },
];

export function getSoundPresetLabel(soundPresetId: string, customSoundName?: string | null) {
  if (soundPresetId === CUSTOM_SOUND_PRESET_ID) {
    return customSoundName?.trim() || '自定义 WAV';
  }

  return SOUND_PRESETS.find((preset) => preset.id === soundPresetId)?.label ?? SOUND_PRESETS[0].label;
}
