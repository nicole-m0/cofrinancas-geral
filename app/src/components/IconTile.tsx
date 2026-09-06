import React from 'react';
import { StyleSheet, View } from 'react-native';

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
  return (
    <View
      style={[
        styles.tile,
        { width: size, height: size, borderRadius: rounded, backgroundColor: tint },
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
