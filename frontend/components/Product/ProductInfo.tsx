import { formatCurrency } from '../../utils/formatters';
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Star, Plus, Minus } from 'lucide-react-native';
import { Product } from '@/types';
import { Colors, Radius, Shadows } from '@/constants/theme';

interface ProductInfoProps {
  product: Product;
  quantityInCart: number;
  handleAction: (qty: number, isIncrease: boolean) => void;
}

export const ProductInfo: React.FC<ProductInfoProps> = ({ product, quantityInCart, handleAction }) => {
  return (
    <View style={styles.infoContainer}>
      <View style={styles.titleRow}>
        <Text style={styles.productName}>{product.name}</Text>
        {product.category_name?.toLowerCase().includes('bestseller') && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>BÁN CHẠY</Text>
          </View>
        )}
      </View>

      <Text style={styles.description}>{product.description}</Text>

      <View style={styles.priceRow}>
        <View>
          <View style={styles.ratingRow}>
            <Star color="#FFD700" fill="#FFD700" size={14} />
            <Text style={styles.ratingText}>4.9</Text>
            <Text style={styles.ratingCount}>(120+)</Text>
          </View>
          <Text style={styles.price}>{formatCurrency(product.price)}</Text>
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
  );
};

const styles = StyleSheet.create({
  infoContainer: {
    backgroundColor: Colors.card, paddingHorizontal: 20, paddingVertical: 24,
    borderBottomWidth: 1, borderColor: Colors.borderLight,
    borderTopLeftRadius: Radius.xxl, borderTopRightRadius: Radius.xxl,
    marginTop: -40, ...Shadows.md,
  },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 },
  productName: { fontSize: 20, fontWeight: 'bold', color: Colors.foreground, flex: 1 },
  badge: {
    backgroundColor: Colors.primaryAlpha10, paddingHorizontal: 6, paddingVertical: 2,
    borderRadius: Radius.sm, borderWidth: 1, borderColor: Colors.primaryAlpha20,
  },
  badgeText: { color: Colors.primaryDark, fontSize: 10, fontWeight: 'bold' },
  description: { fontSize: 14, color: '#6B7280', marginTop: 8, lineHeight: 22 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 16 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  ratingText: { fontSize: 14, fontWeight: 'bold', marginLeft: 4 },
  ratingCount: { fontSize: 12, color: '#6B7280', marginLeft: 4 },
  price: { fontSize: 24, fontWeight: '900', color: Colors.primary },
  actionContainer: { flexDirection: 'row', alignItems: 'center' },
  addBtn: { backgroundColor: Colors.primary, padding: 10, borderRadius: Radius.md, ...Shadows.sm },
  quantityControl: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.inputBackground,
    borderRadius: Radius.md, paddingHorizontal: 12, paddingVertical: 8,
    borderWidth: 1, borderColor: Colors.borderLight, gap: 16,
  },
  qtyBtn: {},
  qtyText: { fontSize: 16, fontWeight: 'bold', width: 20, textAlign: 'center' },
});
