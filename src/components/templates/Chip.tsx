import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle } from 'react-native';

export type ChipProps = {
  label: string;
  onPress?: () => void;
  style?: ViewStyle;
};

export function Chip({ label, onPress, style }: ChipProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.chip, pressed && { opacity: 0.75 }, style]}
    >
      <Text style={styles.chipText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0B5FFF',
  },
});
