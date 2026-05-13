import { formatCurrency } from '../utils/formatters';
import React from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { Star, Camera, X } from 'lucide-react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

export const ProductInfoSection = ({ product }: { product: any }) => (
  <View style={styles.productCard}>
    <Image source={{ uri: product.image ?? undefined }} style={styles.productImage} contentFit="cover" />
    <View style={styles.productInfo}>
      <Text style={styles.productName} numberOfLines={2}>{product.name}</Text>
      <Text style={styles.productPrice}>{formatCurrency(product.price)}</Text>
    </View>
  </View>
);

export const RatingSection = ({ rating, setRating, ratingLabels }: any) => (
  <View style={styles.sectionCard}>
    <Text style={styles.sectionTitle}>Đánh giá của bạn</Text>
    <View style={styles.starsContainer}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity key={star} onPress={() => setRating(star)} style={styles.starBtn}>
          <Animated.View style={star <= rating ? { transform: [{ scale: 1.1 }] } : {}}>
            <Star
              color={star <= rating ? '#FF6B81' : '#D1D5DB'}
              fill={star <= rating ? '#FF6B81' : 'transparent'}
              size={44}
            />
          </Animated.View>
        </TouchableOpacity>
      ))}
    </View>
    {rating > 0 && (
      <Animated.Text entering={FadeIn} style={styles.ratingLabel}>
        {ratingLabels[rating - 1]}
      </Animated.Text>
    )}
  </View>
);

export const CommentSection = ({ comment, setComment }: any) => (
  <View style={styles.sectionCard}>
    <Text style={styles.sectionTitle}>Chia sẻ trải nghiệm</Text>
    <TextInput
      style={styles.textInput}
      multiline
      value={comment}
      onChangeText={setComment}
      placeholder="Hãy chia sẻ cảm nhận của bạn về sản phẩm này..."
      placeholderTextColor="#9CA3AF"
      maxLength={500}
      textAlignVertical="top"
    />
    <View style={styles.charCountRow}>
      <Text style={styles.charCountText}>Tối thiểu 10 ký tự</Text>
      <Text style={styles.charCountText}>{comment.length}/500</Text>
    </View>
  </View>
);

export const ImageUploadSection = ({ images, setImages, handleImageUpload }: any) => (
  <View style={styles.sectionCard}>
    <Text style={styles.sectionTitle}>Thêm hình ảnh (Tùy chọn)</Text>
    <View style={styles.imagesGrid}>
      {images.map((img: string, index: number) => (
        <View key={index} style={styles.imageWrapper}>
          <Image source={{ uri: img }} style={styles.uploadedImage} contentFit="cover" />
          <TouchableOpacity onPress={() => setImages((p: any) => p.filter((_: any, i: number) => i !== index))} style={styles.removeImageBtn}>
            <X color="#FFF" size={12} strokeWidth={3} />
          </TouchableOpacity>
        </View>
      ))}
      {images.length < 5 && (
        <TouchableOpacity onPress={handleImageUpload} style={styles.uploadBtn}>
          <Camera color="#9CA3AF" size={24} />
          <Text style={styles.uploadText}>Thêm ảnh</Text>
        </TouchableOpacity>
      )}
    </View>
    <Text style={styles.imageHint}>Tối đa 5 hình ảnh</Text>
  </View>
);

const styles = StyleSheet.create({
  productCard: { flexDirection: 'row', backgroundColor: '#FFF', padding: 12, borderRadius: 16, borderWidth: 1, borderColor: '#F3F4F6', gap: 12, alignItems: 'center' },
  productImage: { width: 64, height: 64, borderRadius: 12, backgroundColor: '#F3F4F6' },
  productInfo: { flex: 1 },
  productName: { fontSize: 16, fontWeight: 'bold', color: '#111827', marginBottom: 4 },
  productPrice: { fontSize: 16, fontWeight: '900', color: '#FF6B81' },
  sectionCard: { backgroundColor: '#FFF', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#F3F4F6' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#111827', marginBottom: 16 },
  starsContainer: { flexDirection: 'row', justifyContent: 'center', gap: 8 },
  starBtn: { padding: 4 },
  ratingLabel: { textAlign: 'center', marginTop: 12, fontSize: 14, fontWeight: 'bold', color: '#FF6B81' },
  textInput: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, padding: 16, minHeight: 120, fontSize: 14, color: '#111827', backgroundColor: '#F9FAFB' },
  charCountRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  charCountText: { fontSize: 12, color: '#9CA3AF' },
  imagesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  imageWrapper: { width: '22%', aspectRatio: 1, position: 'relative' },
  uploadedImage: { width: '100%', height: '100%', borderRadius: 8, borderWidth: 1, borderColor: '#E5E7EB' },
  removeImageBtn: { position: 'absolute', top: -6, right: -6, backgroundColor: '#EF4444', width: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center', elevation: 2 },
  uploadBtn: { width: '22%', aspectRatio: 1, borderRadius: 8, borderWidth: 2, borderColor: '#E5E7EB', borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F9FAFB', gap: 4 },
  uploadText: { fontSize: 10, color: '#9CA3AF' },
  imageHint: { fontSize: 12, color: '#9CA3AF', marginTop: 12 },
});
