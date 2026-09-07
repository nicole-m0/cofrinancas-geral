import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { useTheme } from '@/data/theme';

export type ToggleProps = {
  value: boolean;
  onValueChange: (value: boolean) => void;
  size?: 'md' | 'sm';
};

export function Toggle({ value, onValueChange, size = 'md' }: ToggleProps) {
  const { colors } = useTheme();
  const dims = size === 'md' ? { w: 48, h: 28, knob: 22 } : { w: 38, h: 22, knob: 17 };

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      onPress={() => onValueChange(!value)}
      style={[
        styles.track,
        {
          width: dims.w,
          height: dims.h,
          borderRadius: 99,
          backgroundColor: value ? colors.toggleOn : colors.toggleOff,
          justifyContent: value ? 'flex-end' : 'flex-start',
        },
      ]}>
      <View
        style={{
          width: dims.knob,
          height: dims.knob,
          borderRadius: dims.knob / 2,
          backgroundColor: colors.white,
        }}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: {
    padding: 3,
    flexDirection: 'row',
  },
});
