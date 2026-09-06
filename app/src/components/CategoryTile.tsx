import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { colors, radius } from '@/theme';
import { Icon, type IconName } from '@/icons';
import { Text } from './Text';

export type CategoryTileProps = {
  name: string;
  icon: IconName;
  color: string;
  tint: string;
  selected?: boolean;
  onPress?: () => void;
};

export function CategoryTile({ name, icon, color, tint, selected = false, onPress }: CategoryTileProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.tile,
        {
          backgroundColor: selected ? colors.greenTint : colors.card,
          borderColor: selected ? colors.green : colors.ring,
          borderWidth: selected ? 2 : 1,
        },
      ]}>
      <View style={styles.icon}>
        <Icon name={icon} size={22} color={selected ? colors.green : color} />
      </View>
      <Text
        weight={selected ? 'extrabold' : 'bold'}
        color={selected ? colors.greenDark : colors.textSecondary}
        style={styles.label}
        numberOfLines={1}>
        {name}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    borderRadius: radius.md,
    paddingVertical: 12,
    paddingHorizontal: 4,
    alignItems: 'center',
  },
  icon: { alignItems: 'center', justifyContent: 'center' },
  label: { fontSize: 11, marginTop: 7 },
});
