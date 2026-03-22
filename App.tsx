import React, { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Alert,
  Pressable,
  Linking,
  useWindowDimensions,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { Ionicons } from '@expo/vector-icons';
import {
  SafeAreaProvider,
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import {
  APP_BLOG_URL,
  APP_DISPLAY_NAME,
  APP_FEEDBACK_EMAIL,
  APP_FEEDBACK_URL,
  APP_TAGLINE,
  colors,
  CUSTOM_SOUND_PRESET_ID,
  DEFAULT_SOUND_PRESET_ID,
  getSoundPresetLabel,
} from './src/constants';
import { useMetronome, useSettings } from './src/hooks';
import { AboutPanel, BPMDisplay, FitnessGuidanceView, PlaybackControls, PresetButtons, SettingsPanel } from './src/components';
import type { Preset } from './src/constants/presets';
import { MIN_BPM, MAX_BPM } from './src/constants';
import { isLikelyWavFile, persistCustomWav } from './src/utils/customSound';
import { readWavFileAsMonoAudio } from './src/utils/wav'
import { useI18n } from './src/i18n';;

const clamp = (value: number, min: number, max: number) => {
  if (max < min) return max;
  return Math.min(Math.max(value, min), max);
};

function AppScreen() {
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [aboutVisible, setAboutVisible] = useState(false);
  const [trainingStartedAt, setTrainingStartedAt] = useState<number | null>(null);
  const [currentTrainingDurationMs, setCurrentTrainingDurationMs] = useState(0);
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();
  const {
    settings, isLoaded,
    setHapticEnabled, setSoundEnabled, setVolume,
    setBpm: persistBpm, setSoundPresetId, setCustomSound, setLanguagePreference,
    setActiveModule, setRecentTraining,
  } = useSettings();

  const effectiveSoundPresetId = useMemo(
    () => (settings.soundPresetId === CUSTOM_SOUND_PRESET_ID && !settings.customSoundUri
      ? DEFAULT_SOUND_PRESET_ID
      : settings.soundPresetId),
    [settings.customSoundUri, settings.soundPresetId],
  );

  const { t } = useI18n(settings.languagePreference);

  const { bpm, isPlaying, currentBeat, toggle, stop, setBpm } = useMetronome(
    settings.bpm,
    settings.hapticEnabled,
    settings.soundEnabled,
    settings.volume,
    effectiveSoundPresetId,
    settings.customSoundUri,
  );

  const tapTimestamps = useRef<number[]>([]);
  const tapResetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (tapResetTimer.current) {
      clearTimeout(tapResetTimer.current);
    }
  }, []);

  useEffect(() => {
    if (!trainingStartedAt) {
      setCurrentTrainingDurationMs(0);
      return;
    }

    setCurrentTrainingDurationMs(Date.now() - trainingStartedAt);
    const timer = setInterval(() => {
      setCurrentTrainingDurationMs(Date.now() - trainingStartedAt);
    }, 1000);

    return () => clearInterval(timer);
  }, [trainingStartedAt]);

  const handleTap = useCallback(() => {
    const now = Date.now();
    if (tapResetTimer.current) clearTimeout(tapResetTimer.current);
    tapTimestamps.current.push(now);
    tapTimestamps.current = tapTimestamps.current.filter((t) => now - t < 3000);
    if (tapTimestamps.current.length >= 3) {
      const taps = tapTimestamps.current;
      const intervals: number[] = [];
      for (let i = 1; i < taps.length; i++) intervals.push(taps[i] - taps[i - 1]);
      const avg = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const clamped = Math.max(MIN_BPM, Math.min(MAX_BPM, Math.round(60000 / avg)));
      setBpm(clamped); persistBpm(clamped);
    }
    tapResetTimer.current = setTimeout(() => { tapTimestamps.current = []; }, 2000);
  }, [setBpm, persistBpm]);

  const handleBpmChange = useCallback((v: number) => { setBpm(v); persistBpm(v); }, [setBpm, persistBpm]);
  const handlePresetSelect = useCallback((p: Preset) => { setBpm(p.bpm); persistBpm(p.bpm); }, [setBpm, persistBpm]);
  const handleHapticChange = useCallback((v: boolean) => setHapticEnabled(v), [setHapticEnabled]);
  const handleSoundChange = useCallback((v: boolean) => setSoundEnabled(v), [setSoundEnabled]);
  const handleVolumeChange = useCallback((v: number) => setVolume(v), [setVolume]);
  const handleSoundPresetChange = useCallback((id: string) => setSoundPresetId(id), [setSoundPresetId]);

  const handleImportCustomSound = useCallback(async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['audio/wav', 'audio/x-wav', 'audio/wave'],
        multiple: false,
        copyToCacheDirectory: true,
      });
      if (result.canceled || !result.assets?.length) return;
      const asset = result.assets[0];
      if (!isLikelyWavFile(asset)) {
        Alert.alert(t.alertWavOnlyTitle, t.alertWavOnlyMessage);
        return;
      }
      await readWavFileAsMonoAudio(asset.uri);
      const imported = await persistCustomWav(asset);
      setCustomSound(imported.uri, imported.name);
      setSoundPresetId(CUSTOM_SOUND_PRESET_ID);
      Alert.alert(t.alertImportSuccessTitle, t.alertImportSuccessMessage(imported.name));
    } catch (error) {
      console.warn('[App] custom sound import failed:', error);
      Alert.alert(t.alertImportFailTitle, t.alertImportFailMessage);
    }
  }, [setCustomSound, setSoundPresetId]);

  const handleModuleChange = useCallback((nextModule: 'metronome' | 'fitness') => {
    setActiveModule(nextModule);
  }, [setActiveModule]);

  const handleStartTraining = useCallback(() => {
    setTrainingStartedAt(Date.now());
  }, []);

  const handleStopTraining = useCallback(() => {
    if (!trainingStartedAt) return;

    const record = {
      durationMs: Math.max(0, Date.now() - trainingStartedAt),
      endedAt: new Date().toISOString(),
    };

    setTrainingStartedAt(null);
    setCurrentTrainingDurationMs(0);
    setRecentTraining(record);
    Alert.alert('训练已记录', `最近一次训练时长：${Math.round(record.durationMs / 1000)} 秒`);
  }, [setRecentTraining, trainingStartedAt]);

  const handleOpenExternal = useCallback(async (url: string | null | undefined, label: string) => {
    const isPlaceholder = !url || url.includes('example.com');

    if (isPlaceholder) {
      Alert.alert(
        `${label}暂未配置`,
        `当前正式 ${label} 链接尚未确认，请先通过 ${APP_FEEDBACK_EMAIL} 联系我们。`,
      );
      return;
    }

    try {
      const supported = await Linking.canOpenURL(url);

      if (!supported) {
        Alert.alert(
          '无法打开链接',
          `当前设备无法打开${label}链接，请稍后重试或发送邮件至 ${APP_FEEDBACK_EMAIL}。`,
        );
        return;
      }

      await Linking.openURL(url);
    } catch (error) {
      console.warn(`[App] failed to open ${label}:`, error);
      Alert.alert(
        '打开失败',
        `无法打开${label}，请稍后重试或发送邮件至 ${APP_FEEDBACK_EMAIL}。`,
      );
    }
  }, []);

  if (!isLoaded) return null;

  const shellHeaderHeight = 132;
  const contentHeight = Math.max(windowHeight - shellHeaderHeight, 420);
  const topSpacer = clamp(insets.top * 0.18 + 8, 8, 18);
  const bottomDock = clamp(insets.bottom + 16, 24, 40);
  const estimatedBottomHeight = 260;
  const topSectionHeight = clamp(
    contentHeight * 0.42,
    300,
    contentHeight - estimatedBottomHeight - bottomDock - topSpacer - 24,
  );
  const middleGap = clamp(
    contentHeight - topSectionHeight - estimatedBottomHeight - bottomDock - topSpacer - 24,
    12,
    56,
  );

  return (
    <SafeAreaView style={styles.root} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      <View style={styles.layout}>
        <View style={styles.shellHeader}>
          <View style={styles.brandWrap}>
            <Text style={styles.brandTitle}>{APP_DISPLAY_NAME}</Text>
            <Text style={styles.brandSubtitle}>{APP_TAGLINE}</Text>
          </View>
          <Pressable
            style={({ pressed }) => [styles.aboutIconButton, pressed && styles.aboutIconButtonPressed]}
            onPress={() => setAboutVisible(true)}
          >
            <Ionicons name='information-circle-outline' size={22} color={colors.primary} />
          </Pressable>
        </View>

        <View style={styles.moduleSwitchRow}>
          <Pressable
            style={({ pressed }) => [
              styles.moduleButton,
              settings.activeModule === 'metronome' && styles.moduleButtonActive,
              pressed && styles.moduleButtonPressed,
            ]}
            onPress={() => handleModuleChange('metronome')}
          >
            <Ionicons name='musical-notes-outline' size={16} color={settings.activeModule === 'metronome' ? colors.background : colors.primary} />
            <Text style={[
              styles.moduleButtonText,
              settings.activeModule === 'metronome' && styles.moduleButtonTextActive,
            ]}
            >
              节拍器
            </Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.moduleButton,
              settings.activeModule === 'fitness' && styles.moduleButtonActive,
              pressed && styles.moduleButtonPressed,
            ]}
            onPress={() => handleModuleChange('fitness')}
          >
            <Ionicons name='barbell-outline' size={16} color={settings.activeModule === 'fitness' ? colors.background : colors.primary} />
            <Text style={[
              styles.moduleButtonText,
              settings.activeModule === 'fitness' && styles.moduleButtonTextActive,
            ]}
            >
              健身指导
            </Text>
          </Pressable>
        </View>

        {settings.activeModule === 'metronome' ? (
          <View style={[styles.metronomeLayout, { paddingTop: topSpacer }]}> 
            <View style={[styles.topGroup, { height: topSectionHeight }]}> 
              <BPMDisplay
                bpm={bpm} isPlaying={isPlaying} currentBeat={currentBeat}
                onTap={handleTap} onSettingsPress={() => setSettingsVisible(true)}
                onBpmChange={handleBpmChange}
                availableHeight={topSectionHeight}
              />
            </View>

            <View style={[styles.middleGap, { height: middleGap }]} />

            <View style={[styles.bottomGroup, { paddingBottom: bottomDock }]}> 
              <View style={styles.divider} />
              <PresetButtons currentBpm={bpm} onSelectPreset={handlePresetSelect} languagePreference={settings.languagePreference} />
              <View style={styles.divider} />
              <PlaybackControls
                isPlaying={isPlaying}
                onPlayPause={toggle}
                onStop={stop}
                soundLabel={getSoundPresetLabel(effectiveSoundPresetId, settings.customSoundName)}
              />
            </View>
          </View>
        ) : (
          <FitnessGuidanceView
            recentTraining={settings.recentTraining}
            isTrainingActive={Boolean(trainingStartedAt)}
            currentTrainingDurationMs={currentTrainingDurationMs}
            onStartTraining={handleStartTraining}
            onStopTraining={handleStopTraining}
            onOpenAbout={() => setAboutVisible(true)}
          />
        )}

        <AboutPanel
          visible={aboutVisible}
          onClose={() => setAboutVisible(false)}
          onOpenBlog={() => handleOpenExternal(APP_BLOG_URL, '博客')}
          onOpenFeedback={() => handleOpenExternal(APP_FEEDBACK_URL, '反馈')}
        />

        <SettingsPanel
          visible={settingsVisible}
          onClose={() => setSettingsVisible(false)}
          hapticEnabled={settings.hapticEnabled}
          soundEnabled={settings.soundEnabled}
          volume={settings.volume}
          soundPresetId={effectiveSoundPresetId}
          customSoundName={settings.customSoundName}
          hasCustomSound={Boolean(settings.customSoundUri)}
          onHapticChange={handleHapticChange}
          onSoundChange={handleSoundChange}
          onVolumeChange={handleVolumeChange}
          onSoundPresetChange={handleSoundPresetChange}
          onImportCustomSound={handleImportCustomSound}
          t={t}
          languagePreference={settings.languagePreference}
          onLanguageChange={setLanguagePreference}
        />
      </View>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppScreen />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  layout: {
    flex: 1,
  },
  shellHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  brandWrap: {
    flex: 1,
  },
  brandTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  brandSubtitle: {
    marginTop: 4,
    fontSize: 14,
    color: colors.textSecondary,
  },
  aboutIconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  aboutIconButtonPressed: {
    backgroundColor: colors.surfacePressed,
  },
  moduleSwitchRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 20,
    marginTop: 16,
    marginBottom: 10,
  },
  moduleButton: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  moduleButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  moduleButtonPressed: {
    opacity: 0.88,
  },
  moduleButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
  moduleButtonTextActive: {
    color: colors.background,
  },
  metronomeLayout: {
    flex: 1,
    flexDirection: 'column',
  },
  topGroup: {
    flexShrink: 1,
    minHeight: 180,
  },
  middleGap: {
    flexShrink: 1,
  },
  bottomGroup: {
    flexShrink: 0,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderSubtle,
    marginHorizontal: 20,
    marginVertical: 4,
  },
});
