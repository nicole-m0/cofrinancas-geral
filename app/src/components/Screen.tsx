import React from 'react';
import { ScrollView, StyleSheet, View, type ViewStyle } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

import { colors } from '@/theme';

const TAB_BAR_SPACE = 108;

export type ScreenProps = {
  children: React.ReactNode;
  scroll?: boolean;
  /** leave room for the floating tab bar at the bottom */
  withTabBar?: boolean;
  background?: string;
  edges?: readonly Edge[];
  contentStyle?: ViewStyle;
};

export function Screen({
  children,
  scroll = true,
  withTabBar = false,
  background = colors.screen,
  edges = ['top'],
  contentStyle,
}: ScreenProps) {
  const pad = { paddingBottom: withTabBar ? TAB_BAR_SPACE : 28 };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: background }]} edges={edges}>
      {scroll ? (
        <ScrollView
          style={styles.flex}
          contentContainerStyle={[styles.content, pad, contentStyle]}
          showsVerticalScrollIndicator={false}>
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.flex, styles.content, pad, contentStyle]}>{children}</View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  flex: { flex: 1 },
  content: { paddingHorizontal: 20, gap: 14 },
});
