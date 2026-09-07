import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';

import { AppHeader, Button, Card, IconTile, Screen, Text, Toggle } from '@/components';
import { CategoryPickerSheet } from '@/components/CategoryPickerSheet';
import { Icon, type IconName } from '@/icons';
import { useFinance } from '@/data/store';
import { useTheme, type ThemeColors } from '@/data/theme';
import { parseAmount } from '@/format';
import { radius } from '@/theme';
import type { GoalType } from '@/data/types';

type Option = {
  type: GoalType;
  title: string;
  sub: string;
  icon: IconName;
  color: string;
  tint: string;
};

const OPTIONS: Option[] = [
  { type: 'Poupança com prazo', title: 'Guardar um valor até uma data', sub: 'Poupança com prazo', icon: 'wallet', color: '#0F7A56', tint: '#E4F1EB' },
  { type: 'Redução de gasto', title: 'Gastar X a menos', sub: 'Redução vs. período anterior', icon: 'down', color: '#C08A2F', tint: '#F7EFDF' },
  { type: 'Limite de gasto', title: 'Limite de gasto mensal', sub: 'Não ultrapassar X no mês', icon: 'chart', color: '#3E5C76', tint: '#ECF0F4' },
  { type: 'Limite por categoria', title: 'Limite por categoria', sub: 'Ex.: no máx. R$ 500 em Delivery', icon: 'bag', color: '#C0512F', tint: '#FBEAE4' },
];

export default function CriarMetaScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const { addGoal } = useFinance();

  const [type, setType] = useState<GoalType>('Limite por categoria');
  const [name, setName] = useState('Limite Delivery');
  const [categoryName, setCategoryName] = useState('Delivery');
  const [valueStr, setValueStr] = useState('500,00');
  const [renew, setRenew] = useState(true);
  const [warn80, setWarn80] = useState(false);
  const [catSheet, setCatSheet] = useState(false);

  const needsCategory = type === 'Limite por categoria' || type === 'Redução de gasto';
  const valueLabel = type === 'Poupança com prazo' ? 'VALOR ALVO' : 'LIMITE MENSAL';

  const create = () => {
    const target = parseAmount(valueStr);
    addGoal({
      title: name.trim() || 'Nova meta',
      goalType: type,
      target,
      categoryName: needsCategory ? categoryName : undefined,
      color: OPTIONS.find((o) => o.type === type)?.color,
    });
    router.back();
  };

  return (
    <Screen>
      <AppHeader title="Nova meta" rightLabel="Cancelar" onRightPress={() => router.back()} />

      <View style={styles.section}>
        <Text weight="extrabold" color={colors.textMuted} style={styles.label}>
          TIPO DE META
        </Text>
        <View style={styles.options}>
          {OPTIONS.map((o) => {
            const active = o.type === type;
            return (
              <Pressable
                key={o.type}
                onPress={() => setType(o.type)}
                style={[
                  styles.option,
                  {
                    backgroundColor: active ? colors.ink : colors.card,
                    borderColor: active ? colors.green : colors.ring,
                  },
                ]}>
                <IconTile
                  icon={o.icon}
                  color={active ? colors.green : o.color}
                  tint={active ? 'rgba(255,255,255,0.12)' : o.tint}
                  size={36}
                  rounded={12}
                />
                <View style={styles.optionText}>
                  <Text
                    weight={active ? 'extrabold' : 'bold'}
                    color={active ? colors.screen : colors.ink}
                    style={styles.optionTitle}>
                    {o.title}
                  </Text>
                  <Text
                    weight="medium"
                    color={active ? colors.textFaint : colors.textMuted}
                    style={styles.optionSub}>
                    {o.sub}
                  </Text>
                </View>
                <View
                  style={[
                    styles.radio,
                    active
                      ? { backgroundColor: colors.green, borderColor: colors.green }
                      : { borderColor: colors.ringStrong },
                  ]}>
                  {active ? <Icon name="check" size={13} color={colors.white} /> : null}
                </View>
              </Pressable>
            );
          })}
        </View>
      </View>

      <Card padding={18} radius={22} style={styles.fields}>
        <Text weight="extrabold" color={colors.green} style={styles.fieldsLabel}>
          CAMPOS DA META
        </Text>

        <View>
          <Text weight="extrabold" color={colors.textMuted} style={styles.fieldLabel}>
            NOME
          </Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Ex.: Reserva de emergência"
            placeholderTextColor={colors.textFaint}
            style={styles.input}
          />
        </View>

        {needsCategory ? (
          <View>
            <Text weight="extrabold" color={colors.textMuted} style={styles.fieldLabel}>
              CATEGORIA
            </Text>
            <Pressable style={styles.catRow} onPress={() => setCatSheet(true)}>
              <IconTile icon="bag" color={colors.rust} tint={colors.rustTint} size={30} rounded={10} />
              <Text weight="bold" style={styles.catName}>
                {categoryName}
              </Text>
              <Icon name="chev" size={17} color={colors.textFaint} />
            </Pressable>
          </View>
        ) : null}

        <View>
          <Text weight="extrabold" color={colors.textMuted} style={styles.fieldLabel}>
            {valueLabel}
          </Text>
          <View style={styles.amountRow}>
            <Text weight="bold" color={colors.textMuted} style={styles.amountCurrency}>
              R$
            </Text>
            <TextInput
              value={valueStr}
              onChangeText={setValueStr}
              keyboardType="decimal-pad"
              placeholder="0,00"
              placeholderTextColor={colors.textFaint}
              style={styles.amountInput}
            />
          </View>
        </View>

        <View style={styles.toggleRow}>
          <View style={styles.flex}>
            <Text weight="bold" style={styles.toggleTitle}>
              Renovar todo mês
            </Text>
            <Text weight="medium" color={colors.textMuted} style={styles.toggleSub}>
              Reinicia o limite no dia 1
            </Text>
          </View>
          <Toggle value={renew} onValueChange={setRenew} />
        </View>

        <View style={styles.toggleRow}>
          <View style={styles.flex}>
            <Text weight="bold" style={styles.toggleTitle}>
              Avisar em 80%
            </Text>
            <Text weight="medium" color={colors.textMuted} style={styles.toggleSub}>
              Notificação ao chegar perto
            </Text>
          </View>
          <Toggle value={warn80} onValueChange={setWarn80} />
        </View>
      </Card>

      <Button label="Criar meta" variant="ink" onPress={create} style={styles.createBtn} />

      <CategoryPickerSheet
        visible={catSheet}
        onClose={() => setCatSheet(false)}
        kind="expense"
        value={categoryName}
        onSelect={setCategoryName}
      />
    </Screen>
  );
}

const makeStyles = (colors: ThemeColors) =>
  StyleSheet.create({
  section: { gap: 10 },
  label: { fontSize: 12, letterSpacing: 0.6 },
  options: { gap: 9 },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 18,
    borderWidth: 1,
    padding: 15,
  },
  optionText: { flex: 1 },
  optionTitle: { fontSize: 14 },
  optionSub: { fontSize: 12, marginTop: 2 },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },

  fields: { gap: 16 },
  fieldsLabel: { fontSize: 12, letterSpacing: 0.6 },
  fieldLabel: { fontSize: 12, letterSpacing: 0.6, marginBottom: 7 },
  input: {
    backgroundColor: colors.surfaceSunken,
    borderRadius: radius.xs,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 14,
    fontFamily: 'Manrope_600SemiBold',
    color: colors.ink,
  },
  catRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.surfaceSunken,
    borderRadius: radius.xs,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  catName: { flex: 1, fontSize: 14 },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.surfaceSunken,
    borderRadius: radius.xs,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  amountCurrency: { fontSize: 13 },
  amountInput: {
    flex: 1,
    fontSize: 22,
    fontFamily: 'Manrope_800ExtraBold',
    color: colors.ink,
    letterSpacing: -0.4,
    padding: 0,
  },
  toggleRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  flex: { flex: 1 },
  toggleTitle: { fontSize: 13.5 },
  toggleSub: { fontSize: 12, marginTop: 2 },
  createBtn: { marginTop: 6 },
});
