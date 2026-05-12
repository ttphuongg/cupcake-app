/**
 * app/order/[id].tsx — Chi tiết đơn hàng
 * Logic: useOrderStore.fetchOrderById(), cancelOrder(), reorder()
 */
import React, { useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet,
  ActivityIndicator, TouchableOpacity, Alert, Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors, Radius, Shadows } from '@/constants/theme';
import { useOrderStore } from '../../store/orderStore';
import { useCartStore } from '../../store/cartStore';
import { ArrowLeft, MapPin, Package, CreditCard, RotateCcw } from 'lucide-react-native';
import { Image } from 'expo-image';

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { currentOrderDetail, isLoading, fetchOrderById, cancelOrder, reorder } = useOrderStore();
  const { fetchCart } = useCartStore();

  useEffect(() => {
    if (id) fetchOrderById(id);
  }, [id]);

  const handleCancelOrder = () => {
    Alert.alert(
      'Xác nhận',
      'Bạn có chắc chắn muốn hủy đơn hàng này không?',
      [
        { text: 'Không', style: 'cancel' },
        {
          text: 'Có, Hủy đơn',
          style: 'destructive',
          onPress: async () => {
            try {
              await cancelOrder(id!);
              Alert.alert('Thành công', 'Đã hủy đơn hàng.');
            } catch (err: unknown) {
              const msg =
                (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
                'Hủy đơn thất bại';
              Alert.alert('Lỗi', msg);
            }
          },
        },
      ],
    );
  };

  const handleReorder = async () => {
    try {
      const result = await reorder(id!);
      // Refresh giỏ hàng sau khi đặt lại
      await fetchCart();
      let msg = result.message;
      if (result.unavailableItems && result.unavailableItems.length > 0) {
        msg += `\nLưu ý: Hết hàng: ${result.unavailableItems.join(', ')}`;
      }
      Alert.alert('Thành công', msg, [
        { text: 'Xem giỏ hàng', onPress: () => router.push('/cart' as never) },
        { text: 'OK' },
      ]);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Không thể đặt lại đơn hàng';
      Alert.alert('Lỗi', msg);
    }
  };

  if (isLoading) {
    return <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 60 }} />;
  }

  if (!currentOrderDetail) {
    return <Text style={styles.errorText}>Không có dữ liệu</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.pinkHeader}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ArrowLeft size={24} color={Colors.foreground} />
          </TouchableOpacity>
          <View style={styles.headerTitleBox}>
            <Text style={styles.headerTitle}>Chi tiết đơn hàng</Text>
            <Text style={styles.headerSub}>#ORD{currentOrderDetail.id}</Text>
          </View>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{currentOrderDetail.status}</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Địa chỉ */}
        <View style={[styles.section, styles.overlappingCard]}>
          <View style={styles.sectionHeader}>
            <MapPin size={20} color={Colors.primaryDark} />
            <Text style={styles.sectionTitle}>Địa chỉ giao hàng</Text>
          </View>
          <Text style={styles.addressName}>{currentOrderDetail.phone}</Text>
          <Text style={styles.addressText}>{currentOrderDetail.address}</Text>
        </View>

        {/* Sản phẩm */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Package size={20} color={Colors.primaryDark} />
            <Text style={styles.sectionTitle}>Sản phẩm</Text>
          </View>
          {currentOrderDetail.items.map((item, index) => (
            <View key={index} style={styles.cartItemRow}>
              <View style={styles.itemImageDummy} />
              <View style={styles.itemInfo}>
                <Text style={styles.cartItemName}>{item.product_name}</Text>
                <Text style={styles.cartItemQty}>x{item.quantity}</Text>
              </View>
              <Text style={styles.cartItemPrice}>
                {Number(item.price * item.quantity).toLocaleString('vi-VN')}đ
              </Text>
            </View>
          ))}
        </View>

        {/* Thanh toán */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <CreditCard size={20} color={Colors.primaryDark} />
            <Text style={styles.sectionTitle}>Thanh toán</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Phương thức</Text>
            <Text style={styles.summaryValue}>Tiền mặt (COD)</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Thời gian giao</Text>
            <Text style={styles.summaryValue}>Hôm nay - Giao ngay</Text>
          </View>
          <View style={styles.summaryTotal}>
            <Text style={styles.summaryTotalLabel}>Tổng cộng</Text>
            <Text style={styles.summaryTotalValue}>
              {Number(currentOrderDetail.total_price).toLocaleString('vi-VN')}đ
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom actions */}
      <View style={styles.bottomBar}>
        {currentOrderDetail.status === 'PENDING' && (
          <TouchableOpacity
            style={[styles.btnAction, styles.btnCancel]}
            onPress={handleCancelOrder}
          >
            <Text style={styles.btnCancelText}>Hủy đơn</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.btnAction, styles.btnReorder]}
          onPress={handleReorder}
        >
          <RotateCcw size={18} color={Colors.white} style={{ marginRight: 6 }} />
          <Text style={styles.btnText}>Đặt lại</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
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
  scrollContent: { paddingBottom: 100 },
  overlappingCard: { marginTop: -40 },
  section: {
    backgroundColor: Colors.white, marginHorizontal: 16, marginBottom: 12,
    borderRadius: Radius.xl, padding: 16, ...Shadows.sm,
  },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: Colors.foreground },
  addressName: { fontSize: 14, fontWeight: '600', color: Colors.foreground, marginLeft: 28 },
  addressText: { fontSize: 14, color: Colors.mutedForeground, marginLeft: 28, marginTop: 4 },
  cartItemRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, marginLeft: 28 },
  itemImageDummy: { width: 40, height: 40, borderRadius: Radius.sm, backgroundColor: Colors.inputBackground, marginRight: 12 },
  itemInfo: { flex: 1 },
  cartItemName: { fontSize: 14, fontWeight: '600', color: Colors.foreground },
  cartItemQty: { fontSize: 13, color: Colors.mutedForeground, marginTop: 4 },
  cartItemPrice: { fontSize: 14, fontWeight: '600', color: Colors.primaryDark },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12, marginLeft: 28 },
  summaryLabel: { fontSize: 14, color: Colors.mutedForeground },
  summaryValue: { fontSize: 14, color: Colors.foreground, fontWeight: '500' },
  summaryTotal: { borderTopWidth: 1, borderTopColor: Colors.borderLight, paddingTop: 16, flexDirection: 'row', justifyContent: 'space-between', marginLeft: 28 },
  summaryTotalLabel: { fontSize: 16, fontWeight: '700', color: Colors.primaryDark },
  summaryTotalValue: { fontSize: 18, fontWeight: '800', color: Colors.primaryDark },
  errorText: { textAlign: 'center', marginTop: 60, fontSize: 16, color: Colors.mutedForeground },
  bottomBar: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 16, paddingVertical: 14, backgroundColor: Colors.background,
    borderTopWidth: 1, borderTopColor: Colors.borderLight,
  },
  btnAction: { flex: 1, flexDirection: 'row', paddingVertical: 14, borderRadius: Radius.md, justifyContent: 'center', alignItems: 'center' },
  btnCancel: { backgroundColor: Colors.danger },
  btnReorder: { backgroundColor: Colors.primaryDark },
  btnCancelText: { color: Colors.white, fontWeight: '700', fontSize: 15 },
  btnText: { color: Colors.white, fontWeight: '700', fontSize: 15 },
});