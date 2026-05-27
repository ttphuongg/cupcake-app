import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { Colors, Radius, Shadows } from '@/constants/theme';
import { OrderDetail } from '../../types';

interface OrderDetailHeaderProps {
  order: OrderDetail;
  onBack: () => void;
}

const getFriendlyStatusLabel = (status: string) => {
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
      return status;
  }
};

export const OrderDetailHeader: React.FC<OrderDetailHeaderProps> = ({ order, onBack }) => {
  return (
    <View style={styles.pinkHeader}>
      <View style={styles.headerTop}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <ArrowLeft size={24} color={Colors.foreground} />
        </TouchableOpacity>
        <View style={styles.headerTitleBox}>
          <Text style={styles.headerTitle}>Chi tiết đơn hàng</Text>
          <Text style={styles.headerSub}>#ORD{order.id}</Text>
        </View>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{getFriendlyStatusLabel(order.status)}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  pinkHeader: {
    backgroundColor: Colors.primaryAlpha10,
    paddingTop: Platform.OS === 'android' ? 44 : 54,
    paddingHorizontal: 16,
    paddingBottom: 60,
  },
  headerTop: { flexDirection: 'row', alignItems: 'center' },
  backBtn: { width: 40, height: 40, backgroundColor: Colors.white, borderRadius: Radius.full, justifyContent: 'center', alignItems: 'center', ...Shadows.sm },
  headerTitleBox: { flex: 1, marginLeft: 16 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: Colors.foreground },
  headerSub: { fontSize: 13, color: Colors.mutedForeground },
  statusBadge: { backgroundColor: '#FFF9C4', paddingHorizontal: 10, paddingVertical: 6, borderRadius: Radius.sm },
  statusText: { fontSize: 12, fontWeight: '600', color: '#F57F17' },
});
