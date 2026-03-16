// 跑步步频预设
export interface Preset {
  id: string;
  label: string;
  bpm: number;
  description: string;
}

export const presets: Preset[] = [
  {
    id: 'walk',
    label: '步行',
    bpm: 110,
    description: '轻松步行',
  },
  {
    id: 'jog',
    label: '轻松跑',
    bpm: 160,
    description: '有氧慢跑',
  },
  {
    id: 'tempo',
    label: '节奏跑',
    bpm: 170,
    description: '配速训练',
  },
  {
    id: 'sprint',
    label: '冲刺',
    bpm: 180,
    description: '高强冲刺',
  },
];

export const DEFAULT_BPM = 170;
export const MIN_BPM = 40;
export const MAX_BPM = 220;
