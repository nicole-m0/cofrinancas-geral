import { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, Card, IconTile, RingProgress, SheetModal, StatTile, Text } from '@/components';
import { Icon } from '@/icons';
import { useFinance } from '@/data/store';
import { useTheme, type ThemeColors } from '@/data/theme';
import { goalAcceptsContribution, goalPct } from '@/data/goals';
import { brl, brlShort, parseAmount } from '@/format';

export default function MetaDetalheScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const { getGoal, contributeToGoal } = useFinance();

  const goal = getGoal(id);
  const [sheet, setSheet] = useState(false);
  const [amountStr, setAmountStr] = useState('500,00');

  if (!goal) {
    return (
      <SafeAreaView style={styles.notFound}>
        <Text weight="bold">Meta não encontrada.</Text>
        <Button label="Voltar" onPress={() => router.back()} style={{ marginTop: 16 }} />
      </SafeAreaView>
    );
  }

  const pct = goalPct(goal);
  const savings = goalAcceptsContribution(goal);
  const remaining = Math.max(0, goal.target - goal.current);
  const history = goal.history ?? [];

  const registerContribution = () => {
    const value = parseAmount(amountStr);
    if (value > 0) contributeToGoal(goal.id, value);
    setSheet(false);
  };

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <SafeAreaView edges={['top']} style={styles.headerDark}>
          <View style={styles.headerActions}>
            <Pressable style={styles.headerChip} onPress={() => router.back()}>
              <Icon name="back" size={19} color={colors.white} />
            </Pressable>
            <Pressable
              style={styles.headerChip}
              onPress={() => Alert.alert('Editar meta', 'Edição de meta (protótipo).')}>
              <Icon name="pencil" size={18} color={colors.white} />
            </Pressable>
          </View>

          <View style={styles.typeTag}>
            <Text weight="extrabold" color="rgba(255,255,255,0.82)" style={styles.typeTagText}>
              {goal.type}
            </Text>
          </View>
          <Text weight="extrabold" color={colors.white} style={styles.title}>
            {goal.title}
          </Text>

          <View style={styles.gaugeRow}>
            <RingProgress
              size={112}
              strokeWidth={11}
              progress={pct / 100}
              color={colors.greenBright}
              track="rgba(255,255,255,0.16)">
              <View style={styles.gaugeInner}>
                <Text weight="extrabold" color={colors.white} style={styles.gaugePct}>
                  {pct}%
                </Text>
              </View>
            </RingProgress>
            <View style={styles.flex}>
              <Text weight="bold" color="rgba(255,255,255,0.6)" style={styles.savedLabel}>
                {savings ? 'GUARDADO' : 'ACUMULADO'}
              </Text>
              <Text weight="extrabold" color={colors.white} style={styles.savedValue}>
                {brlShort(goal.current)}
              </Text>
              <Text weight="medium" color="rgba(255,255,255,0.66)" style={styles.savedSub}>
                de {brlShort(goal.target)}
                {goal.deadlineLabel ? ` · ${goal.deadlineLabel}` : ''}
              </Text>
            </View>
          </View>
        </SafeAreaView>

        <View style={styles.body}>
          {goal.projection ? (
            <View style={styles.projection}>
              <View style={styles.projectionHead}>
                <Icon name="up" size={17} color={colors.greenDark} />
                <Text weight="extrabold" color={colors.greenDark} style={styles.projectionTitle}>
                  {goal.projectionTitle ?? 'Projeção'}
                </Text>
              </View>
              <Text weight="medium" color={colors.greenInk} style={styles.projectionBody}>
                {goal.projection}
              </Text>
            </View>
          ) : null}

          <View style={styles.stats}>
            {savings ? (
              <>
                <StatTile label="Faltam" value={brlShort(remaining)} />
                <StatTile label="Por mês" value={brlShort(goal.monthly ?? remaining / 4)} />
                <StatTile label="Prazo" value={goal.termLabel ?? '—'} />
              </>
            ) : (
              <>
                <StatTile label="Progresso" value={`${pct}%`} />
                <StatTile label="Alvo" value={brlShort(goal.target)} />
                <StatTile label="Período" value={goal.deadlineLabel ?? '—'} />
              </>
            )}
          </View>

          <Card>
            <View style={styles.historyHead}>
              <Text weight="extrabold" style={styles.historyTitle}>
                Histórico
              </Text>
              <Text weight="bold" color={colors.green} style={styles.seeAll}>
                Ver tudo
              </Text>
            </View>
            {history.length === 0 ? (
              <Text weight="medium" color={colors.textMuted} style={styles.emptyHistory}>
                Sem movimentações ainda.
              </Text>
            ) : (
              history.map((h, i) => (
                <View
                  key={h.id}
                  style={[styles.historyRow, i < history.length - 1 && styles.historyDivider]}>
                  <IconTile
                    icon="wallet"
                    color={colors.textSecondary}
                    tint={colors.surfaceRaised}
                    size={34}
                    rounded={12}
                  />
                  <View style={styles.flex}>
                    <Text weight="bold" style={styles.historyRowTitle}>
                      {h.title}
                    </Text>
                    <Text weight="medium" color={colors.textMuted} style={styles.historyRowMeta}>
                      {h.meta}
                    </Text>
                  </View>
                  <Text weight="extrabold" style={styles.historyAmount}>
                    {brl(h.amount, { sign: 'always' })}
                  </Text>
                </View>
              ))
            )}
          </Card>
        </View>
      </ScrollView>

      <SafeAreaView edges={['bottom']} style={styles.footer}>
        {savings ? (
          <>
            <Button
              label="Registrar aporte"
              variant="green"
              onPress={() => setSheet(true)}
              style={styles.footerBtn}
            />
            <Pressable
              style={styles.bellChip}
              onPress={() => Alert.alert('Lembrete', 'Lembrete de aporte (protótipo).')}>
              <Icon name="bell" size={21} color={colors.textSecondary} />
            </Pressable>
          </>
        ) : (
          <Button
            label="Editar meta"
            variant="ink"
            onPress={() => Alert.alert('Editar meta', 'Edição de meta (protótipo).')}
            style={styles.footerBtn}
          />
        )}
      </SafeAreaView>

      <SheetModal visible={sheet} onClose={() => setSheet(false)} title="Registrar aporte">
        <View style={styles.sheetAmount}>
          <Text weight="bold" color={colors.textMuted} style={styles.sheetCurrency}>
            R$
          </Text>
          <TextInput
            value={amountStr}
            onChangeText={setAmountStr}
            keyboardType="decimal-pad"
            placeholder="0,00"
            placeholderTextColor={colors.textFaint}
            style={styles.sheetInput}
          />
        </View>
        <Button label="Confirmar aporte" variant="green" onPress={registerContribution} />
      </SheetModal>
    </View>
  );
}

const makeStyles = (colors: ThemeColors) =>
  StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.screen },
  scroll: { paddingBottom: 20 },
  notFound: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },

  headerDark: { backgroundColor: colors.black, paddingHorizontal: 20, paddingBottom: 26, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  headerActions: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 6 },
  headerChip: { width: 38, height: 38, borderRadius: 13, backgroundColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center' },
  typeTag: { alignSelf: 'flex-start', marginTop: 18, backgroundColor: 'rgba(255,255,255,0.14)', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  typeTagText: { fontSize: 11, letterSpacing: 0.4 },
  title: { fontSize: 26, letterSpacing: -0.6, marginTop: 10 },
  gaugeRow: { flexDirection: 'row', alignItems: 'center', gap: 22, marginTop: 20 },
  gaugeInner: { width: 84, height: 84, borderRadius: 42, backgroundColor: colors.black, alignItems: 'center', justifyContent: 'center' },
  gaugePct: { fontSize: 24, letterSpacing: -0.5 },
  flex: { flex: 1, minWidth: 0 },
  savedLabel: { fontSize: 12, letterSpacing: 0.8 },
  savedValue: { fontSize: 28, letterSpacing: -0.8, marginTop: 2 },
  savedSub: { fontSize: 13, marginTop: 4 },

  body: { padding: 20, gap: 12 },
  projection: { backgroundColor: colors.greenTint, borderRadius: 22, borderWidth: 1, borderColor: colors.greenTintBorder, padding: 17 },
  projectionHead: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  projectionTitle: { fontSize: 13 },
  projectionBody: { fontSize: 12.5, lineHeight: 19, marginTop: 8 },

  stats: { flexDirection: 'row', gap: 10 },

  historyHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },
  historyTitle: { fontSize: 15 },
  seeAll: { fontSize: 12 },
  emptyHistory: { fontSize: 13, paddingVertical: 14 },
  historyRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 13 },
  historyDivider: { borderBottomWidth: 1, borderBottomColor: colors.divider },
  historyRowTitle: { fontSize: 13.5 },
  historyRowMeta: { fontSize: 12, marginTop: 2 },
  historyAmount: { fontSize: 13.5 },

  footer: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 20,
    paddingTop: 14,
    backgroundColor: colors.screen,
    borderTopWidth: 1,
    borderTopColor: colors.ringSoft,
  },
  footerBtn: { flex: 1 },
  bellChip: {
    width: 56,
    borderRadius: 18,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.ringStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },

  sheetAmount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.ring,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  sheetCurrency: { fontSize: 14 },
  sheetInput: { flex: 1, fontSize: 24, fontFamily: 'Manrope_800ExtraBold', color: colors.ink, padding: 0 },
});
