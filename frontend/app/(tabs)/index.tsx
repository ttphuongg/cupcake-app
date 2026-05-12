/**
 * app/(tabs)/index.tsx — Màn hình trang chủ
 * Data: useProductStore + useCartStore (không dùng AppContext)
 */
import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Platform, Dimensions, FlatList, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter, Link } from 'expo-router';
import { Search, ShoppingBag, Plus, Minus, ArrowLeft } from 'lucide-react-native';
import Animated, {
  BounceIn, ZoomIn, ZoomOut,
  useSharedValue, withSpring, useAnimatedStyle,
} from 'react-native-reanimated';

import { useProductStore } from '../../store/productStore';
import { useCartStore } from '../../store/cartStore';
import { BannerCarousel } from '../../components/BannerCarousel';
import { CategoryGrid } from '../../components/CategoryGrid';
import { FlyingDot } from '../../components/FlyingDot';
import { BANNERS } from '../../constants/banners';
import { Colors, Radius, Shadows } from '@/constants/theme';

const { width } = Dimensions.get('window');
type SortType = 'popular' | 'price-asc' | 'price-desc';

// ─── Home Screen ─────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { products, isLoading: isLoadingProducts, fetchProducts, categories, fetchCategories } = useProductStore();
  const { cartItems, addItemToCart, updateQuantity, removeItem } = useCartStore();

  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [sortType, setSortType] = useState<SortType>('popular');
  const [flyingDots, setFlyingDots] = useState<{ id: number; startX: number; startY: number }[]>([]);
  const cartScale = useSharedValue(1);

  const cartTargetX = width - 54;
  const cartTargetY = Dimensions.get('window').height - (Platform.OS === 'ios' ? 130 : 110);

  useEffect(() => {
    // Load categories một lần khi mount
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
  const animatedCart = useAnimatedStyle(() => ({ transform: [{ scale: cartScale.value }] }));

  return (
    <SafeAreaView style={[styles.container, searchQuery ? styles.containerSearchResults : null]}>
      {/* SEARCH */}
      <View style={[styles.searchHeader, searchQuery ? styles.searchHeaderResults : null]}>
        {searchQuery ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <TouchableOpacity onPress={() => router.setParams({ search: '' })}>
              <ArrowLeft color={Colors.foreground} size={24} />
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.9} onPress={() => router.push('/search' as any)} style={[styles.searchBar, styles.searchBarResults, { flex: 1 }]}>
              <Search color={Colors.mutedForeground} size={20} style={styles.searchIcon} />
              <Text style={[styles.searchText, { color: Colors.foreground }]} numberOfLines={1}>{searchQuery}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity activeOpacity={0.9} onPress={() => router.push('/search' as any)} style={styles.searchBar}>
            <Search color={Colors.mutedForeground} size={20} style={styles.searchIcon} />
            <Text style={styles.searchText}>Tìm kiếm bánh cupcake...</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={displayProducts}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        contentContainerStyle={styles.scrollContent}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            {!searchQuery && (
              <Animated.View entering={BounceIn}>
                <View style={{ marginTop: 24 }}>
                  <BannerCarousel banners={BANNERS} />
                  <CategoryGrid
                    data={categories}
                    selectedCategory={selectedCategory}
                    onCategorySelect={setSelectedCategory}
                  />
                </View>
              </Animated.View>
            )}
            <View style={styles.filterContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
                {([{ id: 'popular', label: 'Phổ biến' }, { id: 'rating', label: 'Đánh giá' }, { id: 'price-asc', label: 'Giá thấp' }, { id: 'price-desc', label: 'Giá cao' }] as { id: SortType | 'rating'; label: string }[]).map((f) => {
                  const active = sortType === f.id;
                  return (
                    <TouchableOpacity key={f.id} onPress={() => f.id !== 'rating' && setSortType(f.id as SortType)} style={[styles.filterButton, active ? styles.filterActive : styles.filterInactive]}>
                      <Text style={[styles.filterText, active ? styles.filterTextOn : styles.filterTextOff]}>{f.label}</Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          </>
        }
        renderItem={({ item: p, index: i }) => {
          const qty = getCartQty(p.id ?? 0);
          return (
            <Animated.View entering={BounceIn.delay((i % 6) * 50)} style={styles.productCard}>
              <Link href={`/product/${p.id}` as any} asChild>
                <TouchableOpacity activeOpacity={0.8} style={styles.imageContainer}>
                  <Image source={{ uri: p.image ?? undefined }} style={styles.productImage} />
                </TouchableOpacity>
              </Link>
              <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={2}>{p.name}</Text>
                <View style={styles.productFooter}>
                  <Text style={styles.productPrice}>{p.price.toLocaleString()}đ</Text>
                  {qty === 0 ? (
                    <TouchableOpacity activeOpacity={0.7} onPress={(e) => handleAdd(p.id ?? 0, e)} style={styles.addButton}>
                      <Plus color={Colors.white} size={18} strokeWidth={3} />
                    </TouchableOpacity>
                  ) : (
                    <View style={styles.qtyControl}>
                      <TouchableOpacity activeOpacity={0.7} onPress={(e) => handleQty(p.id ?? 0, -1, e)} style={styles.ctrlBtn}>
                        <Minus color={Colors.white} size={14} strokeWidth={3} />
                      </TouchableOpacity>
                      <Text style={styles.qtyText}>{qty}</Text>
                      <TouchableOpacity activeOpacity={0.7} onPress={(e) => handleQty(p.id ?? 0, 1, e)} style={styles.ctrlBtn}>
                        <Plus color={Colors.white} size={14} strokeWidth={3} />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
            </Animated.View>
          );
        }}
        ListFooterComponent={isLoadingProducts ? <View style={styles.loader}><ActivityIndicator size="small" color="#FF6B81" /></View> : null}
      />

      {/* FLOATING CART */}
      {cartTotal > 0 && (
        <Animated.View entering={ZoomIn} exiting={ZoomOut} style={styles.floatingCartWrap}>
          <Link href={'/cart' as any} asChild>
            <TouchableOpacity activeOpacity={0.8}>
              <Animated.View style={[styles.floatingCart, animatedCart]}>
                <ShoppingBag color="#FFF" size={24} />
                <View style={styles.badge}><Text style={styles.badgeText}>{cartTotal}</Text></View>
              </Animated.View>
            </TouchableOpacity>
          </Link>
        </Animated.View>
      )}

      {/* FLYING DOTS */}
      {flyingDots.map((dot) => (
        <FlyingDot key={dot.id} startX={dot.startX - 11} startY={dot.startY - 11} targetX={cartTargetX} targetY={cartTargetY} onComplete={() => setFlyingDots((p) => p.filter((d) => d.id !== dot.id))} />
      ))}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  containerSearchResults: { backgroundColor: Colors.white },
  searchHeader: { backgroundColor: Colors.primary, borderBottomLeftRadius: 40, borderBottomRightRadius: 40, paddingHorizontal: 24, paddingTop: Platform.OS === 'android' ? 48 : 12, paddingBottom: 40, elevation: 5, zIndex: 100 },
  searchHeaderResults: { backgroundColor: Colors.white, borderRadius: 0, paddingBottom: 16, elevation: 0, borderBottomWidth: 1, borderBottomColor: Colors.border },
  searchBar: { backgroundColor: Colors.white, borderRadius: Radius.xxl, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, ...Shadows.sm },
  searchBarResults: { backgroundColor: '#FDF3F6', elevation: 0, shadowOpacity: 0 },
  searchIcon: { marginRight: 12 },
  searchText: { color: Colors.mutedForeground, fontSize: 14, fontWeight: '500', flex: 1 },
  scrollContent: { paddingBottom: 100 },
  loader: { paddingVertical: 24, alignItems: 'center' },
  columnWrapper: { paddingHorizontal: 20, justifyContent: 'space-between' },
  filterContainer: { marginVertical: 16 },
  filterScroll: { paddingHorizontal: 24, gap: 8, alignItems: 'center' },
  filterButton: { paddingHorizontal: 18, paddingVertical: 8, borderRadius: Radius.full },
  filterActive: { backgroundColor: Colors.primary, ...Shadows.sm },
  filterInactive: { backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.border },
  filterText: { fontSize: 13, fontWeight: '700' },
  filterTextOn: { color: Colors.white },
  filterTextOff: { color: Colors.foreground },
  productCard: { width: (width - 56) / 2, backgroundColor: Colors.white, borderRadius: Radius.md, marginBottom: 16, ...Shadows.sm, borderColor: Colors.borderLight, borderWidth: 1, overflow: 'hidden' },
  imageContainer: { width: '100%', aspectRatio: 1, backgroundColor: '#FDF3F6' },
  productImage: { width: '100%', height: '100%' },
  productInfo: { padding: 12, flex: 1 },
  productName: { fontSize: 13, fontWeight: '700', color: Colors.foreground, minHeight: 36, lineHeight: 18 },
  productFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 },
  productPrice: { fontSize: 15, fontWeight: '900', color: Colors.primary },
  addButton: { width: 32, height: 32, backgroundColor: Colors.primary, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  qtyControl: { flexDirection: 'row', alignItems: 'center' },
  ctrlBtn: { width: 24, height: 24, backgroundColor: Colors.primary, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  qtyText: { fontSize: 12, fontWeight: '900', color: Colors.primaryDark, marginHorizontal: 6, minWidth: 16, textAlign: 'center' },
  floatingCartWrap: { position: 'absolute', bottom: Platform.OS === 'ios' ? 100 : 80, right: 24, zIndex: 110 },
  floatingCart: { width: 60, height: 60, backgroundColor: Colors.primary, borderRadius: 30, alignItems: 'center', justifyContent: 'center', ...Shadows.md },
  flyingDot: { position: 'absolute', top: 0, left: 0, width: 22, height: 22, backgroundColor: Colors.primary, borderRadius: 11, borderWidth: 2, borderColor: Colors.white, alignItems: 'center', justifyContent: 'center', zIndex: 9999, elevation: 999 },
  badge: { position: 'absolute', top: -4, right: -4, backgroundColor: Colors.white, width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
  badgeText: { color: Colors.primaryDark, fontSize: 11, fontWeight: '900' },
});
