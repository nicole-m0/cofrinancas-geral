import React from 'react';
import { StyleSheet, View } from 'react-native';

import { colors } from '@/theme';
import { Text } from './Text';

export type MiniBarPoint = { label: string; income: number; expense: number };

export type MiniBarChartProps = {
  data: MiniBarPoint[];
  height?: number;
  incomeColor?: string;
  expenseColor?: string;
};

/** Paired vertical bars per month (receitas × despesas), matching screen 09. */
export function MiniBarChart({
  data,
  height = 132,
  incomeColor = colors.green,
  expenseColor = colors.rustBright,
}: MiniBarChartProps) {
  const max = Math.max(1, ...data.flatMap((d) => [d.income, d.expense]));

  return (
    <View style={[styles.row, { height: height + 26 }]}>
      {data.map((d) => (
        <View key={d.label} style={styles.col}>
          <View style={[styles.bars, { height }]}>
            <View
              style={[
                styles.bar,
                { height: `${(d.income / max) * 100}%`, backgroundColor: incomeColor },
              ]}
            />
            <View
              style={[
                styles.bar,
                { height: `${(d.expense / max) * 100}%`, backgroundColor: expenseColor },
              ]}
            />
          </View>
          <Text weight="bold" color={colors.textMuted} style={styles.label}>
            {d.label}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 12, alignItems: 'flex-end' },
  col: { flex: 1, alignItems: 'center', gap: 8 },
  bars: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', gap: 4, width: '100%' },
  bar: { width: 11, borderTopLeftRadius: 5, borderTopRightRadius: 5, borderBottomLeftRadius: 2, borderBottomRightRadius: 2 },
  label: { fontSize: 11 },
});
