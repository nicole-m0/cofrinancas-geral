import React from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { useTheme } from '@/data/theme';
import { Text } from './Text';

export type FilterPillProps = {
  label: string;
  active?: boolean;
  onPress?: () => void;
};

export function FilterPill({ label, active = false, onPress }: FilterPillProps) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.pill,
        active
          ? { backgroundColor: colors.ink, borderColor: colors.ink }
          : { backgroundColor: colors.card, borderColor: colors.ringStrong },
      ]}>
      <Text
        weight={active ? 'extrabold' : 'bold'}
        color={active ? colors.screen : colors.textSecondary}
        style={styles.label}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
    borderWidth: 1,
  },
  label: { fontSize: 12.5 },
});
