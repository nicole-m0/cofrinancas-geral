import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Card } from './Card';
import { colors } from '@/theme';
import { Icon } from '@/icons';
import { Text } from './Text';

export type StatTileProps = {
  label: string;
  value: string;
  delta?: string;
  deltaDir?: 'up' | 'down';
  deltaColor?: string;
};

export function StatTile({ label, value, delta, deltaDir, deltaColor = colors.green }: StatTileProps) {
  return (
    <Card padding={15} radius={20} style={styles.card}>
      <Text weight="extrabold" color={colors.textMuted} style={styles.label}>
        {label}
      </Text>
      <Text weight="extrabold" style={styles.value}>
        {value}
      </Text>
      {delta ? (
        <View style={styles.deltaRow}>
          {deltaDir ? <Icon name={deltaDir} size={13} color={deltaColor} /> : null}
          <Text weight="extrabold" color={deltaColor} style={styles.delta}>
            {delta}
          </Text>
        </View>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1 },
  label: { fontSize: 11.5, letterSpacing: 0.5, textTransform: 'uppercase' },
  value: { fontSize: 19, marginTop: 6 },
  deltaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 5 },
  delta: { fontSize: 11.5 },
});
