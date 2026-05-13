import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { Colors, Radius, Shadows } from '@/constants/theme';
import { Clock, ShoppingBag } from 'lucide-react-native';
import { formatCurrency } from '../../utils/formatters';
import { OrderItem } from '../../types/orderItem';

type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPING' | 'COMPLETED' | 'CANCELLED';

export interface OrderCardItem {
  id: number;
  status: OrderStatus;
  created_at: string;
  total_price: number;
  items?: OrderItem[];
}

const STATUS_CONFIG: Record<OrderStatus, { label: string; bg: string; color: string }> = {
  PENDING:    { label: 'Chờ xác nhận', bg: '#FFF9C4', color: '#F57F17' },
  CONFIRMED:  { label: 'Đã xác nhận',  bg: '#E3F2FD', color: '#1565C0' },
  PROCESSING: { label: 'Đang xử lý',   bg: '#EDE7F6', color: '#4527A0' },
  SHIPPING:   { label: 'Đang giao',    bg: '#E8F5E9', color: '#2E7D32' },
  COMPLETED:  { label: 'Hoàn thành',   bg: '#E8F5E9', color: Colors.success },
  CANCELLED:  { label: 'Đã hủy',       bg: '#FFEBEE', color: Colors.danger },
};

export interface OrderCardProps {
  order: OrderCardItem;
  onPress: (id: number) => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order, onPress }) => {
  const statusConfig = STATUS_CONFIG[order.status];
  const firstItem = order.items?.[0];
  const remainingCount = (order.items?.length ?? 0) - 1;

  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(order.id)} activeOpacity={0.8}>
      {/* HEADER: Trạng thái + Ngày */}
      <View style={styles.cardHeader}>
        <View style={styles.dateRow}>
          <Clock size={12} color={Colors.mutedForeground} />
          <Text style={styles.date}>
            {new Date(order.created_at).toLocaleDateString('vi-VN')}
          </Text>
          <Text style={styles.orderId}>· #ORD{order.id}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusConfig.bg }]}>
          <Text style={[styles.statusText, { color: statusConfig.color }]}>
            {statusConfig.label.toUpperCase()}
          </Text>
        </View>
      </View>

      {/* BODY: Sản phẩm đầu tiên */}
      {firstItem ? (
        <View style={styles.itemRow}>
          {firstItem.product_image ? (
            <Image
              source={{ uri: firstItem.product_image }}
              style={styles.productImage}
              contentFit="cover"
              transition={200}
            />
          ) : (
            <View style={[styles.productImage, styles.imagePlaceholder]}>
              <ShoppingBag size={20} color={Colors.primary} />
            </View>
          )}
          <View style={styles.itemInfo}>
            <Text style={styles.productName} numberOfLines={2}>
              {firstItem.product_name}
            </Text>
            <Text style={styles.productQty}>x{firstItem.quantity}</Text>
            {remainingCount > 0 && (
              <Text style={styles.moreItems}>và {remainingCount} sản phẩm khác</Text>
            )}
          </View>
        </View>
      ) : (
        <View style={styles.emptyItems}>
          <Text style={styles.emptyText}>Không có sản phẩm</Text>
        </View>
      )}

      {/* FOOTER: Tổng tiền */}
      <View style={styles.cardFooter}>
        <Text style={styles.itemCount}>
          {order.items?.length ?? 0} sản phẩm
        </Text>
        <View style={styles.priceContainer}>
          <Text style={styles.totalLabel}>TỔNG CỘNG</Text>
          <Text style={styles.price}>{formatCurrency(Number(order.total_price))}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: Radius.xl,
    ...Shadows.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  date: { color: Colors.mutedForeground, fontSize: 12 },
  orderId: { color: Colors.mutedForeground, fontSize: 12 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radius.sm },
  statusText: { fontSize: 10, fontWeight: '700', textAlign: 'center' },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    marginBottom: 12,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: Radius.sm,
    backgroundColor: Colors.inputBackground,
  },
  imagePlaceholder: { alignItems: 'center', justifyContent: 'center' },
  itemInfo: { flex: 1 },
  productName: { fontSize: 14, fontWeight: '500', color: Colors.foreground, lineHeight: 20 },
  productQty: { fontSize: 12, color: Colors.mutedForeground, marginTop: 4 },
  moreItems: { fontSize: 12, color: Colors.mutedForeground, marginTop: 2, fontStyle: 'italic' },
  emptyItems: { paddingVertical: 12 },
  emptyText: { fontSize: 13, color: Colors.mutedForeground, textAlign: 'center' },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  itemCount: { fontSize: 13, color: Colors.mutedForeground },
  priceContainer: { alignItems: 'flex-end' },
  totalLabel: { fontSize: 10, color: Colors.mutedForeground, fontWeight: '600', marginBottom: 2 },
  price: { fontSize: 18, fontWeight: '800', color: Colors.primaryDark },
});
