import React, { useRef, useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  GestureResponderEvent,
  LayoutChangeEvent,
} from 'react-native';
import { colors, MIN_BPM, MAX_BPM } from '../constants';

const TRACK_PADDING = 24; // paddingH on each side
const THUMB_SIZE = 28;

interface BPMSliderProps {
  value: number;
  onValueChange: (value: number) => void;
  min?: number;
  max?: number;
}

export const BPMSlider: React.FC<BPMSliderProps> = ({
  value,
  onValueChange,
  min = MIN_BPM,
  max = MAX_BPM,
}) => {
  const [trackContainerWidth, setTrackContainerWidth] = useState(0);

  // 40*2 = two ±buttons, 12*2 = two gaps, 24*2 = horizontal padding
  const trackWidth = Math.max(1, trackContainerWidth - 40 * 2 - 12 * 2 - 24 * 2);

  const progress = (value - min) / (max - min);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleContainerLayout = useCallback((event: LayoutChangeEvent) => {
    setTrackContainerWidth(event.nativeEvent.layout.width);
  }, []);

  const clampBpm = useCallback(
    (v: number) => Math.max(min, Math.min(max, v)),
    [min, max],
  );

  const handleTrackPress = useCallback(
    (event: GestureResponderEvent) => {
      const { locationX } = event.nativeEvent;
      const ratio = Math.max(0, Math.min(1, locationX / trackWidth));
      const newVal = Math.round(ratio * (max - min) + min);
      onValueChange(clampBpm(newVal));
    },
    [trackWidth, min, max, onValueChange, clampBpm],
  );

  const handleDecrement = useCallback(() => {
    onValueChange(clampBpm(value - 1));
  }, [value, onValueChange, clampBpm]);

  const handleIncrement = useCallback(() => {
    onValueChange(clampBpm(value + 1));
  }, [value, onValueChange, clampBpm]);

  const stopRepeat = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const startRepeatDecrement = () => {
    handleDecrement();
    intervalRef.current = setInterval(handleDecrement, 120);
  };

  const startRepeatIncrement = () => {
    handleIncrement();
    intervalRef.current = setInterval(handleIncrement, 120);
  };

  const thumbLeft = progress * (trackWidth - THUMB_SIZE);

  return (
    <View style={styles.container} onLayout={handleContainerLayout}>
      {/* − button */}
      <Pressable
        style={({ pressed }) => [styles.adjBtn, pressed && styles.adjBtnPressed]}
        onPress={handleDecrement}
        onLongPress={startRepeatDecrement}
        onPressOut={stopRepeat}
        hitSlop={4}
      >
        <Text style={styles.adjBtnText}>−</Text>
      </Pressable>

      {/* Track — invisible until layout resolves */}
      {trackContainerWidth > 0 && (
        <Pressable style={[styles.trackHitArea, { width: trackWidth }]} onPress={handleTrackPress}>
          <View style={[styles.trackBg, { width: trackWidth }]}>
            <View
              style={[
                styles.trackFill,
                { width: Math.max(THUMB_SIZE / 2, progress * trackWidth) },
              ]}
            />
            <View style={[styles.thumb, { left: thumbLeft }]} />
          </View>
        </Pressable>
      )}

      {/* + button */}
      <Pressable
        style={({ pressed }) => [styles.adjBtn, pressed && styles.adjBtnPressed]}
        onPress={handleIncrement}
        onLongPress={startRepeatIncrement}
        onPressOut={stopRepeat}
        hitSlop={4}
      >
        <Text style={styles.adjBtnText}>+</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 6,
    gap: 12,
  },

  adjBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },

  adjBtnPressed: {
    backgroundColor: colors.surfacePressed,
    borderColor: colors.borderActive,
  },

  adjBtnText: {
    fontSize: 22,
    fontWeight: '500' as const,
    color: colors.textPrimary,
    lineHeight: 26,
  },

  trackHitArea: {
    height: 44,
    justifyContent: 'center',
  },

  trackBg: {
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.surface,
    position: 'relative',
  },

  trackFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: '100%',
    borderRadius: 2,
    backgroundColor: colors.primary,
  },

  thumb: {
    position: 'absolute',
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: colors.primary,
    top: -(THUMB_SIZE - 4) / 2,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 6,
  },
});
