import React, { useEffect, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants';
import { BeatIndicator } from './BeatIndicator';
import { BPMSlider } from './BPMSlider';

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

interface BPMDisplayProps {
  bpm: number;
  isPlaying: boolean;
  currentBeat: number;
  onTap: () => void;
  onSettingsPress: () => void;
  onBpmChange: (value: number) => void;
  availableHeight?: number;
}

export const BPMDisplay: React.FC<BPMDisplayProps> = ({
  bpm,
  isPlaying,
  currentBeat,
  onTap,
  onSettingsPress,
  onBpmChange,
  availableHeight,
}) => {
  const pulseScale   = useRef(new Animated.Value(1)).current;
  const pulseOpacity = useRef(new Animated.Value(0)).current;
  const bpmScale     = useRef(new Animated.Value(1)).current;
  const prevBeat     = useRef(-1);

  const meterSize = useMemo(() => {
    const derived = (availableHeight ?? 340) * 0.6;
    return clamp(derived, 190, 240);
  }, [availableHeight]);

  const bpmFontSize = useMemo(() => clamp(meterSize * 0.5, 96, 120), [meterSize]);
  const bpmLineHeight = useMemo(() => Math.round(bpmFontSize * 1.08), [bpmFontSize]);
  const bpmAreaHeight = useMemo(() => clamp(meterSize + 8, 190, 248), [meterSize]);
  const sliderOffset = useMemo(() => clamp((availableHeight ?? 340) * 0.03, 6, 14), [availableHeight]);

  useEffect(() => {
    if (!isPlaying) return;
    if (currentBeat === prevBeat.current) return;
    prevBeat.current = currentBeat;

    const isDownbeat = currentBeat === 0;

    Animated.parallel([
      Animated.sequence([
        Animated.timing(pulseOpacity, { toValue: isDownbeat ? 0.55 : 0.3, duration: 50, useNativeDriver: true }),
        Animated.timing(pulseOpacity, { toValue: 0, duration: isDownbeat ? 380 : 220, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      ]),
      Animated.sequence([
        Animated.timing(pulseScale, { toValue: isDownbeat ? 1.28 : 1.14, duration: 50, useNativeDriver: true }),
        Animated.timing(pulseScale, { toValue: 1, duration: isDownbeat ? 380 : 220, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      ]),
    ]).start();

    if (isDownbeat) {
      Animated.sequence([
        Animated.timing(bpmScale, { toValue: 1.04, duration: 55, useNativeDriver: true }),
        Animated.timing(bpmScale, { toValue: 1, duration: 200, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      ]).start();
    }
  }, [currentBeat, isPlaying, pulseOpacity, pulseScale, bpmScale]);

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Pressable
          style={({ pressed }) => [styles.topBtn, pressed && styles.topBtnPressed]}
          onPress={onTap}
          hitSlop={8}
        >
          <Ionicons name="hand-left-outline" size={14} color={colors.primary} style={styles.topBtnIcon} />
          <Text style={styles.topBtnText}>TAP BPM</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.topBtn, styles.settingsBtn, pressed && styles.topBtnPressed]}
          onPress={onSettingsPress}
          hitSlop={8}
        >
          <Ionicons name="settings-outline" size={22} color={colors.textSecondary} />
        </Pressable>
      </View>

      <View style={[styles.visualCluster, { marginTop: sliderOffset }]}> 
        <View style={[styles.bpmArea, { height: bpmAreaHeight }]}> 
          <Animated.View
            style={[
              styles.pulseRing,
              {
                width: meterSize,
                height: meterSize,
                borderRadius: meterSize / 2,
                opacity: pulseOpacity,
                transform: [{ scale: pulseScale }],
              },
            ]}
            pointerEvents="none"
          />
          <Animated.Text
            style={[
              styles.bpmNumber,
              {
                fontSize: bpmFontSize,
                lineHeight: bpmLineHeight,
                transform: [{ scale: bpmScale }],
                color: isPlaying ? colors.primary : colors.textPrimary,
              },
            ]}
          >
            {bpm}
          </Animated.Text>
          <Text style={styles.bpmUnit}>BPM</Text>
        </View>

        <View style={styles.beatIndicatorOffset}>
          <BeatIndicator isPlaying={isPlaying} currentBeat={currentBeat} />
        </View>
        <BPMSlider value={bpm} onValueChange={onBpmChange} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    paddingTop: 0,
  },
  topBar: {
    height: 52,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  topBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 44,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  settingsBtn: {
    width: 44,
    height: 44,
    paddingHorizontal: 0,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 22,
  },
  topBtnIcon: {
    marginRight: 6,
  },
  topBtnPressed: {
    backgroundColor: colors.surfacePressed,
  },
  topBtnText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },
  visualCluster: {
    flexShrink: 1,
    justifyContent: 'flex-start',
  },
  bpmArea: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
  beatIndicatorOffset: {
    marginTop: 10,
  },
  pulseRing: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  bpmNumber: {
    fontWeight: '900' as const,
    letterSpacing: -3,
    color: colors.textPrimary,
  },
  bpmUnit: {
    fontSize: 15,
    fontWeight: '700' as const,
    letterSpacing: 3,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
