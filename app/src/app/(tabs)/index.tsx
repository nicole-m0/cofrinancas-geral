import { Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import {
  BalanceCard,
  Card,
  IconTile,
  ProgressBar,
  Screen,
  SegmentedControl,
  Text,
} from '@/components';
import { DonutChart } from '@/components/DonutChart';
import { Icon } from '@/icons';
import { useFinance } from '@/data/store';
import { profile, upcoming } from '@/data/mock';
import { brl, brlShort } from '@/format';
import { colors } from '@/theme';

export default function PainelScreen() {
  const router = useRouter();
  const {
    balance,
    categorySpend,
    chartStyle,
    setChartStyle,
    balanceHidden,
    toggleBalanceHidden,
    goals,
  } = useFinance();

  const spendTotal = categorySpend.reduce((s, c) => s + c.amount, 0);
  const activeGoals = goals.slice(0, 3);

  return (
    <Screen withTabBar>
      <View style={styles.headerRow}>
        <View>
          <Text weight="semibold" color={colors.textMuted} style={styles.month}>
            {profile.monthLabel}
          </Text>
          <Text weight="extrabold" style={styles.greeting}>
            Olá, {profile.firstName}
          </Text>
        </View>
        <View style={styles.headerActions}>
          <View style={styles.iconChip}>
            <Icon name="bell" size={20} color={colors.ink} />
          </View>
          <View style={styles.avatar}>
            <Text weight="extrabold" color={colors.white} style={styles.avatarText}>
              {profile.initials}
            </Text>
          </View>
        </View>
      </View>

      <BalanceCard balance={balance} hidden={balanceHidden} onToggleHidden={toggleBalanceHidden} />

      <Card>
        <View style={styles.cardHead}>
          <Text weight="extrabold" style={styles.cardTitle}>
            Gastos por categoria
          </Text>
          <View style={styles.chartToggle}>
            <SegmentedControl
              options={['Donut', 'Barras'] as const}
              value={chartStyle === 'donut' ? 'Donut' : 'Barras'}
              onChange={(v) => setChartStyle(v === 'Donut' ? 'donut' : 'bars')}
            />
          </View>
        </View>

        {chartStyle === 'donut' ? (
          <View style={styles.donutRow}>
            <DonutChart
              size={104}
              strokeWidth={17}
              segments={categorySpend.map((c) => ({ pct: c.pct, color: c.color }))}>
              <Text weight="bold" color={colors.textMuted} style={styles.donutKicker}>
                TOTAL
              </Text>
              <Text weight="extrabold" style={styles.donutValue}>
                {brlShort(spendTotal)}
              </Text>
            </DonutChart>
            <View style={styles.legend}>
              {categorySpend.map((c) => (
                <View key={c.name} style={styles.legendRow}>
                  <View style={[styles.dot, { backgroundColor: c.color }]} />
                  <Text weight="medium" color={colors.inkSoft} style={styles.legendName}>
                    {c.name}
                  </Text>
                  <Text weight="bold" style={styles.legendValue}>
                    {brlShort(c.amount)}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        ) : (
          <View style={styles.bars}>
            {categorySpend.map((c) => (
              <View key={c.name}>
                <View style={styles.barHead}>
                  <Text weight="medium" color={colors.inkSoft} style={styles.legendName}>
                    {c.name}
                  </Text>
                  <Text weight="bold" style={styles.legendValue}>
                    {brlShort(c.amount)}
                  </Text>
                </View>
                <ProgressBar value={c.pct} color={c.color} />
              </View>
            ))}
          </View>
        )}
      </Card>

      <Card>
        <View style={styles.cardHead}>
          <Text weight="extrabold" style={styles.cardTitle}>
            A vencer
          </Text>
          <Text weight="bold" color={colors.textMuted} style={styles.cardHint}>
            próximos 10 dias
          </Text>
        </View>
        <View style={styles.list}>
          {upcoming.map((u) => (
            <View key={u.id} style={styles.upcomingRow}>
              <IconTile icon={u.icon} color={u.color} tint={u.tint} size={38} rounded={13} />
              <View style={styles.flex}>
                <Text weight="bold" style={styles.upcomingTitle}>
                  {u.title}
                </Text>
                <Text weight="medium" color={colors.textMuted} style={styles.upcomingMeta}>
                  {u.meta}
                </Text>
              </View>
              <Text weight="extrabold" style={styles.upcomingAmount}>
                {brl(u.amount, { sign: 'always' })}
              </Text>
            </View>
          ))}
        </View>
      </Card>

      <Card>
        <View style={styles.cardHead}>
          <Text weight="extrabold" style={styles.cardTitle}>
            Metas ativas
          </Text>
          <Pressable onPress={() => router.push('/metas')} hitSlop={8}>
            <Text weight="bold" color={colors.green} style={styles.cardHint}>
              {goals.length} metas
            </Text>
          </Pressable>
        </View>
        <View style={styles.list}>
          {activeGoals.map((g) => (
            <Pressable key={g.id} onPress={() => router.push(`/meta/${g.id}`)}>
              <View style={styles.goalHead}>
                <Text weight="bold" style={styles.goalTitle}>
                  {g.title}
                </Text>
                <Text weight="medium" color={colors.textMuted} style={styles.goalRight}>
                  {brlShort(g.current)} / {brlShort(g.target)}
                </Text>
              </View>
              <ProgressBar
                value={Math.min(100, Math.round((g.current / g.target) * 100))}
                color={g.color}
              />
            </Pressable>
          ))}
        </View>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 },
  month: { fontSize: 13 },
  greeting: { fontSize: 20, letterSpacing: -0.4 },
  headerActions: { flexDirection: 'row', gap: 8 },
  iconChip: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.ring,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 14 },

  cardHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  cardTitle: { fontSize: 15, letterSpacing: -0.15 },
  cardHint: { fontSize: 12 },
  chartToggle: { width: 132 },

  donutRow: { flexDirection: 'row', alignItems: 'center', gap: 18 },
  donutKicker: { fontSize: 10, letterSpacing: 0.6 },
  donutValue: { fontSize: 14 },
  legend: { flex: 1, gap: 9 },
  legendRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dot: { width: 8, height: 8, borderRadius: 3 },
  legendName: { flex: 1, fontSize: 13 },
  legendValue: { fontSize: 13 },

  bars: { gap: 12 },
  barHead: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },

  list: { gap: 14 },
  flex: { flex: 1, minWidth: 0 },
  upcomingRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  upcomingTitle: { fontSize: 14 },
  upcomingMeta: { fontSize: 12 },
  upcomingAmount: { fontSize: 14 },

  goalHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 7 },
  goalTitle: { fontSize: 13 },
  goalRight: { fontSize: 12 },
});
