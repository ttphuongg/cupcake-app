import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Colors, Radius, Shadows } from '@/constants/theme';
import { formatCurrency } from '../../utils/formatters';

interface CheckoutFooterProps {
  totalAmount: number;
  isLoading: boolean;
  onPlaceOrder: () => void;
}

export const CheckoutFooter = ({ totalAmount, isLoading, onPlaceOrder }: CheckoutFooterProps) => (
  <View style={styles.footer}>
    <View style={styles.footerInfo}>
      <Text style={styles.footerTotalLabel}>TỔNG THANH TOÁN</Text>
      <Text style={styles.footerTotalValue}>{formatCurrency(totalAmount)}</Text>
    </View>
    <TouchableOpacity
      style={[styles.orderBtn, isLoading && { opacity: 0.7 }]}
      onPress={onPlaceOrder}
      disabled={isLoading}
    >
      {isLoading ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text style={styles.orderBtnText}>Đặt hàng ngay</Text>
      )}
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 14, backgroundColor: Colors.white,
    borderTopWidth: 1, borderTopColor: Colors.borderLight, ...Shadows.sm,
  },
  footerInfo: {},
  footerTotalLabel: { fontSize: 11, color: Colors.mutedForeground, textTransform: 'uppercase' },
  footerTotalValue: { fontSize: 20, fontWeight: '800', color: Colors.primaryDark },
  orderBtn: {
    backgroundColor: Colors.primaryDark, paddingHorizontal: 32, paddingVertical: 14,
    borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center', minWidth: 150,
  },
  orderBtnText: { color: 'white', fontSize: 16, fontWeight: '700' },
});