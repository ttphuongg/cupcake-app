import { formatCurrency } from '../../utils/formatters';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Package } from 'lucide-react-native';
import { Colors, Radius, Shadows } from '@/constants/theme';
import { OrderDetail } from '../../types';
import { ProductListItem } from '../Shared/ProductListItem';

interface OrderDetailItemsProps {
  order: OrderDetail;
}

export const OrderDetailItems: React.FC<OrderDetailItemsProps> = ({ order }) => {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Package size={20} color={Colors.primaryDark} />
        <Text style={styles.sectionTitle}>Sản phẩm</Text>
      </View>
      {order.items?.map((item: any, index: number) => (
        <ProductListItem
          key={index}
          mode="readonly"
          item={{
            id: item.id,
            product_id: item.product_id,
            product_name: item.product_name,
            product_image: item.product_image,
            quantity: item.quantity,
            price: item.price,
            custom_data: item.custom_data,
          }}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    backgroundColor: Colors.white, marginHorizontal: 16, marginBottom: 12,
    borderRadius: Radius.xl, padding: 16, ...Shadows.sm,
  },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: Colors.foreground },
});
