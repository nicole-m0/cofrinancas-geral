import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { Card, FilterPill, IconTile, Screen, SheetModal, Text, Toggle } from '@/components';
import { Icon, type IconName } from '@/icons';
import { useFinance } from '@/data/store';
import { brl } from '@/format';
import { useTheme, type ThemeColors } from '@/data/theme';
import type { Transaction } from '@/data/types';

const FILTERS = ['Tudo', 'Despesas', 'Receitas', 'Recorrentes'] as const;
type Filter = (typeof FILTERS)[number];

export default function TransacoesScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const { groupedTransactions, categories, showTags, setShowTags } = useFinance();
  const [filter, setFilter] = useState<Filter>('Tudo');
  const [sheet, setSheet] = useState(false);

  const catMeta = useMemo(() => {
    const map = new Map<string, { icon: IconName; color: string; tint: string }>();
    for (const c of categories) map.set(c.name, { icon: c.icon, color: c.color, tint: c.tint });
    return map;
  }, [categories]);

  const match = (t: Transaction) => {
    if (filter === 'Despesas') return t.kind === 'expense';
    if (filter === 'Receitas') return t.kind === 'income';
    if (filter === 'Recorrentes') return t.recurring;
    return true;
  };

  const groups = groupedTransactions
    .map((g) => ({ ...g, items: g.items.filter(match) }))
    .filter((g) => g.items.length > 0)
    .map((g) => ({
      ...g,
      total: g.items.reduce((s, t) => s + (t.kind === 'expense' ? -t.amount : t.amount), 0),
    }));

  const count = groups.reduce((s, g) => s + g.items.length, 0);

  return (
    <Screen withTabBar>
      <View style={styles.titleRow}>
        <View>
          <Text weight="extrabold" style={styles.title}>
            Transações
          </Text>
          <Text weight="medium" color={colors.textMuted} style={styles.sub}>
            Setembro · {count} {count === 1 ? 'lançamento' : 'lançamentos'}
          </Text>
        </View>
        <Pressable style={styles.filterChip} onPress={() => setSheet(true)}>
          <Icon name="filter" size={20} color={colors.ink} />
        </Pressable>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.pills}>
        {FILTERS.map((f) => (
          <FilterPill key={f} label={f} active={f === filter} onPress={() => setFilter(f)} />
        ))}
      </ScrollView>

      <View style={styles.chips}>
        <View style={styles.chip}>
          <Icon name="cal" size={16} color={colors.textMuted} />
          <Text weight="bold" style={styles.chipText}>
            1–30 set
          </Text>
        </View>
        <View style={styles.chip}>
          <View style={[styles.chipDot, { backgroundColor: colors.green }]} />
          <Text weight="bold" style={[styles.chipText, styles.flex]}>
            Todas as categorias
          </Text>
        </View>
      </View>

      {groups.map((g) => (
        <View key={g.key} style={styles.group}>
          <View style={styles.groupHead}>
            <Text weight="extrabold" color={colors.textMuted} style={styles.groupDate}>
              {g.label.toUpperCase()}
            </Text>
            <Text weight="bold" color={colors.textSecondary} style={styles.groupTotal}>
              {brl(g.total, { sign: 'always' })}
            </Text>
          </View>
          <Card padding={0} style={styles.groupCard}>
            {g.items.map((t, i) => {
              const meta = catMeta.get(t.categoryName) ?? {
                icon: 'wallet' as IconName,
                color: colors.textSecondary,
                tint: colors.surfaceRaised,
              };
              return (
                <View
                  key={t.id}
                  style={[styles.txRow, i < g.items.length - 1 && styles.txDivider]}>
                  <IconTile icon={meta.icon} color={meta.color} tint={meta.tint} size={38} rounded={13} />
                  <View style={styles.flex}>
                    <Text weight="bold" style={styles.txTitle}>
                      {t.title}
                    </Text>
                    <View style={styles.txMetaRow}>
                      <Text weight="medium" color={colors.textMuted} style={styles.txMeta}>
                        {t.categoryName}
                        {t.recurring ? ' · mensal' : ''}
                      </Text>
                      {showTags && t.recurring ? (
                        <View style={styles.tag}>
                          <Text weight="extrabold" color={colors.greenDark} style={styles.tagText}>
                            RECORRENTE
                          </Text>
                        </View>
                      ) : null}
                    </View>
                  </View>
                  <Text weight="extrabold" style={styles.txAmount}>
                    {brl(t.kind === 'expense' ? -t.amount : t.amount, { sign: 'always' })}
                  </Text>
                </View>
              );
            })}
          </Card>
        </View>
      ))}

      <SheetModal visible={sheet} onClose={() => setSheet(false)} title="Filtros">
        <View style={styles.sheetRow}>
          <View style={styles.flex}>
            <Text weight="bold" style={styles.sheetTitle}>
              Mostrar etiqueta “Recorrente”
            </Text>
            <Text weight="medium" color={colors.textMuted} style={styles.sheetSub}>
              Destaca lançamentos que se repetem
            </Text>
          </View>
          <Toggle value={showTags} onValueChange={setShowTags} />
        </View>
      </SheetModal>
    </Screen>
  );
}

const makeStyles = (colors: ThemeColors) =>
  StyleSheet.create({
  titleRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 4 },
  title: { fontSize: 26, letterSpacing: -0.6 },
  sub: { fontSize: 13, marginTop: 2 },
  filterChip: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.ring,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pills: { gap: 8, paddingVertical: 2 },
  chips: { flexDirection: 'row', gap: 8 },
  chip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1,
    borderColor: colors.ringSoft,
    borderRadius: 14,
    paddingHorizontal: 13,
    paddingVertical: 11,
  },
  chipText: { fontSize: 12.5 },
  chipDot: { width: 8, height: 8, borderRadius: 3 },
  flex: { flex: 1, minWidth: 0 },

  group: { gap: 9 },
  groupHead: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' },
  groupDate: { fontSize: 12, letterSpacing: 0.6 },
  groupTotal: { fontSize: 12 },
  groupCard: { paddingHorizontal: 16 },
  txRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 13 },
  txDivider: { borderBottomWidth: 1, borderBottomColor: colors.surfaceRaised },
  txTitle: { fontSize: 14 },
  txMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: 3 },
  txMeta: { fontSize: 12 },
  txAmount: { fontSize: 14 },
  tag: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 6, backgroundColor: colors.greenTint },
  tagText: { fontSize: 10, letterSpacing: 0.3 },

  sheetRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 4 },
  sheetTitle: { fontSize: 14 },
  sheetSub: { fontSize: 12, marginTop: 2 },
});
