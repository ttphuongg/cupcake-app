import { formatCurrency } from '../../utils/formatters';
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { ZoomIn, ZoomOut } from 'react-native-reanimated';
import { ShoppingCart } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, Radius, Shadows } from '@/constants/theme';

interface ProductBottomBarProps {
  animatedCartStyle: any;
  totalCartItems: number;
  displayPrice: number;
  quantityInCart: number;
  handleAction: (qty: number, isIncrease: boolean) => void;
}

export const ProductBottomBar: React.FC<ProductBottomBarProps> = ({
  animatedCartStyle,
  totalCartItems,
  displayPrice,
  quantityInCart,
  handleAction,
}) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
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
          <Text style={styles.totalPrice}>{formatCurrency(displayPrice)}</Text>
        </View>

        <TouchableOpacity onPress={() => handleAction(1, true)} style={styles.bottomAddBtn}>
          <Text style={styles.bottomAddBtnText}>
            {quantityInCart > 0 ? `Thêm tiếp (+${quantityInCart})` : 'Thêm vào giỏ'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#FFF', borderTopWidth: 1, borderColor: '#E5E7EB',
    shadowColor: '#000', shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.05, shadowRadius: 20, elevation: 10,
  },
  bottomBarContent: {
    flexDirection: 'row', alignItems: 'center', gap: 16,
    paddingHorizontal: 16, paddingTop: 16,
  },
  cartIconContainer: { padding: 8, position: 'relative' },
  cartBadge: {
    position: 'absolute', top: 0, right: 0,
    backgroundColor: Colors.primary, width: 20, height: 20,
    borderRadius: 10, borderWidth: 2, borderColor: Colors.white,
    alignItems: 'center', justifyContent: 'center',
  },
  cartBadgeText: { color: Colors.white, fontSize: 10, fontWeight: 'bold' },
  totalInfo: { flex: 1 },
  totalLabel: { fontSize: 10, color: Colors.textSecondary, fontWeight: 'bold', textTransform: 'uppercase' },
  totalPrice: { fontSize: 20, fontWeight: '900', color: Colors.primary },
  bottomAddBtn: {
    backgroundColor: Colors.primary, paddingHorizontal: 24, paddingVertical: 14,
    borderRadius: Radius.md, ...Shadows.sm,
  },
  bottomAddBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },
});
