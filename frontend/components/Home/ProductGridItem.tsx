import { formatCurrency } from '../../utils/formatters';
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { Plus, Minus } from 'lucide-react-native';
import Animated, { BounceIn } from 'react-native-reanimated';
import { Colors, Radius, Shadows } from '@/constants/theme';
import { Product } from '@/types';

const { width } = Dimensions.get('window');

interface ProductGridItemProps {
  product: Product;
  index: number;
  qty: number;
  handleAdd: (productId: number, e: any) => void;
  handleQty: (productId: number, delta: number, e?: any) => void;
}

export const ProductGridItem: React.FC<ProductGridItemProps> = ({
  product, index, qty, handleAdd, handleQty
}) => {
  return (
    <Animated.View entering={BounceIn.delay((index % 6) * 50)} style={styles.productCard}>
      <Link href={`/product/${product.id}` as any} asChild>
        <TouchableOpacity activeOpacity={0.8} style={styles.imageContainer}>
          <Image 
            source={{ uri: product.image ?? undefined }} 
            style={styles.productImage} 
            transition={200}
            contentFit="cover"
          />
        </TouchableOpacity>
      </Link>
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>{product.name}</Text>
        <View style={styles.productFooter}>
          <Text style={styles.productPrice}>{formatCurrency(product.price)}</Text>
          {qty === 0 ? (
            <TouchableOpacity activeOpacity={0.7} onPress={(e) => handleAdd(product.id ?? 0, e)} style={styles.addButton}>
              <Plus color={Colors.white} size={18} strokeWidth={3} />
            </TouchableOpacity>
          ) : (
            <View style={styles.qtyControl}>
              <TouchableOpacity activeOpacity={0.7} onPress={(e) => handleQty(product.id ?? 0, -1, e)} style={styles.ctrlBtn}>
                <Minus color={Colors.white} size={14} strokeWidth={3} />
              </TouchableOpacity>
              <Text style={styles.qtyText}>{qty}</Text>
              <TouchableOpacity activeOpacity={0.7} onPress={(e) => handleQty(product.id ?? 0, 1, e)} style={styles.ctrlBtn}>
                <Plus color={Colors.white} size={14} strokeWidth={3} />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  productCard: {
    width: (width - 56) / 2, backgroundColor: Colors.white, borderRadius: Radius.md,
    marginBottom: 16, ...Shadows.sm, borderColor: Colors.borderLight, borderWidth: 1, overflow: 'hidden',
  },
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
});
