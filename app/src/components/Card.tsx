import React from 'react';
import { StyleSheet, View, type ViewProps, type ViewStyle } from 'react-native';

import { radius } from '@/theme';
import { useTheme } from '@/data/theme';

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
  ring,
  background,
  style,
  children,
  ...rest
}: CardProps) {
  const { colors } = useTheme();
  return (
    <View
      {...rest}
      style={[
        styles.base,
        {
          padding,
          borderRadius: r,
          backgroundColor: background ?? colors.card,
          borderColor: ring ?? colors.ring,
        },
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
