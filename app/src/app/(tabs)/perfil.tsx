import { Alert, Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import { Card, Screen, Text, Toggle } from '@/components';
import { Icon } from '@/icons';
import { useFinance } from '@/data/store';
import { profile } from '@/data/mock';
import { brl } from '@/format';
import { colors } from '@/theme';
import type { NotificationPrefs } from '@/data/types';

const NOTIF_ROWS: { key: keyof NotificationPrefs; title: string; sub: string }[] = [
  { key: 'dueBill', title: 'Conta a vencer', sub: 'Aviso 2 dias antes' },
  { key: 'goalLimit80', title: 'Limite de meta em 80%', sub: 'Alerta de estouro' },
  { key: 'weeklyDigest', title: 'Resumo semanal', sub: 'Domingo, 20h' },
];

export default function PerfilScreen() {
  const router = useRouter();
  const { notifications, toggleNotification, recurring, toggleRecurring } = useFinance();

  return (
    <Screen withTabBar>
      <Text weight="extrabold" style={styles.title}>
        Perfil
      </Text>

      <Card style={styles.userCard}>
        <View style={styles.avatar}>
          <Text weight="extrabold" color={colors.white} style={styles.avatarText}>
            {profile.initials}
          </Text>
        </View>
        <View style={styles.flex}>
          <Text weight="extrabold" style={styles.name}>
            {profile.name}
          </Text>
          <Text weight="medium" color={colors.textMuted} style={styles.email}>
            {profile.email}
          </Text>
        </View>
        <Icon name="chev" size={18} color={colors.textFaint} />
      </Card>

      <Card>
        <Text weight="extrabold" color={colors.textMuted} style={styles.cardLabel}>
          NOTIFICAÇÕES
        </Text>
        <View style={styles.rows}>
          {NOTIF_ROWS.map((r) => (
            <View key={r.key} style={styles.settingRow}>
              <View style={styles.flex}>
                <Text weight="bold" style={styles.settingTitle}>
                  {r.title}
                </Text>
                <Text weight="medium" color={colors.textMuted} style={styles.settingSub}>
                  {r.sub}
                </Text>
              </View>
              <Toggle value={notifications[r.key]} onValueChange={() => toggleNotification(r.key)} />
            </View>
          ))}
        </View>
      </Card>

      <Card>
        <View style={styles.cardHead}>
          <Text weight="extrabold" color={colors.textMuted} style={styles.cardLabel}>
            RECORRENTES ATIVAS
          </Text>
          <Text weight="bold" color={colors.green} style={styles.manage}>
            Gerenciar
          </Text>
        </View>
        <View>
          {recurring.map((r, i) => (
            <View
              key={r.id}
              style={[styles.recRow, i < recurring.length - 1 && styles.recDivider]}>
              <View style={styles.flex}>
                <Text weight="bold" style={styles.settingTitle}>
                  {r.name}
                </Text>
                <Text weight="medium" color={colors.textMuted} style={styles.settingSub}>
                  {r.sub}
                </Text>
              </View>
              <Text weight="extrabold" style={styles.recAmount}>
                {brl(r.amount)}
              </Text>
              <Toggle value={r.active} onValueChange={() => toggleRecurring(r.id)} size="sm" />
            </View>
          ))}
        </View>
      </Card>

      <Card padding={0} style={styles.linksCard}>
        <Pressable style={[styles.linkRow, styles.recDivider]} onPress={() => router.push('/categorias')}>
          <Icon name="list" size={19} color={colors.textSecondary} />
          <Text weight="bold" style={[styles.flex, styles.linkText]}>
            Categorias
          </Text>
          <Icon name="chev" size={17} color={colors.textFaint} />
        </Pressable>
        <Pressable style={[styles.linkRow, styles.recDivider]} onPress={() => router.push('/relatorios')}>
          <Icon name="chart" size={19} color={colors.textSecondary} />
          <Text weight="bold" style={[styles.flex, styles.linkText]}>
            Relatórios e exportação
          </Text>
          <Icon name="chev" size={17} color={colors.textFaint} />
        </Pressable>
        <View style={styles.linkRow}>
          <Icon name="wallet" size={19} color={colors.textSecondary} />
          <Text weight="bold" style={[styles.flex, styles.linkText]}>
            Contas e moeda
          </Text>
          <Text weight="bold" color={colors.textMuted} style={styles.brl}>
            BRL
          </Text>
          <Icon name="chev" size={17} color={colors.textFaint} />
        </View>
      </Card>

      <Pressable
        onPress={() => Alert.alert('Sair da conta', 'Isto encerraria a sessão (protótipo).')}
        hitSlop={8}>
        <Text weight="bold" color={colors.rust} style={styles.logout}>
          Sair da conta
        </Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 26, letterSpacing: -0.6, marginTop: 4 },

  userCard: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 20,
    backgroundColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 20 },
  flex: { flex: 1, minWidth: 0 },
  name: { fontSize: 17, letterSpacing: -0.2 },
  email: { fontSize: 12.5, marginTop: 2 },

  cardLabel: { fontSize: 12, letterSpacing: 0.8 },
  cardHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  manage: { fontSize: 12 },
  rows: { gap: 16, marginTop: 14 },
  settingRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  settingTitle: { fontSize: 14 },
  settingSub: { fontSize: 12, marginTop: 2 },

  recRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 13 },
  recDivider: { borderBottomWidth: 1, borderBottomColor: colors.surfaceRaised },
  recAmount: { fontSize: 13.5 },

  linksCard: { paddingHorizontal: 18 },
  linkRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 15 },
  linkText: { fontSize: 14 },
  brl: { fontSize: 12.5 },

  logout: { fontSize: 12.5, textAlign: 'center', paddingVertical: 6 },
});
