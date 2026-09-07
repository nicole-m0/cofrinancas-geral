import React from 'react';
import { Text as RNText, type TextProps as RNTextProps, StyleSheet } from 'react-native';

import { font } from '@/theme';
import { useTheme } from '@/data/theme';

type Weight = keyof typeof font;

export type TextProps = RNTextProps & {
  weight?: Weight;
  color?: string;
};

/**
 * App-wide Text: applies the Manrope family for the given weight.
 * Use this instead of react-native's <Text>.
 */
export function Text({ weight = 'regular', color, style, ...rest }: TextProps) {
  const { colors } = useTheme();
  return (
    <RNText {...rest} style={[{ fontFamily: font[weight], color: color ?? colors.ink }, style]} />
  );
}

export const textStyles = StyleSheet.create({
  screenTitle: { fontSize: 26, letterSpacing: -0.6 },
  sectionTitle: { fontSize: 15, letterSpacing: -0.15 },
  label: { fontSize: 12, letterSpacing: 0.6, textTransform: 'uppercase' },
});
