import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Star } from 'lucide-react-native';
import { Product, Review } from '@/types';

interface ProductReviewsProps {
  product: Product;
}

export const ProductReviews: React.FC<ProductReviewsProps> = ({ product }) => {
  return (
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
                  <Star
                    key={i}
                    size={12}
                    color={i < 4 ? '#FFD700' : '#E5E7EB'}
                    fill={i < 4 ? '#FFD700' : 'transparent'}
                  />
                ))}
              </View>
            </View>
            <Text style={styles.reviewText}>Ngon</Text>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  reviewsContainer: {
    backgroundColor: '#FFF', marginTop: 8,
    paddingHorizontal: 20, paddingVertical: 16,
  },
  reviewsTitle: { fontSize: 14, fontWeight: 'bold', color: '#111827', marginBottom: 16 },
  reviewItem: { flexDirection: 'row', gap: 12, paddingTop: 16, borderTopWidth: 1, borderColor: '#E5E7EB' },
  avatar: { width: 36, height: 36, backgroundColor: '#F3F4F6', borderRadius: 18 },
  reviewContent: { flex: 1 },
  reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  reviewerName: { fontSize: 14, fontWeight: 'bold', color: '#111827' },
  starsRow: { flexDirection: 'row', gap: 2 },
  reviewText: { fontSize: 14, color: '#6B7280', marginTop: 4, lineHeight: 20 },
});
