import React from 'react';
import {
  Pressable,
  StyleSheet,
  TextInput,
  View,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';

import { colors, radius } from '@/theme';
import { Text } from './Text';

export function Field({
  label,
  children,
  style,
}: {
  label: string;
  children: React.ReactNode;
  style?: ViewStyle;
}) {
  return (
    <View style={[styles.field, style]}>
      <Text weight="extrabold" color={colors.textMuted} style={styles.label}>
        {label}
      </Text>
      {children}
    </View>
  );
}

export function TextField({
  label,
  style,
  ...props
}: TextInputProps & { label: string }) {
  return (
    <Field label={label}>
      <TextInput
        {...props}
        placeholderTextColor={colors.textFaint}
        style={[styles.input, style]}
      />
    </Field>
  );
}

export function SelectField({
  label,
  value,
  onPress,
  leading,
  placeholder,
}: {
  label: string;
  value?: string;
  onPress?: () => void;
  leading?: React.ReactNode;
  placeholder?: string;
}) {
  return (
    <Field label={label}>
      <Pressable onPress={onPress} style={styles.select}>
        {leading}
        <Text
          weight="semibold"
          color={value ? colors.ink : colors.textFaint}
          style={styles.selectText}>
          {value ?? placeholder}
        </Text>
      </Pressable>
    </Field>
  );
}

const styles = StyleSheet.create({
  field: { gap: 7 },
  label: { fontSize: 12, letterSpacing: 0.6, textTransform: 'uppercase' },
  input: {
    backgroundColor: colors.card,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.ring,
    paddingHorizontal: 16,
    paddingVertical: 15,
    fontSize: 15,
    fontFamily: 'Manrope_600SemiBold',
    color: colors.ink,
  },
  select: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.card,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.ring,
    paddingHorizontal: 16,
    paddingVertical: 15,
  },
  selectText: { flex: 1, fontSize: 15 },
});
