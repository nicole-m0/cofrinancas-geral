import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import {
  AmountDisplay,
  AppHeader,
  Button,
  Card,
  CategoryTile,
  Field,
  Screen,
  SegmentedControl,
  SelectField,
  TextField,
  Text,
  Toggle,
} from '@/components';
import { CategoryPickerSheet } from '@/components/CategoryPickerSheet';
import { SheetModal } from '@/components/SheetModal';
import { Icon } from '@/icons';
import { useFinance } from '@/data/store';
import { formDefaults } from '@/data/mock';
import { APP_TODAY, amount2, longDate, parseAmount } from '@/format';
import { colors } from '@/theme';
import type { Frequency } from '@/data/types';

const FREQUENCIES: Frequency[] = ['Mensal', 'Semanal', 'Quinzenal', 'Anual'];
const DATE_OPTIONS = [
  { iso: APP_TODAY, label: 'Hoje · 5 set' },
  { iso: '2026-09-04', label: 'Ontem · 4 set' },
  { iso: '2026-09-02', label: '2 set' },
];

export default function NovaReceitaScreen() {
  const router = useRouter();
  const { categories, addIncome } = useFinance();

  const [mode, setMode] = useState<'Avulsa' | 'Recorrente'>('Recorrente');
  const [amountStr, setAmountStr] = useState(amount2(formDefaults.income.amount));
  const [description, setDescription] = useState(formDefaults.income.description);
  const [categoryName, setCategoryName] = useState(formDefaults.income.categoryName);
  const [frequency, setFrequency] = useState<Frequency>('Mensal');
  const [noEndDate, setNoEndDate] = useState(true);
  const [dateIso, setDateIso] = useState(APP_TODAY);
  const [catSheet, setCatSheet] = useState(false);
  const [dateSheet, setDateSheet] = useState(false);

  const incomeCats = useMemo(() => categories.filter((c) => c.kind === 'income'), [categories]);

  const save = () => {
    const value = parseAmount(amountStr);
    if (value <= 0) return;
    addIncome({
      amount: value,
      description,
      categoryName,
      date: dateIso,
      recurring: mode === 'Recorrente',
      frequency,
    });
    router.back();
  };

  return (
    <Screen edges={['top']}>
      <AppHeader title="Nova receita" rightLabel="Cancelar" onRightPress={() => router.back()} />

      <SegmentedControl
        options={['Avulsa', 'Recorrente'] as const}
        value={mode}
        onChange={setMode}
      />

      <AmountDisplay
        label="Valor da receita"
        value={amountStr}
        onChangeText={setAmountStr}
        tone="income"
      />

      <TextField label="Descrição" value={description} onChangeText={setDescription} />

      <Field label="Categoria">
        <View style={styles.grid}>
          {incomeCats.map((c) => (
            <CategoryTile
              key={c.id}
              name={c.name}
              icon={c.icon}
              color={c.color}
              tint={c.tint}
              selected={c.name === categoryName}
              onPress={() => setCategoryName(c.name)}
            />
          ))}
        </View>
        <Text weight="bold" color={colors.green} style={styles.seeAll} onPress={() => setCatSheet(true)}>
          + Ver todas as categorias
        </Text>
      </Field>

      {mode === 'Recorrente' ? (
        <Card padding={18} radius={22} style={styles.recCard}>
          <Text weight="extrabold" color={colors.green} style={styles.recLabel}>
            RECORRÊNCIA
          </Text>

          <View>
            <Text weight="extrabold" color={colors.textMuted} style={styles.subLabel}>
              FREQUÊNCIA
            </Text>
            <View style={styles.freqRow}>
              {FREQUENCIES.map((f) => {
                const active = f === frequency;
                return (
                  <Pressable
                    key={f}
                    onPress={() => setFrequency(f)}
                    style={[
                      styles.freqPill,
                      { backgroundColor: active ? colors.ink : colors.surfaceMuted },
                    ]}>
                    <Text
                      weight={active ? 'extrabold' : 'bold'}
                      color={active ? colors.white : colors.textSecondary}
                      style={styles.freqText}>
                      {f}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={styles.startEndRow}>
            <View style={styles.flex}>
              <Text weight="extrabold" color={colors.textMuted} style={styles.subLabel}>
                INÍCIO
              </Text>
              <View style={styles.dateBox}>
                <Text weight="bold" style={styles.dateBoxText}>
                  {formDefaults.income.startLabel}
                </Text>
              </View>
            </View>
            <View style={styles.flex}>
              <Text weight="extrabold" color={colors.textMuted} style={styles.subLabel}>
                FIM
              </Text>
              <View style={styles.dateBox}>
                <Text weight="bold" color={colors.textFaint} style={styles.dateBoxText}>
                  {noEndDate ? '—' : 'dez 2026'}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.toggleRow}>
            <Text weight="bold" style={styles.toggleLabel}>
              Sem data final
            </Text>
            <Toggle value={noEndDate} onValueChange={setNoEndDate} />
          </View>

          <Text weight="medium" color={colors.textMuted} style={styles.hint}>
            Repete todo dia 5 até você encerrar. Aparece no painel como próxima receita a receber.
          </Text>
        </Card>
      ) : (
        <SelectField
          label="Data"
          value={longDate(dateIso)}
          onPress={() => setDateSheet(true)}
          leading={<Icon name="cal" size={19} color={colors.textMuted} />}
        />
      )}

      <Button label="Salvar receita" variant="green" onPress={save} style={styles.save} />

      <CategoryPickerSheet
        visible={catSheet}
        onClose={() => setCatSheet(false)}
        kind="income"
        value={categoryName}
        onSelect={setCategoryName}
      />

      <SheetModal visible={dateSheet} onClose={() => setDateSheet(false)} title="Data da receita">
        {DATE_OPTIONS.map((o) => (
          <Text
            key={o.iso}
            weight={o.iso === dateIso ? 'extrabold' : 'bold'}
            color={o.iso === dateIso ? colors.green : colors.ink}
            style={styles.dateOption}
            onPress={() => {
              setDateIso(o.iso);
              setDateSheet(false);
            }}>
            {o.label}
          </Text>
        ))}
      </SheetModal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', gap: 10 },
  seeAll: { fontSize: 12, marginTop: 10 },
  recCard: { gap: 16 },
  recLabel: { fontSize: 12, letterSpacing: 0.6 },
  subLabel: { fontSize: 12, letterSpacing: 0.6, marginBottom: 9 },
  freqRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  freqPill: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 999 },
  freqText: { fontSize: 12.5 },
  startEndRow: { flexDirection: 'row', gap: 10 },
  flex: { flex: 1 },
  dateBox: { backgroundColor: colors.surfaceSunken, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 13 },
  dateBoxText: { fontSize: 14 },
  toggleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  toggleLabel: { fontSize: 13.5 },
  hint: { fontSize: 12.5, lineHeight: 18 },
  save: { marginTop: 6 },
  dateOption: { fontSize: 15, paddingVertical: 10 },
});
