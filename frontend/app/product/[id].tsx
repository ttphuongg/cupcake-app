import React from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useAnimatedStyle } from 'react-native-reanimated';
import { Colors } from '../../constants/theme';
import { useProductDetailLogic } from '../../hooks/useProductDetailLogic';
import { ProductHeader } from '../../components/Product/ProductHeader';
import { ProductInfo } from '../../components/Product/ProductInfo';
import { ProductReviews } from '../../components/Product/ProductReviews';
import { ProductBottomBar } from '../../components/Product/ProductBottomBar';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const {
    router,
    product,
    isLoading,
    cartScale,
    quantityInCart,
    displayPrice,
    totalCartItems,
    handleAction,
  } = useProductDetailLogic(id);

  const animatedCartStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cartScale.value }],
  }));

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

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        <ProductHeader product={product} onBack={() => router.back()} />
        <ProductInfo product={product} quantityInCart={quantityInCart} handleAction={handleAction} />
        <ProductReviews product={product} />
      </ScrollView>

      <ProductBottomBar
        animatedCartStyle={animatedCartStyle}
        totalCartItems={totalCartItems}
        displayPrice={displayPrice}
        quantityInCart={quantityInCart}
        handleAction={handleAction}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fdfaf9' },
  centerContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  notFoundText: { color: '#6B7280', fontSize: 16 },
});
