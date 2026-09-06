import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { colors } from '@/theme';
import { Icon } from '@/icons';
import { Text } from './Text';

export type AppHeaderProps = {
  title?: string;
  onBack?: () => void;
  rightLabel?: string;
  onRightPress?: () => void;
  dark?: boolean;
};

export function AppHeader({ title, onBack, rightLabel, onRightPress, dark = false }: AppHeaderProps) {
  const router = useRouter();
  const back = onBack ?? (() => router.back());
  const fg = dark ? colors.white : colors.ink;
  const chipBg = dark ? 'rgba(255,255,255,0.12)' : colors.card;

  return (
    <View style={styles.row}>
      <Pressable
        onPress={back}
        style={[styles.chip, { backgroundColor: chipBg, borderColor: dark ? 'transparent' : colors.ring }]}>
        <Icon name="back" size={19} color={fg} />
      </Pressable>

      {title ? (
        <Text weight="extrabold" color={fg} style={styles.title}>
          {title}
        </Text>
      ) : (
        <View style={styles.flex} />
      )}

      {rightLabel ? (
        <Pressable onPress={onRightPress} hitSlop={8}>
          <Text weight="bold" color={dark ? 'rgba(255,255,255,0.7)' : colors.textMuted} style={styles.right}>
            {rightLabel}
          </Text>
        </Pressable>
      ) : (
        <View style={styles.rightSpacer} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 6 },
  chip: {
    width: 38,
    height: 38,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  title: { fontSize: 15, flex: 1, textAlign: 'center' },
  right: { fontSize: 13 },
  rightSpacer: { width: 38 },
  flex: { flex: 1 },
});
