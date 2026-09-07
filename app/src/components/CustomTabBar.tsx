import React, { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { BottomTabBarProps } from 'expo-router/js-tabs';

import { useTheme, type ThemeColors } from '@/data/theme';
import { Icon, type IconName } from '@/icons';
import { Text } from './Text';

const TAB_META: Record<string, { label: string; icon: IconName }> = {
  index: { label: 'Painel', icon: 'home' },
  transacoes: { label: 'Transações', icon: 'list' },
  metas: { label: 'Metas', icon: 'target' },
  perfil: { label: 'Perfil', icon: 'user' },
};

export type CustomTabBarProps = BottomTabBarProps & {
  onFabPress: () => void;
};

export function CustomTabBar({ state, navigation, onFabPress }: CustomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const routes = state.routes.filter((r) => TAB_META[r.name]);
  const left = routes.slice(0, 2);
  const right = routes.slice(2);

  const renderTab = (routeName: string, routeKey: string) => {
    const meta = TAB_META[routeName];
    const activeRoute = state.routes[state.index];
    const focused = activeRoute?.key === routeKey;
    const tint = focused ? colors.green : colors.textFaint;

    return (
      <Pressable
        key={routeKey}
        style={styles.tab}
        onPress={() => {
          const event = navigation.emit({ type: 'tabPress', target: routeKey, canPreventDefault: true });
          if (!focused && !event.defaultPrevented) navigation.navigate(routeName);
        }}>
        <Icon name={meta.icon} size={23} color={tint} />
        <Text weight={focused ? 'extrabold' : 'bold'} color={tint} style={styles.label}>
          {meta.label}
        </Text>
      </Pressable>
    );
  };

  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      {left.map((r) => renderTab(r.name, r.key))}

      <View style={styles.fabSlot}>
        <Pressable style={styles.fab} onPress={onFabPress} accessibilityLabel="Novo lançamento">
          <Icon name="plus" size={26} color={colors.white} />
        </Pressable>
      </View>

      {right.map((r) => renderTab(r.name, r.key))}
    </View>
  );
}

const makeStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    bar: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      backgroundColor: colors.screen,
      borderTopWidth: 1,
      borderTopColor: colors.ringSoft,
      paddingTop: 12,
      paddingHorizontal: 14,
    },
    tab: { flex: 1, alignItems: 'center', gap: 5 },
    label: { fontSize: 10.5 },
    fabSlot: { flex: 1, alignItems: 'center' },
    fab: {
      width: 58,
      height: 58,
      marginTop: -26,
      borderRadius: 22,
      backgroundColor: colors.green,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: colors.green,
      shadowOpacity: 0.5,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 12 },
      elevation: 8,
    },
  });
