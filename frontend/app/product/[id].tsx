import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, ShoppingCart, Star, Share2, Plus, Minus } from 'lucide-react-native';
import Animated, { ZoomIn, ZoomOut, useSharedValue, useAnimatedStyle, withSpring, withSequence } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useProductStore } from '../../store/productStore';
import { useCartStore } from '../../store/cartStore';
import { Review } from '../../types';
import { Colors, Radius, Shadows } from '../../constants/theme';

const { width } = Dimensions.get('window');

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { currentProduct: product, isLoading, getProductById } = useProductStore();
  const { cartItems, addItemToCart, updateQuantity, removeItem } = useCartStore();

  const cartScale = useSharedValue(1);

  useEffect(() => {
    if (id) getProductById(id as string);
  }, [id]);

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.notFoundText}>Không tìm thấy sản phẩm</Text>
      </View>
    );
  }

  const productId = product.id ?? 0;
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
      cartScale.value = withSequence(
        withSpring(1.3),
        withSpring(1)
      );
    }
  };

  const animatedCartStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cartScale.value }],
  }));

  const displayPrice = product.price * (quantityInCart > 0 ? quantityInCart : 1);
  const totalCartItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* HEADER IMAGE */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: product.image ?? undefined }} style={styles.image} contentFit="cover" />
          <View style={[styles.headerButtons, { top: insets.top || 20 }]}>
            <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
              <ArrowLeft color="#111827" size={20} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Share2 color="#111827" size={20} />
            </TouchableOpacity>
          </View>
        </View>

        {/* THÔNG TIN SẢN PHẨM */}
        <View style={styles.infoContainer}>
          <View style={styles.titleRow}>
            <Text style={styles.productName}>{product.name}</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>BÁN CHẠY</Text>
            </View>
          </View>

          <Text style={styles.description}>{product.description}</Text>

          <View style={styles.priceRow}>
            <View>
              <View style={styles.ratingRow}>
                <Star color="#FFD700" fill="#FFD700" size={14} />
                <Text style={styles.ratingText}>4.9</Text>
                <Text style={styles.ratingCount}>(120+)</Text>
              </View>
              <Text style={styles.price}>{product.price.toLocaleString('vi-VN')}đ</Text>
            </View>

            <View style={styles.actionContainer}>
              {quantityInCart === 0 ? (
                <TouchableOpacity onPress={() => handleAction(1, true)} style={styles.addBtn}>
                  <Plus color="#FFF" size={24} strokeWidth={3} />
                </TouchableOpacity>
              ) : (
                <View style={styles.quantityControl}>
                  <TouchableOpacity onPress={() => handleAction(-1, false)} style={styles.qtyBtn}>
                    <Minus color={Colors.primary} size={20} strokeWidth={3} />
                  </TouchableOpacity>
                  <Text style={styles.qtyText}>{quantityInCart}</Text>
                  <TouchableOpacity onPress={() => handleAction(1, true)} style={styles.qtyBtn}>
                    <Plus color={Colors.primary} size={20} strokeWidth={3} />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* PHẦN BÌNH LUẬN */}
        <View style={styles.reviewsContainer}>
          <Text style={styles.reviewsTitle}>Bình luận ({product.reviews?.length || 0})</Text>
          {(product.reviews || []).map((review: Review, idx: number) => (
            <View key={idx} style={[styles.reviewItem, idx === 0 && { borderTopWidth: 0, paddingTop: 0 }]}>
              <View style={styles.avatar} />
              <View style={styles.reviewContent}>
                <View style={styles.reviewHeader}>
                  <Text style={styles.reviewerName}>Ẩn Danh</Text>
                  <View style={styles.starsRow}>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={12} color={i < 4 ? "#FFD700" : "#E5E7EB"} fill={i < 4 ? "#FFD700" : "transparent"} />
                    ))}
                  </View>
                </View>
                <Text style={styles.reviewText}>Ngon</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* STICKY BOTTOM BAR */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom || 20 }]}>
        <View style={styles.bottomBarContent}>
          <Animated.View style={[animatedCartStyle]}>
            <TouchableOpacity onPress={() => router.push('/cart' as any)} style={styles.cartIconContainer}>
              <ShoppingCart color={Colors.primary} size={28} />
              {totalCartItems > 0 && (
                <Animated.View entering={ZoomIn} exiting={ZoomOut} style={styles.cartBadge}>
                  <Text style={styles.cartBadgeText}>{totalCartItems}</Text>
                </Animated.View>
              )}
            </TouchableOpacity>
          </Animated.View>

          <View style={styles.totalInfo}>
            <Text style={styles.totalLabel}>Tổng tạm tính</Text>
            <Text style={styles.totalPrice}>{displayPrice.toLocaleString('vi-VN')}đ</Text>
          </View>

          <TouchableOpacity onPress={() => handleAction(1, true)} style={styles.bottomAddBtn}>
            <Text style={styles.bottomAddBtnText}>
              {quantityInCart > 0 ? `Thêm tiếp (+${quantityInCart})` : 'Thêm vào giỏ'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fdfaf9', // Background color match home.tsx
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notFoundText: {
    color: '#6B7280',
    fontSize: 16,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#E5E7EB',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  headerButtons: {
    position: 'absolute',
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  iconButton: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  infoContainer: {
    backgroundColor: Colors.card,
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderColor: Colors.borderLight,
    borderTopLeftRadius: Radius.xxl,
    borderTopRightRadius: Radius.xxl,
    marginTop: -40,
    ...Shadows.md,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  productName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.foreground,
    flex: 1,
  },
  badge: {
    backgroundColor: Colors.primaryAlpha10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Colors.primaryAlpha20,
  },
  badgeText: {
    color: Colors.primaryDark,
    fontSize: 10,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
    lineHeight: 22,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 16,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  ratingCount: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  price: {
    fontSize: 24,
    fontWeight: '900',
    color: Colors.primary,
  },
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addBtn: {
    backgroundColor: Colors.primary,
    padding: 10,
    borderRadius: Radius.md,
    ...Shadows.sm,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.inputBackground,
    borderRadius: Radius.md,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    gap: 16,
  },
  qtyBtn: {
    // padding: 4,
  },
  qtyText: {
    fontSize: 16,
    fontWeight: 'bold',
    width: 20,
    textAlign: 'center',
  },
  reviewsContainer: {
    backgroundColor: '#FFF',
    marginTop: 8,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  reviewsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  reviewItem: {
    flexDirection: 'row',
    gap: 12,
    paddingTop: 16,
    borderTopWidth: 1,
    borderColor: '#E5E7EB',
  },
  avatar: {
    width: 36,
    height: 36,
    backgroundColor: '#F3F4F6',
    borderRadius: 18,
  },
  reviewContent: {
    flex: 1,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reviewerName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
  },
  starsRow: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewText: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
    lineHeight: 20,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 10,
  },
  bottomBarContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  cartIconContainer: {
    padding: 8,
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: Colors.primary,
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadgeText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  totalInfo: {
    flex: 1,
  },
  totalLabel: {
    fontSize: 10,
    color: Colors.textSecondary,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: '900',
    color: Colors.primary,
  },
  bottomAddBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: Radius.md,
    ...Shadows.sm,
  },
  bottomAddBtnText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
