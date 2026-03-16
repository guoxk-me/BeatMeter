import React, { useState, useCallback, useRef, useMemo } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  Alert,
  useWindowDimensions,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import {
  SafeAreaProvider,
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { colors, CUSTOM_SOUND_PRESET_ID, DEFAULT_SOUND_PRESET_ID, getSoundPresetLabel } from './src/constants';
import { useMetronome, useSettings } from './src/hooks';
import { BPMDisplay, PresetButtons, PlaybackControls, SettingsPanel } from './src/components';
import type { Preset } from './src/constants/presets';
import { MIN_BPM, MAX_BPM } from './src/constants';
import { isLikelyWavFile, persistCustomWav } from './src/utils/customSound';
import { readWavFileAsMonoAudio } from './src/utils/wav';

const clamp = (value: number, min: number, max: number) => {
  if (max < min) return max;
  return Math.min(Math.max(value, min), max);
};

function AppScreen() {
  const [settingsVisible, setSettingsVisible] = useState(false);
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();
  const {
    settings, isLoaded,
    setHapticEnabled, setSoundEnabled, setVolume,
    setBpm: persistBpm, setSoundPresetId, setCustomSound,
  } = useSettings();

  const effectiveSoundPresetId = useMemo(
    () => (settings.soundPresetId === CUSTOM_SOUND_PRESET_ID && !settings.customSoundUri
      ? DEFAULT_SOUND_PRESET_ID
      : settings.soundPresetId),
    [settings.customSoundUri, settings.soundPresetId],
  );

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
        Alert.alert('仅支持 WAV', '请选择 .wav 格式的音效文件。');
        return;
      }
      await readWavFileAsMonoAudio(asset.uri);
      const imported = await persistCustomWav(asset);
      setCustomSound(imported.uri, imported.name);
      setSoundPresetId(CUSTOM_SOUND_PRESET_ID);
      Alert.alert('导入成功', `已切换为自定义音效：${imported.name}`);
    } catch (error) {
      console.warn('[App] custom sound import failed:', error);
      Alert.alert('导入失败', '无法使用这个 WAV 文件，请确认文件可用且为标准 WAV 格式。');
    }
  }, [setCustomSound, setSoundPresetId]);

  if (!isLoaded) return null;

  const topSpacer = clamp(insets.top * 0.18 + 8, 8, 18);
  const bottomDock = clamp(insets.bottom + 16, 24, 40);
  const estimatedBottomHeight = 260;
  const topSectionHeight = clamp(
    windowHeight * 0.42,
    300,
    windowHeight - estimatedBottomHeight - bottomDock - topSpacer - 24,
  );
  const middleGap = clamp(
    windowHeight - topSectionHeight - estimatedBottomHeight - bottomDock - topSpacer - 24,
    12,
    56,
  );

  return (
    <SafeAreaView style={styles.root} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      <View style={[styles.layout, { paddingTop: topSpacer }]}> 
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
          <PresetButtons currentBpm={bpm} onSelectPreset={handlePresetSelect} />
          <View style={styles.divider} />
          <PlaybackControls
            isPlaying={isPlaying}
            onPlayPause={toggle}
            onStop={stop}
            soundLabel={getSoundPresetLabel(effectiveSoundPresetId, settings.customSoundName)}
          />
        </View>
      </View>

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
      />
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
