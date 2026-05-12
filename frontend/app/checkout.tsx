/**
 * app/checkout.tsx — Màn hình Thanh toán
 * Logic: useCartStore (lấy giỏ hàng thật), useAuthStore (prefill địa chỉ),
 *        useOrderStore (setShippingInfo + createOrder)
 * Đổi icon: lucide-react-native thay Ionicons
 */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft, MapPin, Clock, CreditCard, StickyNote, ShoppingBag, Store, Ticket } from 'lucide-react-native';
import { Colors, Radius, Shadows } from '@/constants/theme';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { useOrderStore } from '../store/orderStore';
import { Image } from 'expo-image';

type PaymentMethod = 'COD' | 'BANKING' | 'MOMO';

const PAYMENT_METHODS: Array<{ key: PaymentMethod; label: string; icon: string }> = [
  { key: 'COD',     label: 'Thanh toán khi nhận hàng', icon: '💵' },
  { key: 'BANKING', label: 'Chuyển khoản ngân hàng',  icon: '🏦' },
  { key: 'MOMO',    label: 'Ví MoMo',                 icon: '🟣' },
];

export default function CheckoutScreen() {
  const router = useRouter();
  const { cartItems, totalAmount, isLoading: cartLoading, fetchCart } = useCartStore();
  const { user } = useAuthStore();
  const { setShippingInfo, createOrder, clearCurrentOrder, isLoading: orderLoading } = useOrderStore();

  // Pre-fill từ authStore.user
  const [phone, setPhone]         = useState(user?.phone ?? '');
  const [address, setAddress]     = useState(user?.address ?? '');
  const [note, setNote]           = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('COD');
  const [errors, setErrors]       = useState<Record<string, boolean>>({});
  const [errorMessages, setErrorMessages] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchCart();
  }, []);

  // Sync với store khi user thay đổi input
  useEffect(() => {
    setShippingInfo({ phone, address, note, paymentMethod });
  }, [phone, address, note, paymentMethod]);

  const validate = (): boolean => {
    const newErrors: Record<string, boolean> = {};
    const newMsgs: Record<string, string> = {};

    const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
    if (!phone) {
      newErrors.phone = true;
      newMsgs.phone = 'Vui lòng nhập số điện thoại';
    } else if (!phoneRegex.test(phone)) {
      newErrors.phone = true;
      newMsgs.phone = 'Số điện thoại không hợp lệ';
    }
    if (!address.trim()) {
      newErrors.address = true;
      newMsgs.address = 'Vui lòng nhập địa chỉ giao hàng';
    }

    setErrors(newErrors);
    setErrorMessages(newMsgs);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      Alert.alert('Giỏ hàng trống', 'Vui lòng thêm sản phẩm vào giỏ hàng trước khi đặt hàng.');
      return;
    }
    if (!validate()) return;

    try {
      const result = await createOrder();
      clearCurrentOrder();
      if (Platform.OS === 'web') {
        window.alert('Đặt hàng thành công!');
        router.replace('/order');
      } else {
        Alert.alert(
          'Đặt hàng thành công! 🎉',
          `Đơn hàng #${result.id ?? ''} đã được xác nhận. Chúng tôi sẽ giao hàng sớm nhất!`,
          [{ text: 'Xem đơn hàng', onPress: () => router.replace('/order') }],
          { cancelable: false },
        );
      }
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        (err instanceof Error ? err.message : 'Đặt hàng thất bại');
      Alert.alert('Lỗi', msg);
    }
  };

  const isLoading = cartLoading || orderLoading;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ChevronLeft size={26} color={Colors.foreground} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Xác nhận đơn hàng</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Địa chỉ giao hàng */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MapPin size={20} color={Colors.primaryDark} />
            <Text style={styles.sectionTitle}>Địa chỉ giao hàng</Text>
            <TouchableOpacity style={{ marginLeft: 'auto' }}>
              <Text style={styles.changeText}>Thay đổi</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.addressName}>{user?.name || 'daf'} | {phone || '090xxxxxxx'}</Text>
          <TextInput
            style={[styles.input, styles.inputMultiline, errors.address && styles.inputError]}
            value={address}
            onChangeText={(t) => {
              setAddress(t);
              if (errors.address) setErrors((p) => ({ ...p, address: false }));
            }}
            placeholder="Nhập địa chỉ nhận hàng chi tiết..."
            multiline
          />
          {errorMessages.address ? <Text style={styles.errorText}>{errorMessages.address}</Text> : null}
        </View>

        {/* Thời gian nhận hàng */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Clock size={20} color={Colors.mutedForeground} />
            <Text style={styles.sectionTitle}>Thời gian nhận hàng</Text>
            <View style={styles.estDelivery}>
              <Text style={styles.estDeliveryText}>DỰ KIẾN GIAO: 22:24</Text>
            </View>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillRow}>
            <TouchableOpacity style={[styles.pill, styles.pillActive]}>
              <Text style={[styles.pillText, styles.pillTextActive]}>Hôm nay</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.pill}>
              <Text style={styles.pillText}>Ngày mai</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.pill}>
              <Text style={styles.pillText}>Ngày kia</Text>
            </TouchableOpacity>
          </ScrollView>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillRow}>
            <TouchableOpacity style={[styles.pillOutline, styles.pillOutlineActive]}>
              <Text style={[styles.pillText, styles.pillTextActiveOutline]}>Giao ngay</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.pillOutline}>
              <Text style={styles.pillText}>09:00</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.pillOutline}>
              <Text style={styles.pillText}>11:00</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.pillOutline}>
              <Text style={styles.pillText}>13:00</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Tiệm bánh Candy */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Store size={20} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Tiệm Bánh Candy ✨</Text>
          </View>
          {cartItems.map((item) => (
            <View key={item.id} style={styles.cartItemRow}>
              <Image source={{ uri: item.product?.image ?? undefined }} style={styles.itemImage} />
              <View style={styles.itemInfo}>
                <Text style={styles.cartItemName} numberOfLines={1}>
                  {item.product?.name ?? 'Bánh custom'}
                </Text>
                <Text style={styles.cartItemQty}>x{item.quantity}</Text>
              </View>
              <Text style={styles.cartItemPrice}>
                {Number((item.price ?? item.product?.price ?? 0)).toLocaleString('vi-VN')}đ
              </Text>
            </View>
          ))}
        </View>

        {/* Voucher */}
        <View style={styles.section}>
          <View style={styles.voucherRow}>
            <Ticket size={20} color={Colors.mutedForeground} />
            <Text style={styles.sectionTitle}>Voucher</Text>
            <TextInput style={styles.voucherInput} placeholder="Nhập mã giảm giá..." />
            <TouchableOpacity>
              <Text style={styles.applyText}>Áp dụng</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Phương thức thanh toán */}
        <View style={styles.section}>
          <View style={styles.paymentHeaderRow}>
            <CreditCard size={20} color={Colors.mutedForeground} />
            <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>
            <TouchableOpacity style={{ marginLeft: 'auto' }}>
              <Text style={styles.changeText}>Tiền mặt &gt;</Text>
            </TouchableOpacity>
          </View>
        </View>



        {/* Tổng cộng */}
        <View style={styles.summarySection}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tạm tính</Text>
            <Text style={styles.summaryValue}>{totalAmount.toLocaleString('vi-VN')}đ</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Phí vận chuyển</Text>
            <Text style={styles.summaryFree}>Miễn phí</Text>
          </View>
          <View style={[styles.summaryRow, styles.summaryTotal]}>
            <Text style={styles.summaryTotalLabel}>Tổng cộng</Text>
            <Text style={styles.summaryTotalValue}>{totalAmount.toLocaleString('vi-VN')}đ</Text>
          </View>
        </View>
      </ScrollView>

      {/* Footer CTA */}
      <View style={styles.footer}>
        <View style={styles.footerInfo}>
          <Text style={styles.footerTotalLabel}>TỔNG THANH TOÁN</Text>
          <Text style={styles.footerTotalValue}>{(totalAmount + 15000).toLocaleString('vi-VN')}đ</Text>
        </View>
        <TouchableOpacity
          style={[styles.orderBtn, isLoading && { opacity: 0.7 }]}
          onPress={handlePlaceOrder}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.orderBtnText}>Đặt hàng ngay</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12, backgroundColor: Colors.white,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
    paddingTop: Platform.OS === 'android' ? 44 : 12,
  },
  backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: Colors.foreground },
  scrollView: { flex: 1 },
  section: {
    backgroundColor: Colors.white,
    borderBottomWidth: 1, borderBottomColor: Colors.borderLight,
    padding: 16,
  },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: Colors.foreground },
  changeText: { fontSize: 13, color: Colors.primaryDark },
  addressName: { fontSize: 14, fontWeight: '600', color: Colors.foreground, marginLeft: 28, marginBottom: 4 },
  input: {
    backgroundColor: Colors.inputBackground, borderRadius: Radius.sm, padding: 12,
    fontSize: 14, color: Colors.foreground, marginLeft: 28,
  },
  inputMultiline: { height: 60, textAlignVertical: 'top' },
  inputError: { borderColor: Colors.danger, borderWidth: 1 },
  errorText: { color: Colors.danger, fontSize: 12, marginTop: 4, marginLeft: 28 },
  estDelivery: { backgroundColor: Colors.primaryAlpha10, paddingHorizontal: 8, paddingVertical: 4, borderRadius: Radius.sm, marginLeft: 'auto' },
  estDeliveryText: { color: Colors.primaryDark, fontSize: 10, fontWeight: '700' },
  pillRow: { gap: 10, marginBottom: 12, paddingLeft: 28 },
  pill: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: Radius.xl, backgroundColor: Colors.inputBackground },
  pillActive: { backgroundColor: Colors.primaryDark },
  pillOutline: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: Radius.xl, borderWidth: 1, borderColor: Colors.border },
  pillOutlineActive: { borderColor: Colors.primaryDark, backgroundColor: Colors.primaryAlpha10 },
  pillText: { fontSize: 13, color: Colors.foreground },
  pillTextActive: { color: Colors.white, fontWeight: '600' },
  pillTextActiveOutline: { color: Colors.primaryDark, fontWeight: '600' },
  cartItemRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, marginLeft: 28 },
  itemImage: { width: 50, height: 50, borderRadius: Radius.sm, backgroundColor: Colors.inputBackground, marginRight: 12 },
  itemInfo: { flex: 1 },
  cartItemName: { fontSize: 14, fontWeight: '600', color: Colors.foreground },
  cartItemQty: { fontSize: 13, color: Colors.mutedForeground, marginTop: 4 },
  cartItemPrice: { fontSize: 14, fontWeight: '600', color: Colors.primaryDark },
  voucherRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  voucherInput: { flex: 1, backgroundColor: Colors.inputBackground, borderRadius: Radius.sm, padding: 10, fontSize: 13, marginLeft: 8 },
  applyText: { fontSize: 14, color: Colors.primaryDark, fontWeight: '600', paddingHorizontal: 8 },
  paymentHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  summarySection: {
    backgroundColor: Colors.white, padding: 16, marginBottom: 16,
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  summaryLabel: { fontSize: 14, color: Colors.textSecondary },
  summaryValue: { fontSize: 14, color: Colors.foreground, fontWeight: '500' },
  summaryFree: { fontSize: 14, color: Colors.foreground, fontWeight: '500' },
  summaryTotal: { borderTopWidth: 1, borderTopColor: Colors.borderLight, paddingTop: 16, marginBottom: 0 },
  summaryTotalLabel: { fontSize: 16, fontWeight: '700', color: Colors.foreground },
  summaryTotalValue: { fontSize: 18, fontWeight: '800', color: Colors.primaryDark },
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