import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DEFAULT_BPM } from '../constants';
import { DEFAULT_SOUND_PRESET_ID } from '../constants/sounds';
import type { LanguagePreference } from '../i18n';

const SETTINGS_KEY = '@beatmeter_settings';

export type AppModule = 'metronome' | 'fitness';

export interface TrainingSessionRecord {
  durationMs: number;
  endedAt: string;
}

export interface Settings {
  bpm: number;
  hapticEnabled: boolean;
  soundEnabled: boolean;
  volume: number;
  soundPresetId: string;
  customSoundUri: string | null;
  customSoundName: string | null;
  languagePreference: LanguagePreference;
  activeModule: AppModule;
  recentTraining: TrainingSessionRecord | null;
}

const DEFAULT_SETTINGS: Settings = {
  bpm: DEFAULT_BPM,
  hapticEnabled: true,
  soundEnabled: true,
  volume: 1.0,
  soundPresetId: DEFAULT_SOUND_PRESET_ID,
  customSoundUri: null,
  customSoundName: null,
  languagePreference: 'system',
  activeModule: 'metronome',
  recentTraining: null,
};

const sanitizeSettings = (parsed: Partial<Settings>): Settings => {
  const activeModule = parsed.activeModule === 'fitness' ? 'fitness' : 'metronome';
  const recentTraining = parsed.recentTraining
    && typeof parsed.recentTraining.durationMs === 'number'
    && typeof parsed.recentTraining.endedAt === 'string'
    ? parsed.recentTraining
    : null;

  return {
    ...DEFAULT_SETTINGS,
    ...parsed,
    activeModule,
    recentTraining,
  };
};

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(SETTINGS_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as Partial<Settings>;
          setSettings(sanitizeSettings(parsed));
        }
      } catch (err) {
        console.warn('[useSettings] load failed:', err);
      } finally {
        setIsLoaded(true);
      }
    })();
  }, []);

  const saveSettings = useCallback(async (patch: Partial<Settings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...patch };
      AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(updated)).catch(
        (err) => console.warn('[useSettings] save failed:', err),
      );
      return updated;
    });
  }, []);

  const setBpm = useCallback((bpm: number) => saveSettings({ bpm }), [saveSettings]);
  const setHapticEnabled = useCallback((hapticEnabled: boolean) => saveSettings({ hapticEnabled }), [saveSettings]);
  const setSoundEnabled = useCallback((soundEnabled: boolean) => saveSettings({ soundEnabled }), [saveSettings]);
  const setVolume = useCallback((volume: number) => saveSettings({ volume: Math.max(0, Math.min(1, volume)) }), [saveSettings]);
  const setSoundPresetId = useCallback((soundPresetId: string) => saveSettings({ soundPresetId }), [saveSettings]);
  const setCustomSound = useCallback((customSoundUri: string | null, customSoundName: string | null) => saveSettings({ customSoundUri, customSoundName }), [saveSettings]);
  const setLanguagePreference = useCallback((languagePreference: LanguagePreference) => saveSettings({ languagePreference }), [saveSettings]);
  const setActiveModule = useCallback((activeModule: AppModule) => saveSettings({ activeModule }), [saveSettings]);
  const setRecentTraining = useCallback((recentTraining: TrainingSessionRecord | null) => saveSettings({ recentTraining }), [saveSettings]);

  return {
    settings,
    isLoaded,
    setBpm,
    setHapticEnabled,
    setSoundEnabled,
    setVolume,
    setSoundPresetId,
    setCustomSound,
    setLanguagePreference,
    setActiveModule,
    setRecentTraining,
    saveSettings,
  };
}
