import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Star } from 'lucide-react-native';
import { Product, Review } from '@/types';

interface ProductReviewsProps {
  product: Product;
}

export const ProductReviews: React.FC<ProductReviewsProps> = ({ product }) => {
  if (!product.reviews || product.reviews.length === 0) {
    return (
      <View style={styles.reviewsContainer}>
        <Text style={styles.reviewsTitle}>Bình luận (0)</Text>
        <Text style={styles.emptyText}>Chưa có đánh giá nào cho sản phẩm này.</Text>
      </View>
    );
  }

  return (
    <View style={styles.reviewsContainer}>
      <Text style={styles.reviewsTitle}>Bình luận ({product.reviews.length})</Text>
      {product.reviews.map((review: any, idx: number) => (
        <View key={idx} style={[styles.reviewItem, idx === 0 && { borderTopWidth: 0, paddingTop: 0 }]}>
          {review.user_avatar ? (
            <Image source={{ uri: review.user_avatar }} style={styles.avatar} />
          ) : (
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{review.user_name ? review.user_name.charAt(0).toUpperCase() : 'U'}</Text>
            </View>
          )}
          <View style={styles.reviewContent}>
            <View style={styles.reviewHeader}>
              <Text style={styles.reviewerName}>{review.user_name || 'Người dùng'}</Text>
              <View style={styles.starsRow}>
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={12}
                    color={i < (review.rating || 5) ? '#FFD700' : '#E5E7EB'}
                    fill={i < (review.rating || 5) ? '#FFD700' : 'transparent'}
                  />
                ))}
              </View>
            </View>
            {review.comment ? <Text style={styles.reviewText}>{review.comment}</Text> : null}
            {review.image ? (
              <Image source={{ uri: review.image }} style={styles.reviewImage} />
            ) : null}
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
  emptyText: { fontSize: 14, color: '#6B7280', fontStyle: 'italic', textAlign: 'center', marginTop: 10 },
  reviewItem: { flexDirection: 'row', gap: 12, paddingTop: 16, borderTopWidth: 1, borderColor: '#E5E7EB' },
  avatar: { width: 36, height: 36, backgroundColor: '#FCE4EC', borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: 16, fontWeight: 'bold', color: '#E91E63' },
  reviewContent: { flex: 1 },
  reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  reviewerName: { fontSize: 14, fontWeight: 'bold', color: '#111827' },
  starsRow: { flexDirection: 'row', gap: 2 },
  reviewText: { fontSize: 14, color: '#6B7280', marginTop: 4, lineHeight: 20 },
  reviewImage: { width: 80, height: 80, borderRadius: 8, marginTop: 8 },
});
