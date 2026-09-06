import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppHeader, Card, MiniBarChart, ProgressBar, Screen, SegmentedControl, StatTile, Text } from '@/components';
import { Icon } from '@/icons';
import { useFinance } from '@/data/store';
import { months, reportStats } from '@/data/mock';
import { brlShort } from '@/format';
import { colors } from '@/theme';

const PERIODS = ['3 meses', '6 meses', 'Ano', 'Custom'] as const;
type Period = (typeof PERIODS)[number];

export default function RelatoriosScreen() {
  const { categorySpend } = useFinance();
  const [period, setPeriod] = useState<Period>('6 meses');

  const data = period === '3 meses' ? months.slice(-3) : months;

  return (
    <Screen>
      <AppHeader />

      <View style={styles.intro}>
        <Text weight="extrabold" style={styles.title}>
          Relatórios
        </Text>
        <Text weight="medium" color={colors.textMuted} style={styles.sub}>
          {reportStats.rangeLabel} · período customizável
        </Text>
      </View>

      <SegmentedControl options={PERIODS} value={period} onChange={setPeriod} />

      <Card>
        <View style={styles.chartHead}>
          <View>
            <Text weight="extrabold" style={styles.cardTitle}>
              Evolução mensal
            </Text>
            <Text weight="medium" color={colors.textMuted} style={styles.cardSub}>
              Receitas x despesas
            </Text>
          </View>
          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: colors.green }]} />
              <Text weight="bold" color={colors.textSecondary} style={styles.legendText}>
                Receitas
              </Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: colors.rustBright }]} />
              <Text weight="bold" color={colors.textSecondary} style={styles.legendText}>
                Despesas
              </Text>
            </View>
          </View>
        </View>
        <MiniBarChart data={data} />
      </Card>

      <View style={styles.statsRow}>
        <StatTile
          label="Média/mês"
          value={brlShort(reportStats.avgPerMonth)}
          delta={reportStats.avgDeltaLabel}
          deltaDir="down"
        />
        <StatTile
          label="Taxa poupança"
          value={`${reportStats.savingsRate}%`}
          delta={reportStats.savingsRateDeltaLabel}
          deltaDir="up"
        />
      </View>

      <Card>
        <Text weight="extrabold" style={[styles.cardTitle, styles.distTitle]}>
          Distribuição por categoria
        </Text>
        <View style={styles.dist}>
          {categorySpend.map((c) => (
            <View key={c.name}>
              <View style={styles.distHead}>
                <Text weight="bold" style={styles.distName}>
                  {c.name}
                </Text>
                <Text weight="bold" color={colors.textSecondary} style={styles.distValue}>
                  {brlShort(c.amount)} · {c.pct}%
                </Text>
              </View>
              <ProgressBar value={c.pct} color={c.color} height={9} />
            </View>
          ))}
        </View>
      </Card>

      <View style={styles.compareCard}>
        <Icon name="chart" size={20} color={colors.textSecondary} />
        <Text weight="medium" color={colors.textSecondary} style={styles.compareText}>
          Comparar{' '}
          <Text weight="bold" style={styles.compareStrong}>
            setembro x agosto
          </Text>{' '}
          lado a lado
        </Text>
        <Icon name="chev" size={17} color={colors.textFaint} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: { gap: 2 },
  title: { fontSize: 26, letterSpacing: -0.6 },
  sub: { fontSize: 13 },

  chartHead: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  cardTitle: { fontSize: 15 },
  cardSub: { fontSize: 12, marginTop: 2 },
  legend: { flexDirection: 'row', gap: 12, paddingTop: 4 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  legendDot: { width: 8, height: 8, borderRadius: 3 },
  legendText: { fontSize: 11 },

  statsRow: { flexDirection: 'row', gap: 10 },

  distTitle: { marginBottom: 14 },
  dist: { gap: 13 },
  distHead: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 6 },
  distName: { fontSize: 13 },
  distValue: { fontSize: 12.5 },

  compareCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1,
    borderColor: colors.ringSoft,
    borderRadius: 20,
    padding: 16,
  },
  compareText: { flex: 1, fontSize: 12.5, lineHeight: 18 },
  compareStrong: { fontSize: 12.5 },
});
