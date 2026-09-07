import React from 'react';
import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/data/theme';
import { Icon, type IconName } from '@/icons';

export type IconTileProps = {
  icon: IconName;
  color: string;
  tint: string;
  size?: number;
  iconSize?: number;
  rounded?: number;
};

export function IconTile({ icon, color, tint, size = 40, iconSize, rounded = 14 }: IconTileProps) {
  const { scheme } = useTheme();
  // No escuro, os "tints" claros do design não funcionam sobre o card escuro —
  // usa a própria cor da categoria com opacidade baixa.
  const bg = scheme === 'dark' ? `${color}2E` : tint;

  return (
    <View
      style={[
        styles.tile,
        { width: size, height: size, borderRadius: rounded, backgroundColor: bg },
      ]}>
      <Icon name={icon} size={iconSize ?? Math.round(size * 0.5)} color={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
});
