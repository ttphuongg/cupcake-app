import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Store } from 'lucide-react-native';
import { Colors } from '@/constants/theme';
import { CartItem } from '../../types/cartItem';
import { ProductListItem } from '../Shared/ProductListItem';

interface OrderItemsSectionProps {
  cartItems: CartItem[];
}

export const OrderItemsSection = ({ cartItems }: OrderItemsSectionProps) => (
  <View style={styles.section}>
    <View style={styles.sectionHeader}>
      <Store size={20} color={Colors.primary} />
      <Text style={styles.sectionTitle}>Tiệm Bánh Cupcake ✨</Text>
    </View>
    {cartItems.map((item) => (
      <ProductListItem
        key={item.id}
        mode="checkout"
        item={{
          id: item.id,
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.price ?? item.product?.price ?? 0,
          custom_data: item.custom_data,
          product: item.product
            ? { name: item.product.name, image: item.product.image, price: item.product.price }
            : undefined,
        }}
        showCustomDetails={false}
      />
    ))}
  </View>
);

const styles = StyleSheet.create({
  section: {
    backgroundColor: Colors.white,
    borderBottomWidth: 1, borderBottomColor: Colors.borderLight,
    padding: 16,
  },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: Colors.foreground },
});
