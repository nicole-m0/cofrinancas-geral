import React from 'react';
import { StyleSheet, View, type ViewProps, type ViewStyle } from 'react-native';

import { colors, radius } from '@/theme';

export type CardProps = ViewProps & {
  padding?: number;
  radius?: number;
  ring?: string;
  background?: string;
  style?: ViewStyle | ViewStyle[];
};

export function Card({
  padding = 18,
  radius: r = radius.lg,
  ring = colors.ring,
  background = colors.card,
  style,
  children,
  ...rest
}: CardProps) {
  return (
    <View
      {...rest}
      style={[
        styles.base,
        { padding, borderRadius: r, backgroundColor: background, borderColor: ring },
        style,
      ]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderWidth: 1,
  },
});
