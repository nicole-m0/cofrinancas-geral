import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';

import { Button, Card, IconTile, Screen, SegmentedControl, Text } from '@/components';
import { Icon } from '@/icons';
import { useFinance } from '@/data/store';
import { colors, radius, swatches } from '@/theme';
import type { TxKind } from '@/data/types';

export default function CategoriasScreen() {
  const router = useRouter();
  const { categories, addCategory, deleteCategory } = useFinance();

  const [tab, setTab] = useState<'Despesas' | 'Receitas'>('Despesas');
  const [name, setName] = useState('');
  const [color, setColor] = useState<string>(swatches[4]);

  const kind: TxKind = tab === 'Despesas' ? 'expense' : 'income';
  const list = categories.filter((c) => c.kind === kind);

  const create = () => {
    if (!name.trim()) return;
    addCategory({ name: name.trim(), kind, color });
    setName('');
  };

  return (
    <Screen>
      <View style={styles.header}>
        <Pressable style={styles.backChip} onPress={() => router.back()}>
          <Icon name="back" size={19} color={colors.ink} />
        </Pressable>
        <Text weight="extrabold" style={styles.title}>
          Categorias
        </Text>
      </View>

      <SegmentedControl
        options={['Despesas', 'Receitas'] as const}
        value={tab}
        onChange={setTab}
      />

      <Card padding={0} style={styles.listCard}>
        {list.map((c, i) => (
          <View key={c.id} style={[styles.row, i < list.length - 1 && styles.divider]}>
            <IconTile icon={c.icon} color={c.color} tint={c.tint} size={40} rounded={14} />
            <View style={styles.flex}>
              <Text weight="bold" style={styles.name}>
                {c.name}
              </Text>
              {c.sub ? (
                <Text weight="medium" color={colors.textMuted} style={styles.sub}>
                  {c.sub}
                </Text>
              ) : null}
            </View>
            <View style={styles.actions}>
              <View style={styles.actionBtn}>
                <Icon name="pencil" size={17} color={colors.textFaint} />
              </View>
              <Pressable style={styles.actionBtn} onPress={() => deleteCategory(c.id)}>
                <Icon name="trash" size={17} color={colors.textFaint} />
              </Pressable>
            </View>
          </View>
        ))}
        {list.length === 0 ? (
          <Text weight="medium" color={colors.textMuted} style={styles.empty}>
            Nenhuma categoria nesta aba.
          </Text>
        ) : null}
      </Card>

      <Card style={styles.newCard}>
        <Text weight="extrabold" color={colors.textMuted} style={styles.newLabel}>
          NOVA CATEGORIA
        </Text>
        <View style={styles.newRow}>
          <IconTile icon="film" color={color} tint="#F7EFDF" size={44} rounded={15} />
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Nome da categoria"
            placeholderTextColor={colors.textFaint}
            style={styles.newInput}
          />
        </View>
        <View style={styles.swatches}>
          {swatches.map((s) => (
            <Pressable
              key={s}
              onPress={() => setColor(s)}
              style={[
                styles.swatch,
                { backgroundColor: s },
                color === s && styles.swatchActive,
              ]}
            />
          ))}
        </View>
        <Button label="Criar categoria" variant="ink" onPress={create} style={styles.createBtn} />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 4 },
  backChip: {
    width: 38,
    height: 38,
    borderRadius: 13,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.ring,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontSize: 26, letterSpacing: -0.6 },

  listCard: { paddingHorizontal: 18 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 13, paddingVertical: 14 },
  divider: { borderBottomWidth: 1, borderBottomColor: colors.divider },
  flex: { flex: 1, minWidth: 0 },
  name: { fontSize: 14.5 },
  sub: { fontSize: 12, marginTop: 2 },
  actions: { flexDirection: 'row', gap: 6 },
  actionBtn: {
    width: 32,
    height: 32,
    borderRadius: 11,
    backgroundColor: colors.surfaceSunken,
    alignItems: 'center',
    justifyContent: 'center',
  },
  empty: { fontSize: 13, paddingVertical: 20, textAlign: 'center' },

  newCard: { gap: 14 },
  newLabel: { fontSize: 13, letterSpacing: 0.6 },
  newRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  newInput: {
    flex: 1,
    backgroundColor: colors.surfaceSunken,
    borderRadius: radius.xs,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 14,
    fontFamily: 'Manrope_600SemiBold',
    color: colors.ink,
  },
  swatches: { flexDirection: 'row', gap: 9 },
  swatch: { width: 28, height: 28, borderRadius: 10 },
  swatchActive: {
    borderWidth: 2,
    borderColor: colors.white,
    shadowColor: '#101413',
    shadowOpacity: 0.25,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 0 },
    elevation: 3,
  },
  createBtn: { marginTop: 2 },
});
