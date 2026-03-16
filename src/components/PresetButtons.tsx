import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { colors, presets } from '../constants';
import type { Preset } from '../constants';

interface PresetButtonsProps {
  currentBpm: number;
  onSelectPreset: (preset: Preset) => void;
}

export const PresetButtons: React.FC<PresetButtonsProps> = ({
  currentBpm,
  onSelectPreset,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {presets.map((preset) => {
          const isActive = currentBpm === preset.bpm;
          return (
            <Pressable
              key={preset.id}
              style={({ pressed }) => [
                styles.button,
                isActive && styles.buttonActive,
                pressed && styles.buttonPressed,
              ]}
              onPress={() => onSelectPreset(preset)}
            >
              {/* Active left accent bar */}
              {isActive && <View style={styles.activeBar} />}

              <View style={styles.content}>
                <Text style={[styles.label, isActive && styles.labelActive]}>
                  {preset.label}
                </Text>
                <Text style={[styles.description, isActive && styles.descriptionActive]}>
                  {preset.description}
                </Text>
              </View>

              <Text style={[styles.bpmValue, isActive && styles.bpmValueActive]}>
                {preset.bpm}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingVertical: 6,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },

  button: {
    width: '47.5%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'transparent',
    paddingVertical: 11,
    paddingHorizontal: 14,
    overflow: 'hidden',
    position: 'relative',
  },

  buttonActive: {
    backgroundColor: colors.primarySubtle,
    borderColor: 'transparent',
  },

  buttonPressed: {
    backgroundColor: colors.surfacePressed,
  },

  activeBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    backgroundColor: colors.primary,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },

  content: {
    flex: 1,
    marginLeft: 4,
  },

  label: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: colors.textSecondary,
  },

  labelActive: {
    color: colors.primary,
  },

  description: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },

  descriptionActive: {
    color: colors.primary,
    opacity: 0.7,
  },

  bpmValue: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: colors.textMuted,
  },

  bpmValueActive: {
    color: colors.primary,
  },
});
