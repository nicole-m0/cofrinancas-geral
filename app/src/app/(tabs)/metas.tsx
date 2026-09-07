import { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { Card, IconTile, ProgressBar, Screen, Text } from '@/components';
import { Icon } from '@/icons';
import { useFinance } from '@/data/store';
import { goalPct, goalRight, goalTargetLabel } from '@/data/goals';
import { brlShort } from '@/format';
import { useTheme, type ThemeColors } from '@/data/theme';

export default function MetasScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const { goals, goalsDone } = useFinance();

  return (
    <Screen withTabBar>
      <View style={styles.titleRow}>
        <View>
          <Text weight="extrabold" style={styles.title}>
            Metas
          </Text>
          <Text weight="medium" color={colors.textMuted} style={styles.sub}>
            {goals.length} ativas · {goalsDone.length} concluídas
          </Text>
        </View>
        <Pressable style={styles.newBtn} onPress={() => router.push('/criar-meta')}>
          <Icon name="plus" size={15} color={colors.screen} />
          <Text weight="extrabold" color={colors.screen} style={styles.newBtnText}>
            Nova
          </Text>
        </Pressable>
      </View>

      {goals.map((g) => (
        <Pressable key={g.id} onPress={() => router.push(`/meta/${g.id}`)}>
          <Card>
            <View style={styles.cardTop}>
              <View style={styles.flex}>
                <View style={styles.typeTag}>
                  <Text weight="extrabold" color={colors.textSecondary} style={styles.typeTagText}>
                    {g.type}
                  </Text>
                </View>
                <Text weight="extrabold" style={styles.goalTitle}>
                  {g.title}
                </Text>
              </View>
              <Icon name="chev" size={18} color={colors.textFaint} />
            </View>

            <View style={styles.barWrap}>
              <ProgressBar value={goalPct(g)} color={g.color} height={10} />
            </View>

            <View style={styles.metaRow}>
              <Text weight="extrabold" style={styles.cur}>
                {brlShort(g.current)}{' '}
                <Text weight="medium" color={colors.textMuted} style={styles.tgt}>
                  {goalTargetLabel(g)}
                </Text>
              </Text>
              <Text weight="bold" color={colors.textMuted} style={styles.right}>
                {goalRight(g)}
              </Text>
            </View>
          </Card>
        </Pressable>
      ))}

      <Text weight="extrabold" color={colors.textMuted} style={styles.doneLabel}>
        CONCLUÍDAS
      </Text>

      {goalsDone.map((g) => (
        <View key={g.id} style={styles.doneCard}>
          <IconTile icon="check" color={colors.green} tint={colors.greenTint} size={38} rounded={13} />
          <View style={styles.flex}>
            <Text weight="bold" style={styles.doneTitle}>
              {g.title}
            </Text>
            <Text weight="medium" color={colors.textMuted} style={styles.doneSub}>
              {g.type} · {g.doneLabel ?? goalTargetLabel(g)}
            </Text>
          </View>
          <Text weight="extrabold" color={colors.green} style={styles.doneValue}>
            {brlShort(g.current)}
          </Text>
        </View>
      ))}
    </Screen>
  );
}

const makeStyles = (colors: ThemeColors) =>
  StyleSheet.create({
  titleRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 4 },
  title: { fontSize: 26, letterSpacing: -0.6 },
  sub: { fontSize: 13, marginTop: 2 },
  newBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.ink,
    borderRadius: 14,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  newBtnText: { fontSize: 13 },

  cardTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  flex: { flex: 1, minWidth: 0 },
  typeTag: {
    alignSelf: 'flex-start',
    backgroundColor: colors.surfaceMuted,
    borderRadius: 8,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  typeTagText: { fontSize: 11, letterSpacing: 0.3 },
  goalTitle: { fontSize: 16.5, letterSpacing: -0.2, marginTop: 9 },
  barWrap: { marginTop: 14 },
  metaRow: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginTop: 10 },
  cur: { fontSize: 15 },
  tgt: { fontSize: 12.5 },
  right: { fontSize: 12 },

  doneLabel: { fontSize: 12, letterSpacing: 1, marginTop: 8 },
  doneCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1,
    borderColor: colors.ringSoft,
    borderRadius: 20,
    padding: 16,
  },
  doneTitle: { fontSize: 14.5 },
  doneSub: { fontSize: 12, marginTop: 2 },
  doneValue: { fontSize: 14 },
});
