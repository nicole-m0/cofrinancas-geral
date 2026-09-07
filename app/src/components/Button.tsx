import React from 'react';
import { Pressable, StyleSheet, type ViewStyle } from 'react-native';

import { radius } from '@/theme';
import { useTheme } from '@/data/theme';
import { Text } from './Text';

export type ButtonProps = {
  label: string;
  onPress?: () => void;
  variant?: 'ink' | 'green';
  disabled?: boolean;
  style?: ViewStyle;
};

export function Button({ label, onPress, variant = 'ink', disabled = false, style }: ButtonProps) {
  const { colors } = useTheme();
  const bg = variant === 'green' ? colors.green : colors.ink;
  // texto do botão "ink" contrasta com o fundo nos dois temas
  const fg = variant === 'green' ? colors.white : colors.screen;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[styles.btn, { backgroundColor: bg, opacity: disabled ? 0.45 : 1 }, style]}>
      <Text weight="extrabold" color={fg} style={styles.label}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    borderRadius: radius.md - 2,
    paddingVertical: 17,
    alignItems: 'center',
  },
  label: { fontSize: 15, letterSpacing: -0.15 },
});
