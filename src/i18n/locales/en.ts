export interface Translations {
  // Main screen
  tapBpm: string;

  // Settings panel
  settings: string;
  done: string;
  sectionSound: string;
  currentSound: string;
  backgroundTrackNote: string;
  customWav: string;
  importedCustomSound: string;
  importCustomWav: string;
  reimportCustomWav: string;
  hapticFeedback: string;
  hapticFeedbackSub: string;
  beatSound: string;
  beatSoundSub: string;
  volume: string;
  language: string;
  languageFollowSystem: string;
  languageChinese: string;
  languageEnglish: string;

  // Alert: WAV import
  alertWavOnlyTitle: string;
  alertWavOnlyMessage: string;
  alertImportSuccessTitle: string;
  alertImportSuccessMessage: (name: string) => string;
  alertImportFailTitle: string;
  alertImportFailMessage: string;

  // Presets
  presets: {
    walk:   { label: string; description: string };
    jog:    { label: string; description: string };
    tempo:  { label: string; description: string };
    sprint: { label: string; description: string };
  };

  // Sound presets
  soundPresets: Record<string, { label: string; description: string }>;

  customWavFallback: string;
}

export const en: Translations = {
  tapBpm: 'TAP BPM',

  settings: 'Settings',
  done: 'Done',
  sectionSound: 'Sound',
  currentSound: 'Current Sound',
  backgroundTrackNote: 'The selected sound will be used to generate the loop track for background playback.',
  customWav: 'Custom WAV',
  importedCustomSound: 'Custom sound imported',
  importCustomWav: 'Import Custom WAV',
  reimportCustomWav: 'Re-import Custom WAV',
  hapticFeedback: 'Haptic Feedback',
  hapticFeedbackSub: 'Per-beat vibration in foreground only',
  beatSound: 'Beat Sound',
  beatSoundSub: 'Mute playback while keeping beat state',
  volume: 'Volume',
  language: 'Language',
  languageFollowSystem: 'Follow System',
  languageChinese: 'Chinese',
  languageEnglish: 'English',

  alertWavOnlyTitle: 'WAV Only',
  alertWavOnlyMessage: 'Please select a .wav audio file.',
  alertImportSuccessTitle: 'Import Successful',
  alertImportSuccessMessage: (name: string) => `Switched to custom sound: ${name}`,
  alertImportFailTitle: 'Import Failed',
  alertImportFailMessage: 'Cannot use this WAV file. Please verify the file is valid and in standard WAV format.',

  presets: {
    walk:   { label: 'Walk',   description: 'Easy walk' },
    jog:    { label: 'Jog',    description: 'Aerobic jog' },
    tempo:  { label: 'Tempo',  description: 'Pace training' },
    sprint: { label: 'Sprint', description: 'High-intensity sprint' },
  },

  soundPresets: {
    'classic-click':  { label: 'Classic Click',  description: 'Short and clear, great for steady beats' },
    'soft-beep':      { label: 'Soft Beep',      description: 'Rounder and softer, easier on long sessions' },
    'sharp-digital':  { label: 'Sharp Digital',  description: 'Brighter and crisper, stronger punch' },
    'woodblock':      { label: 'Woodblock',      description: 'Natural wooden knock, organic and warm' },
    'cowbell':        { label: 'Cowbell',        description: 'Classic Latin percussion, highly penetrating' },
    'hi-hat':         { label: 'Hi-Hat',         description: 'Ultra-short metallic snap, great for dense rhythms' },
    'clave':          { label: 'Clave',          description: 'Crisp hardwood click, strong rhythmic feel' },
  },

  customWavFallback: 'Custom WAV',
};
