import React from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';

import { colors, radius } from '@/theme';
import { Text } from './Text';

export type SheetModalProps = {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
};

export function SheetModal({ visible, onClose, title, children }: SheetModalProps) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={styles.sheet}>
        <View style={styles.grabber} />
        {title ? (
          <Text weight="extrabold" style={styles.title}>
            {title}
          </Text>
        ) : null}
        {children}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(16,20,19,0.4)' },
  sheet: {
    backgroundColor: colors.screen,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 34,
    gap: 12,
  },
  grabber: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 99,
    backgroundColor: colors.ringStrong,
    marginBottom: 6,
  },
  title: { fontSize: 17, marginBottom: 2 },
});
