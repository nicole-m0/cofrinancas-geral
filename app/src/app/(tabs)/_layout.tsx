import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Tabs } from 'expo-router/js-tabs';
import { useRouter } from 'expo-router';

import { CustomTabBar } from '@/components/CustomTabBar';
import { SheetModal } from '@/components/SheetModal';
import { Text } from '@/components/Text';
import { IconTile } from '@/components/IconTile';
import { Icon } from '@/icons';
import { useTheme, type ThemeColors } from '@/data/theme';

export default function TabsLayout() {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const [sheetOpen, setSheetOpen] = useState(false);

  const go = (path: '/nova-despesa' | '/nova-receita') => {
    setSheetOpen(false);
    router.push(path);
  };

  return (
    <>
      <Tabs
        screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: colors.screen } }}
        tabBar={(props) => <CustomTabBar {...props} onFabPress={() => setSheetOpen(true)} />}>
        <Tabs.Screen name="index" options={{ title: 'Painel' }} />
        <Tabs.Screen name="transacoes" options={{ title: 'Transações' }} />
        <Tabs.Screen name="metas" options={{ title: 'Metas' }} />
        <Tabs.Screen name="perfil" options={{ title: 'Perfil' }} />
      </Tabs>

      <SheetModal visible={sheetOpen} onClose={() => setSheetOpen(false)} title="Novo lançamento">
        <Pressable style={styles.action} onPress={() => go('/nova-despesa')}>
          <IconTile icon="down" color={colors.rust} tint={colors.rustTint} size={44} rounded={15} />
          <View style={styles.actionText}>
            <Text weight="bold" style={styles.actionTitle}>
              Nova despesa
            </Text>
            <Text weight="medium" color={colors.textMuted} style={styles.actionSub}>
              Registrar um gasto avulso ou recorrente
            </Text>
          </View>
          <Icon name="chev" size={18} color={colors.textFaint} />
        </Pressable>

        <Pressable style={styles.action} onPress={() => go('/nova-receita')}>
          <IconTile icon="up" color={colors.green} tint={colors.greenTint} size={44} rounded={15} />
          <View style={styles.actionText}>
            <Text weight="bold" style={styles.actionTitle}>
              Nova receita
            </Text>
            <Text weight="medium" color={colors.textMuted} style={styles.actionSub}>
              Entrada avulsa ou recorrente
            </Text>
          </View>
          <Icon name="chev" size={18} color={colors.textFaint} />
        </Pressable>
      </SheetModal>
    </>
  );
}

const makeStyles = (colors: ThemeColors) =>
  StyleSheet.create({
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.ring,
    borderRadius: 18,
    padding: 14,
  },
  actionText: { flex: 1 },
  actionTitle: { fontSize: 15 },
  actionSub: { fontSize: 12, marginTop: 2 },
});
