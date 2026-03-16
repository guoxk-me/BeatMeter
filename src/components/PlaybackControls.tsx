import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants';

interface PlaybackControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onStop: () => void;
  soundLabel?: string;
}

export const PlaybackControls: React.FC<PlaybackControlsProps> = ({
  isPlaying,
  onPlayPause,
  onStop,
  soundLabel,
}) => {
  return (
    <View style={styles.wrapper}>
      {soundLabel ? (
        <Text style={styles.soundLabel}>{soundLabel}</Text>
      ) : null}
      <View style={styles.container}>
        {/* Stop */}
        <Pressable
          style={({ pressed }) => [styles.stopBtn, pressed && styles.stopBtnPressed]}
          onPress={onStop}
        >
          <Ionicons name="stop" size={22} color={colors.textSecondary} />
        </Pressable>

        {/* Play / Pause */}
        <Pressable
          style={({ pressed }) => [
            styles.playBtn,
            pressed && styles.playBtnPressed,
          ]}
          onPress={onPlayPause}
        >
          {isPlaying
            ? <Ionicons name="pause" size={28} color={colors.background} />
            : <Ionicons name="play" size={28} color={colors.background} style={{ marginLeft: 3 }} />
          }
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    paddingTop: 6,
    paddingBottom: 10,
  },

  soundLabel: {
    fontSize: 12,
    color: colors.textMuted,
    letterSpacing: 0.5,
    marginBottom: 8,
    textAlign: 'center',
  },

  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 22,
  },

  stopBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },

  stopBtnPressed: {
    backgroundColor: colors.surfacePressed,
  },

  playBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },

  playBtnPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.96 }],
  },
});
