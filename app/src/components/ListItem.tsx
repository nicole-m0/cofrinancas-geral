import React, { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { useTheme, type ThemeColors } from '@/data/theme';
import { Icon, type IconName } from '@/icons';
import { IconTile } from './IconTile';
import { Text } from './Text';

export type ListItemProps = {
  icon?: IconName;
  iconColor?: string;
  iconTint?: string;
  title: string;
  subtitle?: string;
  /** right-aligned value text */
  value?: string;
  valueColor?: string;
  trailing?: React.ReactNode;
  chevron?: boolean;
  onPress?: () => void;
  divider?: boolean;
  tag?: string;
};

export function ListItem({
  icon,
  iconColor,
  iconTint,
  title,
  subtitle,
  value,
  valueColor,
  trailing,
  chevron,
  onPress,
  divider = false,
  tag,
}: ListItemProps) {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const Wrapper = onPress ? Pressable : View;

  return (
    <Wrapper onPress={onPress} style={[styles.row, divider && styles.divider]}>
      {icon ? (
        <IconTile
          icon={icon}
          color={iconColor ?? colors.textSecondary}
          tint={iconTint ?? colors.surfaceRaised}
          size={38}
          rounded={13}
        />
      ) : null}

      <View style={styles.mid}>
        <Text weight="bold" style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {(subtitle || tag) && (
          <View style={styles.subRow}>
            {subtitle ? (
              <Text weight="medium" color={colors.textMuted} style={styles.sub} numberOfLines={1}>
                {subtitle}
              </Text>
            ) : null}
            {tag ? (
              <View style={styles.tag}>
                <Text weight="extrabold" color={colors.greenDark} style={styles.tagText}>
                  {tag}
                </Text>
              </View>
            ) : null}
          </View>
        )}
      </View>

      {value ? (
        <Text weight="extrabold" color={valueColor ?? colors.ink} style={styles.value}>
          {value}
        </Text>
      ) : null}
      {trailing}
      {chevron ? <Icon name="chev" size={17} color={colors.textFaint} /> : null}
    </Wrapper>
  );
}

const makeStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 13 },
    divider: { borderBottomWidth: 1, borderBottomColor: colors.divider },
    mid: { flex: 1, minWidth: 0 },
    title: { fontSize: 14 },
    subRow: { flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: 3 },
    sub: { fontSize: 12, flexShrink: 1 },
    value: { fontSize: 14 },
    tag: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 6, backgroundColor: colors.greenTint },
    tagText: { fontSize: 10, letterSpacing: 0.3 },
  });
