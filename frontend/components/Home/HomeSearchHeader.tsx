import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Search, ArrowLeft, ShoppingCart } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Radius, Shadows } from '@/constants/theme';
import { useCartStore } from '../../store/cartStore';

interface HomeSearchHeaderProps {
  searchQuery: string;
  router: any;
}

export const HomeSearchHeader: React.FC<HomeSearchHeaderProps> = ({ searchQuery, router }) => {
  const insets = useSafeAreaInsets();
  const cartItems = useCartStore((state) => state.cartItems);
  const cartTotal = cartItems.reduce((s, i) => s + i.quantity, 0);

  const renderCartButton = () => (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => router.push('/cart')}
      style={styles.cartButton}
    >
      <ShoppingCart color={searchQuery ? Colors.primary : Colors.white} size={24} />
      {cartTotal > 0 && (
        <View style={styles.cartBadge}>
          <Text style={styles.cartBadgeText}>{cartTotal > 99 ? '99+' : cartTotal}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.searchHeader, searchQuery ? styles.searchHeaderResults : null, { paddingTop: Math.max(insets.top, 20) + 16 }]}>
      {searchQuery ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <TouchableOpacity onPress={() => router.setParams({ search: '' })}>
            <ArrowLeft color={Colors.foreground} size={24} />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => router.push('/search')}
            style={[styles.searchBar, styles.searchBarResults, { flex: 1 }]}
          >
            <Search color={Colors.mutedForeground} size={20} style={styles.searchIcon} />
            <Text style={[styles.searchText, { color: Colors.foreground }]} numberOfLines={1}>
              {searchQuery}
            </Text>
          </TouchableOpacity>
          {renderCartButton()}
        </View>
      ) : (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
          <TouchableOpacity activeOpacity={0.9} onPress={() => router.push('/search')} style={[styles.searchBar, { flex: 1 }]}>
            <Search color={Colors.mutedForeground} size={20} style={styles.searchIcon} />
            <Text style={styles.searchText}>Tìm kiếm bánh cupcake...</Text>
          </TouchableOpacity>
          {renderCartButton()}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  searchHeader: {
    backgroundColor: Colors.primary,
    borderBottomLeftRadius: 40, borderBottomRightRadius: 40,
    paddingHorizontal: 24, paddingBottom: 24,
    elevation: 5, zIndex: 100,
  },
  searchHeaderResults: {
    backgroundColor: Colors.white, borderRadius: 0, paddingBottom: 16,
    elevation: 0, borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  searchBar: {
    backgroundColor: Colors.white, borderRadius: Radius.xxl,
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12,
    ...Shadows.sm,
  },
  searchBarResults: { backgroundColor: '#FDF3F6', elevation: 0, shadowOpacity: 0 },
  searchIcon: { marginRight: 12 },
  searchText: { color: Colors.mutedForeground, fontSize: 14, fontWeight: '500', flex: 1 },
  cartButton: {
    position: 'relative',
    padding: 4,
  },
  cartBadge: {
    position: 'absolute',
    top: -4,
    right: -6,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  cartBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
});
