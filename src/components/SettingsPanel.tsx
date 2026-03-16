import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  ScrollView,
  Switch,
} from 'react-native';
import { colors, CUSTOM_SOUND_PRESET_ID, getSoundPresetLabel, SOUND_PRESETS } from '../constants';

interface SettingsPanelProps {
  visible: boolean;
  onClose: () => void;
  hapticEnabled: boolean;
  soundEnabled: boolean;
  volume: number;
  soundPresetId: string;
  customSoundName?: string | null;
  hasCustomSound: boolean;
  onHapticChange: (v: boolean) => void;
  onSoundChange: (v: boolean) => void;
  onVolumeChange: (v: number) => void;
  onSoundPresetChange: (soundPresetId: string) => void;
  onImportCustomSound: () => void;
}

const volumeSteps = [0.3, 0.5, 0.7, 0.9, 1.1, 1.3, 1.5];

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  visible,
  onClose,
  hapticEnabled,
  soundEnabled,
  volume,
  soundPresetId,
  customSoundName,
  hasCustomSound,
  onHapticChange,
  onSoundChange,
  onVolumeChange,
  onSoundPresetChange,
  onImportCustomSound,
}) => {
  const currentStep = volumeSteps.reduce((prev, curr) => (
    Math.abs(curr - volume) < Math.abs(prev - volume) ? curr : prev
  ));

  const activeSoundLabel = getSoundPresetLabel(soundPresetId, customSoundName);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Pressable style={styles.backdrop} onPress={onClose} />

      <View style={styles.sheet}>
        <View style={styles.handle} />
        <Text style={styles.title}>设置</Text>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>音效</Text>

            <View style={styles.soundSummary}>
              <Text style={styles.summaryLabel}>当前音效</Text>
              <Text style={styles.summaryValue}>{activeSoundLabel}</Text>
              <Text style={styles.summarySub}>后台播放将使用当前选中的音效生成循环轨道</Text>
            </View>

            <View style={styles.chipWrap}>
              {SOUND_PRESETS.map((preset) => {
                const active = soundPresetId === preset.id;

                return (
                  <Pressable
                    key={preset.id}
                    style={({ pressed }) => [
                      styles.soundChip,
                      active && styles.soundChipActive,
                      pressed && styles.soundChipPressed,
                    ]}
                    onPress={() => onSoundPresetChange(preset.id)}
                  >
                    <Text style={[styles.soundChipLabel, active && styles.soundChipLabelActive]}>{preset.label}</Text>
                    <Text style={[styles.soundChipSub, active && styles.soundChipSubActive]}>{preset.description}</Text>
                  </Pressable>
                );
              })}

              {hasCustomSound && (
                <Pressable
                  style={({ pressed }) => [
                    styles.soundChip,
                    soundPresetId === CUSTOM_SOUND_PRESET_ID && styles.soundChipActive,
                    pressed && styles.soundChipPressed,
                  ]}
                  onPress={() => onSoundPresetChange(CUSTOM_SOUND_PRESET_ID)}
                >
                  <Text style={[
                    styles.soundChipLabel,
                    soundPresetId === CUSTOM_SOUND_PRESET_ID && styles.soundChipLabelActive,
                  ]}
                  >
                    自定义 WAV
                  </Text>
                  <Text style={[
                    styles.soundChipSub,
                    soundPresetId === CUSTOM_SOUND_PRESET_ID && styles.soundChipSubActive,
                  ]}
                  >
                    {customSoundName || '已导入自定义音效'}
                  </Text>
                </Pressable>
              )}
            </View>

            <Pressable
              style={({ pressed }) => [styles.importButton, pressed && styles.importButtonPressed]}
              onPress={onImportCustomSound}
            >
              <Text style={styles.importButtonText}>{hasCustomSound ? '重新导入自定义 WAV' : '导入自定义 WAV'}</Text>
            </Pressable>
          </View>

          <View style={styles.card}>
            <View style={styles.row}>
              <View style={styles.rowTextWrap}>
                <Text style={styles.rowLabel}>触觉反馈</Text>
                <Text style={styles.rowSub}>仅在前台提供每拍震动提示</Text>
              </View>
              <Switch
                value={hapticEnabled}
                onValueChange={onHapticChange}
                trackColor={{ false: colors.surfaceElevated, true: colors.primary }}
                thumbColor={colors.textPrimary}
                ios_backgroundColor={colors.surfaceElevated}
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.row}>
              <View style={styles.rowTextWrap}>
                <Text style={styles.rowLabel}>节拍音效</Text>
                <Text style={styles.rowSub}>关闭后静音播放，但保持节拍状态</Text>
              </View>
              <Switch
                value={soundEnabled}
                onValueChange={onSoundChange}
                trackColor={{ false: colors.surfaceElevated, true: colors.primary }}
                thumbColor={colors.textPrimary}
                ios_backgroundColor={colors.surfaceElevated}
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.volumeSection}>
              <Text style={styles.rowLabel}>音量</Text>
              <View style={styles.volumeSteps}>
                {volumeSteps.map((step) => (
                  <Pressable
                    key={step}
                    style={[
                      styles.volumeStep,
                      step <= currentStep && styles.volumeStepActive,
                    ]}
                    onPress={() => onVolumeChange(step)}
                  />
                ))}
              </View>
            </View>
          </View>
        </ScrollView>

        <Pressable style={({ pressed }) => [styles.closeBtn, pressed && styles.closeBtnPressed]} onPress={onClose}>
          <Text style={styles.closeBtnText}>完成</Text>
        </Pressable>

        <Text style={styles.version}>BeatMeter v1.0.0</Text>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  sheet: {
    maxHeight: '82%',
    backgroundColor: colors.backgroundSecondary,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 12,
    borderTopWidth: 1,
    borderColor: colors.border,
  },
  handle: {
    alignSelf: 'center',
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.textMuted,
    marginBottom: 20,
  },
  title: {
    fontSize: 17,
    fontWeight: '700' as const,
    color: colors.textPrimary,
    marginBottom: 16,
  },
  scrollView: {
    flexGrow: 0,
  },
  scrollContent: {
    gap: 14,
    paddingBottom: 4,
  },
  card: {
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: colors.textPrimary,
    marginBottom: 14,
  },
  soundSummary: {
    borderRadius: 12,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    marginBottom: 14,
  },
  summaryLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: colors.textPrimary,
  },
  summarySub: {
    marginTop: 6,
    fontSize: 12,
    lineHeight: 18,
    color: colors.textMuted,
  },
  chipWrap: {
    gap: 10,
  },
  soundChip: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.backgroundSecondary,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  soundChipActive: {
    borderColor: colors.borderActive,
    backgroundColor: colors.primaryMuted,
  },
  soundChipPressed: {
    opacity: 0.88,
  },
  soundChipLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.textPrimary,
  },
  soundChipLabelActive: {
    color: colors.primary,
  },
  soundChipSub: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 4,
  },
  soundChipSubActive: {
    color: colors.textSecondary,
  },
  importButton: {
    marginTop: 14,
    height: 46,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderActive,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  importButtonPressed: {
    backgroundColor: colors.surfacePressed,
  },
  importButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: colors.primary,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 6,
  },
  rowTextWrap: {
    flex: 1,
  },
  rowLabel: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: colors.textPrimary,
  },
  rowSub: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 3,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderSubtle,
    marginVertical: 14,
  },
  volumeSection: {
    paddingTop: 2,
  },
  volumeSteps: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  volumeStep: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.background,
  },
  volumeStepActive: {
    backgroundColor: colors.primary,
  },
  closeBtn: {
    marginTop: 18,
    height: 50,
    borderRadius: 12,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  closeBtnPressed: {
    backgroundColor: colors.surfacePressed,
  },
  closeBtnText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: colors.textPrimary,
  },
  version: {
    textAlign: 'center',
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 16,
  },
});
