import { useEffect } from 'react';
import { useSharedValue, withSpring, withSequence } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { useProductStore } from '../store/productStore';
import { useCartStore } from '../store/cartStore';

export function useProductDetailLogic(id: string | string[] | undefined) {
  const router = useRouter();
  const { currentProduct: product, isLoading, getProductById } = useProductStore();
  const { cartItems, addItemToCart, updateQuantity, removeItem } = useCartStore();

  const cartScale = useSharedValue(1);

  useEffect(() => {
    if (id) getProductById(id as string);
  }, [id]);

  const productId = product?.id ?? 0;
  const cartItem = cartItems.find((item) => item.product_id === productId);
  const quantityInCart = cartItem?.quantity ?? 0;

  const handleAction = (qty: number, isIncrease: boolean) => {
    if (quantityInCart === 0 && qty > 0) {
      addItemToCart({ productId, quantity: 1 });
    } else if (cartItem?.id) {
      const newQty = quantityInCart + qty;
      if (newQty <= 0) {
        removeItem(cartItem.id);
      } else {
        updateQuantity(cartItem.id, newQty);
      }
    }

    if (isIncrease) {
      cartScale.value = withSequence(withSpring(1.3), withSpring(1));
    }
  };

  const displayPrice = (product?.price ?? 0) * (quantityInCart > 0 ? quantityInCart : 1);
  const totalCartItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return {
    router,
    product,
    isLoading,
    cartScale,
    quantityInCart,
    displayPrice,
    totalCartItems,
    handleAction,
  };
}
