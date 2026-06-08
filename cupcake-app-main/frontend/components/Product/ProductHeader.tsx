import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { ArrowLeft } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Product } from '@/types';

interface ProductHeaderProps {
  product: Product;
  onBack: () => void;
}

export const ProductHeader: React.FC<ProductHeaderProps> = ({ product, onBack }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.imageContainer}>
      <Image source={{ uri: product.image ?? undefined }} style={styles.image} contentFit="cover" />
      <View style={[styles.headerButtons, { top: insets.top || 20 }]}>
        <TouchableOpacity onPress={onBack} style={styles.iconButton}>
          <ArrowLeft color="#111827" size={20} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#E5E7EB',
    position: 'relative',
  },
  image: { width: '100%', height: '100%' },
  headerButtons: {
    position: 'absolute',
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  iconButton: {
    width: 40, height: 40,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 20, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: '#E5E7EB',
  },
});
