import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { CreditCard } from 'lucide-react-native';
import { Colors, Radius } from '@/constants/theme';

export const PaymentMethodSection = () => (
  <View style={styles.section}>
    <View style={styles.paymentHeaderRow}>
      <CreditCard size={20} color={Colors.mutedForeground} />
      <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>
      <TouchableOpacity style={{ marginLeft: 'auto' }}>
        <Text style={styles.changeText}>Tiền mặt &gt;</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  section: {
    backgroundColor: Colors.white,
    borderBottomWidth: 1, borderBottomColor: Colors.borderLight,
    padding: 16,
  },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: Colors.foreground },
  changeText: { fontSize: 13, color: Colors.primaryDark },
  paymentHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
});

// ─── SummarySection ───────────────────────────────────────────────────────────

import { formatCurrency } from '../../utils/formatters';

export const SummarySection = ({ totalAmount }: { totalAmount: number }) => (
  <View style={summaryStyles.summarySection}>
    <View style={summaryStyles.summaryRow}>
      <Text style={summaryStyles.summaryLabel}>Tạm tính</Text>
      <Text style={summaryStyles.summaryValue}>{formatCurrency(totalAmount)}</Text>
    </View>
    <View style={summaryStyles.summaryRow}>
      <Text style={summaryStyles.summaryLabel}>Phí vận chuyển</Text>
      <Text style={summaryStyles.summaryFree}>Miễn phí</Text>
    </View>
    <View style={[summaryStyles.summaryRow, summaryStyles.summaryTotal]}>
      <Text style={summaryStyles.summaryTotalLabel}>Tổng cộng</Text>
      <Text style={summaryStyles.summaryTotalValue}>{formatCurrency(totalAmount)}</Text>
    </View>
  </View>
);

const summaryStyles = StyleSheet.create({
  summarySection: { backgroundColor: Colors.white, padding: 16, marginBottom: 16 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  summaryLabel: { fontSize: 14, color: Colors.textSecondary },
  summaryValue: { fontSize: 14, color: Colors.foreground, fontWeight: '500' },
  summaryFree: { fontSize: 14, color: Colors.foreground, fontWeight: '500' },
  summaryTotal: { borderTopWidth: 1, borderTopColor: Colors.borderLight, paddingTop: 16, marginBottom: 0 },
  summaryTotalLabel: { fontSize: 16, fontWeight: '700', color: Colors.foreground },
  summaryTotalValue: { fontSize: 18, fontWeight: '800', color: Colors.primaryDark },
});
