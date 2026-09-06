import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { colors } from '@/theme';
import { Icon } from '@/icons';
import { useFinance } from '@/data/store';
import type { TxKind } from '@/data/types';
import { IconTile } from './IconTile';
import { SheetModal } from './SheetModal';
import { Text } from './Text';

export type CategoryPickerSheetProps = {
  visible: boolean;
  onClose: () => void;
  kind: TxKind;
  value: string;
  onSelect: (name: string) => void;
};

export function CategoryPickerSheet({
  visible,
  onClose,
  kind,
  value,
  onSelect,
}: CategoryPickerSheetProps) {
  const { categories } = useFinance();
  const list = categories.filter((c) => c.kind === kind);

  return (
    <SheetModal visible={visible} onClose={onClose} title="Escolha a categoria">
      <View>
        {list.map((c, i) => {
          const selected = c.name === value;
          return (
            <Pressable
              key={c.id}
              onPress={() => {
                onSelect(c.name);
                onClose();
              }}
              style={[styles.row, i < list.length - 1 && styles.divider]}>
              <IconTile icon={c.icon} color={c.color} tint={c.tint} size={38} rounded={13} />
              <Text weight="bold" style={styles.name}>
                {c.name}
              </Text>
              {selected ? <Icon name="check" size={18} color={colors.green} /> : null}
            </Pressable>
          );
        })}
      </View>
    </SheetModal>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 },
  divider: { borderBottomWidth: 1, borderBottomColor: colors.divider },
  name: { flex: 1, fontSize: 14 },
});
