/**
 * app/cart.tsx — Màn hình Giỏ hàng
 * Data: useCartStore | Component: CartItemCard
 */
import React, { useEffect } from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity,
  ScrollView, StatusBar, Platform, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, ShoppingBag } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useCartStore } from '../store/cartStore';
import { CartItemCard } from '../components/CartItemCard';
import { Colors, Radius, Shadows } from '../constants/theme';

export default function CartScreen() {
  const router = useRouter();
  const { cartItems, totalAmount, isLoading, fetchCart, updateQuantity, removeItem } = useCartStore();

  useEffect(() => { fetchCart(); }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={Colors.foreground} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Giỏ hàng ({cartItems.length})</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* LOADING */}
      {isLoading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator color={Colors.primary} size="large" />
        </View>
      )}

      {/* DANH SÁCH */}
      {!isLoading && (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {cartItems.length === 0 ? (
            <View style={styles.emptyContainer}>
              <ShoppingBag size={64} color={Colors.borderLight} />
              <Text style={styles.emptyText}>Giỏ hàng trống</Text>
              <TouchableOpacity onPress={() => router.back()} style={styles.shopNowBtn}>
                <Text style={styles.shopNowText}>Mua ngay</Text>
              </TouchableOpacity>
            </View>
          ) : (
            cartItems.map((item) => (
              <CartItemCard
                key={item.id}
                item={item}
                onIncrease={() => item.id && updateQuantity(item.id, item.quantity + 1)}
                onDecrease={() => {
                  if (!item.id) return;
                  item.quantity <= 1
                    ? removeItem(item.id)
                    : updateQuantity(item.id, item.quantity - 1);
                }}
                onRemove={() => item.id && removeItem(item.id)}
              />
            ))
          )}
        </ScrollView>
      )}

      {/* FOOTER THANH TOÁN */}
      {cartItems.length > 0 && !isLoading && (
        <View style={styles.footer}>
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Tổng: </Text>
            <Text style={styles.totalAmount}>{totalAmount.toLocaleString()}đ</Text>
          </View>
          <TouchableOpacity
            style={styles.checkoutBtn}
            onPress={() => router.push('/checkout' as any)}
          >
            <Text style={styles.checkoutText}>Thanh toán ({cartItems.length})</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.card,
    paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: 0.5, borderBottomColor: Colors.borderLight,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  backButton: { paddingRight: 16 },
  headerTitle: { flex: 1, fontSize: 18, fontWeight: '600', color: Colors.foreground },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { paddingBottom: 100 },
  emptyContainer: { alignItems: 'center', marginTop: 100 },
  emptyText: { marginTop: 16, color: Colors.mutedForeground, fontSize: 16 },
  shopNowBtn: {
    marginTop: 20, paddingHorizontal: 30, paddingVertical: 10,
    borderWidth: 1, borderColor: Colors.primary, borderRadius: Radius.md,
  },
  shopNowText: { color: Colors.primary, fontWeight: '500' },
  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    height: 60, backgroundColor: Colors.card,
    flexDirection: 'row', alignItems: 'center',
    borderTopWidth: 0.5, borderTopColor: Colors.borderLight,
  },
  totalContainer: {
    flex: 1, flexDirection: 'row',
    justifyContent: 'flex-start', paddingHorizontal: 16, alignItems: 'center', gap: 8,
  },
  totalLabel: { fontSize: 13, color: Colors.textSecondary },
  totalAmount: { fontSize: 18, fontWeight: 'bold', color: Colors.primaryDark },
  checkoutBtn: {
    backgroundColor: Colors.primary, height: '100%',
    paddingHorizontal: 30, justifyContent: 'center', alignItems: 'center',
  },
  checkoutText: { color: Colors.white, fontWeight: 'bold', fontSize: 15 },
});