import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { colors, radius } from '@/theme';
import { Icon } from '@/icons';
import { brl } from '@/format';
import type { Balance } from '@/data/types';
import { Text } from './Text';

export type BalanceCardProps = {
  balance: Balance;
  hidden: boolean;
  onToggleHidden: () => void;
};

export function BalanceCard({ balance, hidden, onToggleHidden }: BalanceCardProps) {
  const flow = balance.income + balance.expense || 1;
  const incomeShare = (balance.income / flow) * 100;

  return (
    <Pressable onPress={onToggleHidden} style={styles.card}>
      <Text weight="bold" style={styles.kicker}>
        Saldo atual
      </Text>
      <Text weight="extrabold" style={styles.value}>
        {hidden ? 'R$ ••••••' : brl(balance.current)}
      </Text>

      <View style={styles.split}>
        <View style={styles.pill}>
          <View style={styles.pillHead}>
            <Icon name="up" size={14} color={colors.greenLight} />
            <Text weight="bold" color={colors.greenLight} style={styles.pillLabel}>
              Receitas
            </Text>
          </View>
          <Text weight="extrabold" style={styles.pillValue}>
            {hidden ? '••••' : brl(balance.income)}
          </Text>
        </View>

        <View style={styles.pill}>
          <View style={styles.pillHead}>
            <Icon name="down" size={14} color={colors.rustSoft} />
            <Text weight="bold" color={colors.rustSoft} style={styles.pillLabel}>
              Despesas
            </Text>
          </View>
          <Text weight="extrabold" style={styles.pillValue}>
            {hidden ? '••••' : brl(balance.expense)}
          </Text>
        </View>
      </View>

      <View style={styles.track}>
        <View style={{ width: `${incomeShare}%`, backgroundColor: colors.greenBright }} />
        <View style={{ width: `${100 - incomeShare}%`, backgroundColor: colors.rustBright }} />
      </View>
      <Text weight="medium" style={styles.caption}>
        Você guardou {balance.savedPct}% das receitas do mês
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.black, borderRadius: radius.xl, padding: 22 },
  kicker: {
    fontSize: 12,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.62)',
  },
  value: { fontSize: 40, color: colors.white, letterSpacing: -1.4, marginTop: 8 },
  split: { flexDirection: 'row', gap: 10, marginTop: 18 },
  pill: { flex: 1, backgroundColor: 'rgba(255,255,255,0.09)', borderRadius: 16, padding: 13 },
  pillHead: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  pillLabel: { fontSize: 12 },
  pillValue: { fontSize: 17, color: colors.white, marginTop: 6 },
  track: {
    flexDirection: 'row',
    height: 8,
    borderRadius: 99,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.14)',
    marginTop: 14,
  },
  caption: { fontSize: 12, color: 'rgba(255,255,255,0.62)', marginTop: 8 },
});
