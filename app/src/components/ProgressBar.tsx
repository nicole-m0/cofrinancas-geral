import React from 'react';
import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/data/theme';

export type ProgressBarProps = {
  value: number; // 0..1 or 0..100
  color?: string;
  track?: string;
  height?: number;
};

export function ProgressBar({ value, color, track, height = 8 }: ProgressBarProps) {
  const { colors } = useTheme();
  const pct = Math.max(0, Math.min(100, value <= 1 ? value * 100 : value));
  return (
    <View
      style={[
        styles.track,
        { height, borderRadius: 99, backgroundColor: track ?? colors.surfaceMuted },
      ]}>
      <View
        style={{
          height: '100%',
          borderRadius: 99,
          width: `${pct}%`,
          backgroundColor: color ?? colors.green,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: { overflow: 'hidden', width: '100%' },
});
