import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { colors } from '../constants';

interface BeatIndicatorProps {
  isPlaying: boolean;
  currentBeat: number;
}

export const BeatIndicator: React.FC<BeatIndicatorProps> = ({
  isPlaying,
  currentBeat,
}) => {
  return (
    <View style={styles.container}>
      {[0, 1, 2, 3].map((index) => (
        <BeatDot
          key={index}
          index={index}
          isActive={isPlaying && currentBeat === index}
          isDownbeat={index === 0}
        />
      ))}
    </View>
  );
};

interface BeatDotProps {
  index: number;
  isActive: boolean;
  isDownbeat: boolean;
}

const BeatDot: React.FC<BeatDotProps> = ({ isActive, isDownbeat }) => {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isActive) {
      Animated.sequence([
        Animated.timing(anim, {
          toValue: 1,
          duration: 55,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: 0,
          duration: isDownbeat ? 320 : 180,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isActive, isDownbeat, anim]);

  const opacity = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.22, 1],
  });

  const scale = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, isDownbeat ? 1.5 : 1.25],
  });

  const bgColor = isDownbeat ? colors.beatDownbeat : colors.beatActive;

  return (
    <Animated.View
      style={[
        styles.dot,
        isDownbeat && styles.dotDownbeat,
        {
          backgroundColor: isActive ? bgColor : colors.beatInactive,
          opacity: isActive ? opacity : 1,
          transform: [{ scale: isActive ? scale : 1 }],
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 6,
    gap: 20,
  },

  dot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.beatInactive,
    alignSelf: 'center',
  },

  dotDownbeat: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignSelf: 'center',
  },
});
