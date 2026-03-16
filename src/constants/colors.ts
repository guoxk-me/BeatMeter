// BeatMeter Color System - Calm Sport Dark
export const colors = {
  background: '#111111',
  backgroundSecondary: '#181818',
  surface: '#222222',
  surfaceElevated: '#2C2C2C',
  surfacePressed: '#333333',
  primary: '#34C77B',
  primarySubtle: '#1F4A35',
  primaryMuted: 'rgba(52, 199, 123, 0.15)',
  danger: '#E86B4F',
  textPrimary: '#F5F5F5',
  textSecondary: '#9A9A9A',
  textMuted: '#555555',
  border: '#2A2A2A',
  borderSubtle: '#1E1E1E',
  borderActive: 'rgba(52, 199, 123, 0.35)',
  beatActive: '#34C77B',
  beatDownbeat: '#FFFFFF',
  beatInactive: "#3E3E3E",
} as const;

export type Colors = typeof colors;
