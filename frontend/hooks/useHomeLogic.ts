import { useState, useEffect } from 'react';
import { Dimensions, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSharedValue, withSpring } from 'react-native-reanimated';
import { useShallow } from 'zustand/react/shallow';
import { useProductStore } from '../store/productStore';
import { useCartStore } from '../store/cartStore';

const { width } = Dimensions.get('window');
type SortType = 'popular' | 'price-asc' | 'price-desc';

export function useHomeLogic() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const { products, isLoadingProducts, fetchProducts, categories, fetchCategories } = useProductStore(
    useShallow((state) => ({
      products: state.products,
      isLoadingProducts: state.isLoading,
      fetchProducts: state.fetchProducts,
      categories: state.categories,
      fetchCategories: state.fetchCategories,
    }))
  );
  
  const { cartItems, addItemToCart, updateQuantity, removeItem } = useCartStore(
    useShallow((state) => ({
      cartItems: state.cartItems,
      addItemToCart: state.addItemToCart,
      updateQuantity: state.updateQuantity,
      removeItem: state.removeItem,
    }))
  );

  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [sortType, setSortType] = useState<SortType>('popular');
  const [flyingDots, setFlyingDots] = useState<{ id: number; startX: number; startY: number }[]>([]);
  const cartScale = useSharedValue(1);

  const cartTargetX = width - 54;
  const cartTargetY = Dimensions.get('window').height - (Platform.OS === 'ios' ? 130 : 110);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts(
      selectedCategory !== null ? { categoryId: selectedCategory } : undefined,
    );
  }, [selectedCategory]);

  const getCartQty = (productId: number) =>
    cartItems.find((i) => i.product_id === productId)?.quantity ?? 0;

  const bounceCart = () => {
    cartScale.value = withSpring(1.4, {}, () => { cartScale.value = withSpring(1); });
  };

  const createDot = (x: number, y: number) =>
    setFlyingDots((prev) => [...prev, { id: Date.now(), startX: x, startY: y }]);

  const handleAdd = (productId: number, e: { nativeEvent: { pageX: number; pageY: number } }) => {
    addItemToCart({ productId, quantity: 1 });
    bounceCart();
    createDot(e.nativeEvent.pageX, e.nativeEvent.pageY);
  };

  const handleQty = (
    productId: number,
    delta: number,
    e?: { nativeEvent: { pageX: number; pageY: number } },
  ) => {
    const item = cartItems.find((i) => i.product_id === productId);
    if (!item?.id) return;
    const next = item.quantity + delta;
    if (next <= 0) { removeItem(item.id); } else { updateQuantity(item.id, next); }
    if (delta > 0) { bounceCart(); if (e) createDot(e.nativeEvent.pageX, e.nativeEvent.pageY); }
  };

  const searchQuery = (params.search as string) || '';

  const displayProducts = [...products]
    .filter((p) => {
      const matchS = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchC = selectedCategory === null || p.category_id === selectedCategory;
      return matchS && matchC;
    })
    .sort((a, b) => {
      if (sortType === 'price-asc') return a.price - b.price;
      if (sortType === 'price-desc') return b.price - a.price;
      return 0;
    });

  const cartTotal = cartItems.reduce((s, i) => s + i.quantity, 0);

  return {
    router,
    searchQuery,
    displayProducts,
    categories,
    selectedCategory, setSelectedCategory,
    sortType, setSortType,
    isLoadingProducts,
    cartTotal,
    cartScale,
    flyingDots, setFlyingDots,
    cartTargetX, cartTargetY,
    getCartQty,
    handleAdd,
    handleQty,
  };
}
