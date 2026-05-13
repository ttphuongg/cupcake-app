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
import { ChevronLeft } from 'lucide-react-native';
import { Colors } from '@/constants/theme';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { useOrderStore } from '../store/orderStore';
import { useShallow } from 'zustand/react/shallow';
import { 
  AddressSection, DeliveryTimeSection, OrderItemsSection, 
  VoucherSection, PaymentMethodSection, SummarySection, CheckoutFooter 
} from '../components/CheckoutSections';

type PaymentMethod = 'COD' | 'BANKING' | 'MOMO';

const PAYMENT_METHODS: Array<{ key: PaymentMethod; label: string; icon: string }> = [
  { key: 'COD',     label: 'Thanh toán khi nhận hàng', icon: '💵' },
  { key: 'BANKING', label: 'Chuyển khoản ngân hàng',  icon: '🏦' },
  { key: 'MOMO',    label: 'Ví MoMo',                 icon: '🟣' },
];

export default function CheckoutScreen() {
  const router = useRouter();
  
  // Áp dụng useShallow để tránh re-render khi các state khác của cart thay đổi
  const { cartItems, totalAmount, cartLoading, fetchCart } = useCartStore(
    useShallow((state) => ({
      cartItems: state.cartItems,
      totalAmount: state.totalAmount,
      cartLoading: state.isLoading,
      fetchCart: state.fetchCart,
    }))
  );
  
  const user = useAuthStore(useShallow((state) => state.user));
  
  const { setShippingInfo, createOrder, clearCurrentOrder, orderLoading } = useOrderStore(
    useShallow((state) => ({
      setShippingInfo: state.setShippingInfo,
      createOrder: state.createOrder,
      clearCurrentOrder: state.clearCurrentOrder,
      orderLoading: state.isLoading,
    }))
  );

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
        <AddressSection 
          phone={phone} setPhone={setPhone} 
          address={address} setAddress={setAddress} 
          user={user} errors={errors} errorMessages={errorMessages} 
        />
        
        <DeliveryTimeSection />

        <OrderItemsSection cartItems={cartItems} />

        <VoucherSection />

        <PaymentMethodSection />

        <SummarySection totalAmount={totalAmount} />
      </ScrollView>

      <CheckoutFooter 
        totalAmount={totalAmount} 
        isLoading={isLoading} 
        onPlaceOrder={handlePlaceOrder} 
      />
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
});