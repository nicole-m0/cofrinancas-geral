import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { Card } from './Card';
import { colors } from '@/theme';
import { Text } from './Text';

export type AmountDisplayProps = {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  tone: 'expense' | 'income';
};

export function AmountDisplay({ label, value, onChangeText, tone }: AmountDisplayProps) {
  const tint = tone === 'income' ? colors.green : colors.rust;

  return (
    <Card padding={22} style={styles.card}>
      <Text weight="bold" color={colors.textMuted} style={styles.label}>
        {label}
      </Text>
      <View style={styles.row}>
        <Text weight="bold" color={tint} style={styles.currency}>
          R$
        </Text>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          keyboardType="decimal-pad"
          placeholder="0,00"
          placeholderTextColor={tone === 'income' ? '#7FBBA5' : '#DDB0A2'}
          selectionColor={tint}
          style={[styles.input, { color: tint }]}
        />
        <View style={[styles.caret, { backgroundColor: tint }]} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { alignItems: 'center' },
  label: { fontSize: 12, letterSpacing: 1, textTransform: 'uppercase' },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 10 },
  currency: { fontSize: 20 },
  input: {
    fontFamily: 'Manrope_800ExtraBold',
    fontSize: 44,
    letterSpacing: -1.5,
    padding: 0,
    minWidth: 40,
    textAlign: 'center',
  },
  caret: { width: 2, height: 38, borderRadius: 2 },
});
