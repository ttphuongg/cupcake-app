import { useEffect, useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { useOrderStore } from '../store/orderStore';
import { useCartStore } from '../store/cartStore';
import { reviewService } from '../api/reviewService';

export function useOrderDetailLogic() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { currentOrderDetail, isLoading, fetchOrderById, cancelOrder, reorder } = useOrderStore();
  const { fetchCart } = useCartStore();

  const [hasReviewed, setHasReviewed] = useState(false);

  useEffect(() => {
    if (id) fetchOrderById(id);
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      if (currentOrderDetail && currentOrderDetail.status === 'COMPLETED' && currentOrderDetail.items?.[0]?.product_id) {
        reviewService.checkReview(currentOrderDetail.items[0].product_id, currentOrderDetail.id).then(res => {
          setHasReviewed(res.hasReviewed);
        }).catch(console.error);
      }
    }, [currentOrderDetail])
  );

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

  return {
    router,
    currentOrderDetail,
    isLoading,
    hasReviewed,
    handleCancelOrder,
    handleReorder,
  };
}
