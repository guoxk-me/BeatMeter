import { getLocales } from 'expo-localization';
import { en, type Translations } from './locales/en';
import { zh } from './locales/zh';

export type LanguagePreference = 'system' | 'zh' | 'en';
export type { Translations };

function resolveLocale(pref: LanguagePreference): 'zh' | 'en' {
  if (pref === 'zh') return 'zh';
  if (pref === 'en') return 'en';
  // system: detect from device locale
  const systemLocale = getLocales()[0]?.languageCode ?? 'en';
  return systemLocale.startsWith('zh') ? 'zh' : 'en';
}

export function useI18n(languagePreference: LanguagePreference): { t: Translations; locale: 'zh' | 'en' } {
  const locale = resolveLocale(languagePreference);
  const t = locale === 'zh' ? zh : en;
  return { t, locale };
}

export function getSoundPresetI18n(
  soundPresetId: string,
  customSoundName: string | null | undefined,
  t: Translations,
): string {
  if (soundPresetId === 'custom') {
    return customSoundName?.trim() || t.customWavFallback;
  }
  return t.soundPresets[soundPresetId]?.label ?? t.soundPresets['classic-click'].label;
}
