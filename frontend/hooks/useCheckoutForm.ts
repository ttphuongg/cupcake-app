import { useState, useEffect } from 'react';
import { Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useShallow } from 'zustand/react/shallow';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { useOrderStore } from '../store/orderStore';
import { isValidPhone } from '../utils/validators';

type PaymentMethod = 'COD' | 'BANKING' | 'MOMO';

export function useCheckoutForm() {
  const router = useRouter();

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

  const [phone, setPhone] = useState(user?.phone ?? '');
  const [address, setAddress] = useState(user?.address ?? '');
  const [note, setNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('COD');
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [errorMessages, setErrorMessages] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchCart();
  }, []);

  useEffect(() => {
    setShippingInfo({ phone, address, note, paymentMethod });
  }, [phone, address, note, paymentMethod]);

  const validate = (): boolean => {
    const newErrors: Record<string, boolean> = {};
    const newMsgs: Record<string, string> = {};

    if (!phone) {
      newErrors.phone = true;
      newMsgs.phone = 'Vui lòng nhập số điện thoại';
    } else if (!isValidPhone(phone)) {
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
        router.replace('/orders');
      } else {
        Alert.alert(
          'Đặt hàng thành công! 🎉',
          `Đơn hàng #${result.id ?? ''} đã được xác nhận. Chúng tôi sẽ giao hàng sớm nhất!`,
          [{ text: 'Xem đơn hàng', onPress: () => router.replace('/orders') }],
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

  return {
    router,
    user,
    cartItems,
    totalAmount,
    phone, setPhone,
    address, setAddress,
    note, setNote,
    paymentMethod, setPaymentMethod,
    errors, setErrors,
    errorMessages, setErrorMessages,
    isLoading,
    handlePlaceOrder,
  };
}
