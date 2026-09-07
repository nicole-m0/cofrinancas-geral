import React, { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { radius } from '@/theme';
import { useTheme, type ThemeColors } from '@/data/theme';
import { Text } from './Text';

export type SegmentedControlProps<T extends string> = {
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
};

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: SegmentedControlProps<T>) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  return (
    <View style={styles.track}>
      {options.map((opt) => {
        const active = opt === value;
        return (
          <Pressable
            key={opt}
            onPress={() => onChange(opt)}
            style={[styles.segment, active && styles.segmentActive]}>
            <Text
              weight={active ? 'extrabold' : 'bold'}
              color={active ? colors.ink : colors.textMuted}
              style={styles.label}>
              {opt}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const makeStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    track: {
      flexDirection: 'row',
      padding: 4,
      backgroundColor: colors.surfaceMuted,
      borderRadius: radius.sm,
    },
    segment: {
      flex: 1,
      alignItems: 'center',
      paddingVertical: 10,
      borderRadius: 12,
    },
    segmentActive: {
      backgroundColor: colors.card,
      shadowColor: '#101413',
      shadowOpacity: 0.08,
      shadowRadius: 2,
      shadowOffset: { width: 0, height: 1 },
      elevation: 1,
    },
    label: { fontSize: 13 },
  });
