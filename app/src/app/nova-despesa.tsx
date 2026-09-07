import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';

import {
  AmountDisplay,
  AppHeader,
  Button,
  CategoryTile,
  Field,
  Screen,
  SegmentedControl,
  SelectField,
  TextField,
  Text,
} from '@/components';
import { CategoryPickerSheet } from '@/components/CategoryPickerSheet';
import { SheetModal } from '@/components/SheetModal';
import { Icon } from '@/icons';
import { useFinance } from '@/data/store';
import { useTheme, type ThemeColors } from '@/data/theme';
import { formDefaults } from '@/data/mock';
import { APP_TODAY, amount2, longDate, parseAmount } from '@/format';

const DATE_OPTIONS = [
  { iso: APP_TODAY, label: 'Hoje · 5 set' },
  { iso: '2026-09-04', label: 'Ontem · 4 set' },
  { iso: '2026-09-02', label: '2 set' },
];

export default function NovaDespesaScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const { categories, addExpense } = useFinance();

  const [mode, setMode] = useState<'Avulsa' | 'Recorrente'>('Avulsa');
  const [amountStr, setAmountStr] = useState(amount2(formDefaults.expense.amount));
  const [description, setDescription] = useState(formDefaults.expense.description);
  const [categoryName, setCategoryName] = useState(formDefaults.expense.categoryName);
  const [dateIso, setDateIso] = useState(APP_TODAY);
  const [catSheet, setCatSheet] = useState(false);
  const [dateSheet, setDateSheet] = useState(false);

  const expenseCats = useMemo(() => categories.filter((c) => c.kind === 'expense'), [categories]);
  const gridCats = useMemo(() => {
    const first4 = expenseCats.slice(0, 4);
    if (first4.some((c) => c.name === categoryName)) return first4;
    const picked = expenseCats.find((c) => c.name === categoryName);
    return picked ? [picked, ...first4.slice(0, 3)] : first4;
  }, [expenseCats, categoryName]);

  const save = () => {
    const value = parseAmount(amountStr);
    if (value <= 0) return;
    addExpense({
      amount: value,
      description,
      categoryName,
      date: dateIso,
      recurring: mode === 'Recorrente',
    });
    router.back();
  };

  return (
    <Screen edges={['top']}>
      <AppHeader
        title="Nova despesa"
        rightLabel="Cancelar"
        onRightPress={() => router.back()}
      />

      <SegmentedControl
        options={['Avulsa', 'Recorrente'] as const}
        value={mode}
        onChange={setMode}
      />

      <AmountDisplay
        label="Valor da despesa"
        value={amountStr}
        onChangeText={setAmountStr}
        tone="expense"
      />

      <TextField label="Descrição" value={description} onChangeText={setDescription} />

      <Field label="Categoria">
        <View style={styles.grid}>
          {gridCats.map((c) => (
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

      <SelectField
        label="Data"
        value={longDate(dateIso)}
        onPress={() => setDateSheet(true)}
        leading={<Icon name="cal" size={19} color={colors.textMuted} />}
      />

      <View style={styles.account}>
        <Icon name="wallet" size={20} color={colors.textMuted} />
        <Text weight="medium" color={colors.textSecondary} style={styles.accountText}>
          Conta{' '}
          <Text weight="bold" style={styles.accountName}>
            {formDefaults.expense.account}
          </Text>
        </Text>
        <Icon name="chev" size={17} color={colors.textFaint} />
      </View>

      <Button label="Salvar despesa" variant="ink" onPress={save} style={styles.save} />

      <CategoryPickerSheet
        visible={catSheet}
        onClose={() => setCatSheet(false)}
        kind="expense"
        value={categoryName}
        onSelect={setCategoryName}
      />

      <SheetModal visible={dateSheet} onClose={() => setDateSheet(false)} title="Data da despesa">
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

const makeStyles = (colors: ThemeColors) =>
  StyleSheet.create({
  grid: { flexDirection: 'row', gap: 10 },
  seeAll: { fontSize: 12, marginTop: 10 },
  account: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1,
    borderColor: colors.ringSoft,
    borderRadius: 20,
    padding: 16,
  },
  accountText: { flex: 1, fontSize: 13 },
  accountName: { fontSize: 13 },
  save: { marginTop: 6 },
  dateOption: { fontSize: 15, paddingVertical: 10 },
});
