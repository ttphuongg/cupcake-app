/**
 * components/OrderCard.tsx
 * Card hiển thị một đơn hàng trong danh sách lịch sử đơn hàng.
 * Tách ra từ app/order/index.tsx
 */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, Radius, Shadows } from '@/constants/theme';
import { Clock } from 'lucide-react-native';

type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPING' | 'COMPLETED' | 'CANCELLED';

export interface OrderCardItem {
  id: number;
  status: OrderStatus;
  created_at: string;
  total_price: number;
}

const STATUS_TEXT: Record<OrderStatus, string> = {
  PENDING: 'Chờ xác nhận',
  CONFIRMED: 'Đã xác nhận',
  PROCESSING: 'Đang xử lý',
  SHIPPING: 'Đang giao',
  COMPLETED: 'Hoàn thành',
  CANCELLED: 'Đã hủy',
};

export interface OrderCardProps {
  order: OrderCardItem;
  onPress: (id: number) => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={() => onPress(order.id)} activeOpacity={0.8}>
    <View style={styles.cardHeader}>
      <View style={styles.headerLeft}>
        <Text style={styles.orderTitle}>Đơn hàng</Text>
        <Text style={styles.orderId}>#ORD{order.id}</Text>
        <View style={styles.dateRow}>
          <Clock size={12} color={Colors.mutedForeground} style={{ marginRight: 4 }} />
          <Text style={styles.date}>
            {new Date(order.created_at).toLocaleDateString('vi-VN')}
          </Text>
        </View>
      </View>
      <View style={[
        styles.statusBadge,
        order.status === 'CANCELLED' && styles.statusBadgeDanger,
        order.status === 'COMPLETED' && styles.statusBadgeSuccess,
      ]}>
        <Text style={[
          styles.statusText,
          order.status === 'CANCELLED' && styles.statusTextDanger,
          order.status === 'COMPLETED' && styles.statusTextSuccess,
        ]}>
          {STATUS_TEXT[order.status].toUpperCase()}
        </Text>
      </View>
    </View>
    <View style={styles.cardFooter}>
      <Text style={styles.productCount}>1 sản phẩm</Text>
      <View style={styles.priceContainer}>
        <Text style={styles.totalLabel}>TỔNG CỘNG</Text>
        <Text style={styles.price}>
          {Number(order.total_price).toLocaleString('vi-VN')}đ
        </Text>
      </View>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: Radius.xl,
    ...Shadows.sm,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  headerLeft: { flex: 1 },
  orderTitle: { fontWeight: '700', fontSize: 15, color: Colors.foreground, marginBottom: 2 },
  orderId: { fontWeight: '700', fontSize: 15, color: Colors.foreground, marginBottom: 6 },
  dateRow: { flexDirection: 'row', alignItems: 'center' },
  date: { color: Colors.mutedForeground, fontSize: 12 },
  statusBadge: { backgroundColor: '#FFF9C4', paddingHorizontal: 10, paddingVertical: 6, borderRadius: Radius.sm },
  statusText: { fontSize: 11, fontWeight: '700', color: '#F57F17', textAlign: 'center' },
  statusBadgeDanger: { backgroundColor: '#FFEBEE' },
  statusTextDanger: { color: Colors.danger },
  statusBadgeSuccess: { backgroundColor: '#E8F5E9' },
  statusTextSuccess: { color: Colors.success },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  productCount: { fontSize: 13, color: Colors.mutedForeground, marginBottom: 2 },
  priceContainer: { alignItems: 'center' },
  totalLabel: { fontSize: 10, color: Colors.mutedForeground, fontWeight: '600', marginBottom: 2 },
  price: { fontSize: 18, fontWeight: '800', color: Colors.primaryDark },
});
