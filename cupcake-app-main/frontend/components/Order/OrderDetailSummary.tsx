import { formatCurrency, formatDate } from '../../utils/formatters';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CreditCard } from 'lucide-react-native';
import { Colors, Radius, Shadows } from '@/constants/theme';
import { OrderDetail } from '../../types';

interface OrderDetailSummaryProps {
  order: OrderDetail;
}

const getFriendlyStatusLabel = (status?: string) => {
  switch (status?.toString().trim().toUpperCase()) {
    case 'PENDING':
      return 'Chờ xác nhận';
    case 'CONFIRMED':
      return 'Đã xác nhận';
    case 'PROCESSING':
      return 'Đang xử lý';
    case 'SHIPPING':
      return 'Đang giao';
    case 'COMPLETED':
      return 'Hoàn thành';
    case 'CANCELLED':
      return 'Đã hủy';
    default:
      return status || 'Không xác định';
  }
};

export const OrderDetailSummary: React.FC<OrderDetailSummaryProps> = ({ order }) => {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <CreditCard size={20} color={Colors.primaryDark} />
        <Text style={styles.sectionTitle}>Thanh toán</Text>
      </View>
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Trạng thái</Text>
        <Text style={styles.summaryValue}>{getFriendlyStatusLabel(order.status)}</Text>
      </View>
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Phương thức</Text>
        <Text style={styles.summaryValue}>
          {order.payment_method === 'BANKING'
            ? 'Chuyển khoản'
            : order.payment_method === 'MOMO'
            ? 'MOMO'
            : 'Tiền mặt (COD)'}
        </Text>
      </View>
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Thời gian đặt</Text>
        <Text style={styles.summaryValue}>{formatDate(order.created_at)}</Text>
      </View>
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Thời gian nhận</Text>
        <Text style={styles.summaryValue}>
          {order.status === 'COMPLETED'
            ? formatDate(order.receive_time ?? order.updated_at)
            : 'Chưa hoàn thành'}
        </Text>
      </View>
      <View style={styles.summaryTotal}>
        <Text style={styles.summaryTotalLabel}>Tổng cộng</Text>
        <Text style={styles.summaryTotalValue}>
          {formatCurrency(Number(order.total_price))}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    backgroundColor: Colors.white, marginHorizontal: 16, marginBottom: 12,
    borderRadius: Radius.xl, padding: 16, ...Shadows.sm,
  },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: Colors.foreground },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12, marginLeft: 28 },
  summaryLabel: { fontSize: 14, color: Colors.mutedForeground },
  summaryValue: { fontSize: 14, color: Colors.foreground, fontWeight: '500' },
  summaryTotal: { borderTopWidth: 1, borderTopColor: Colors.borderLight, paddingTop: 16, flexDirection: 'row', justifyContent: 'space-between', marginLeft: 28 },
  summaryTotalLabel: { fontSize: 16, fontWeight: '700', color: Colors.primaryDark },
  summaryTotalValue: { fontSize: 18, fontWeight: '800', color: Colors.primaryDark },
});
