import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ingredient } from '../../types';
import { Colors } from '../../constants/theme';

export interface DesignSummaryStepProps {
  base: Ingredient | null;
  filling: Ingredient | null;
  frosting: Ingredient | null;
  size: Ingredient | null;
  sugar: Ingredient | null;
  toppings: Ingredient[];
  quantity: number;
}

export const DesignSummaryStep: React.FC<DesignSummaryStepProps> = ({
  base,
  filling,
  frosting,
  size,
  sugar,
  toppings,
  quantity,
}) => {
  const rows: { label: string; value: string }[] = [
    { label: 'Kích cỡ', value: size?.name ?? '—' },
    { label: 'Mức đường', value: sugar?.name ?? '—' },
    { label: 'Cốt bánh', value: base?.name ?? '—' },
    { label: 'Nhân', value: filling?.name ?? 'Không có' },
    { label: 'Kem phủ', value: frosting?.name ?? '—' },
    {
      label: 'Topping',
      value: toppings.length ? toppings.map((t) => t.name).join(', ') : 'Không có',
    },
    { label: 'Số lượng', value: `${quantity}` },
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {rows.map((row) => (
        <View key={row.label} style={styles.row}>
          <Text style={styles.label}>{row.label}</Text>
          <Text style={styles.value}>{row.value}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 24, paddingTop: 4, paddingBottom: 20 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  label: { fontSize: 14, color: Colors.mutedForeground },
  value: { fontSize: 14, fontWeight: '600', color: Colors.foreground },
});

