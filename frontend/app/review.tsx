/**
 * app/review.tsx — Màn hình đánh giá sản phẩm
 * Data: useAuthStore + useProductStore + useOrderStore + reviewService
 * (Không còn phụ thuộc AppContext)
 */
import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  ScrollView, Platform, ActivityIndicator,
} from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Star, Camera, X, Check } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeOut, ZoomIn, ZoomOut } from 'react-native-reanimated';

import { useAuthStore } from '../store/authStore';
import { useProductStore } from '../store/productStore';
import { useOrderStore } from '../store/orderStore';
import { reviewService } from '../services/reviewService';

export default function ReviewProductScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { orderId, productId } = useLocalSearchParams<{ orderId: string; productId: string }>();

  const { user } = useAuthStore();
  const { getProductById, currentProduct: product, isLoading: isLoadingProduct } = useProductStore();
  const { orders, fetchOrders, isLoading: isLoadingOrders } = useOrderStore();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const isLoading = isLoadingProduct || isLoadingOrders;

  // Tải dữ liệu khi mount
  useEffect(() => {
    if (productId) getProductById(productId);
    if (orders.length === 0) fetchOrders();
  }, [productId]);

  // Tìm đơn hàng theo orderId (id là number | undefined)
  const order = orders.find((o) => String(o.id) === orderId);

  // ── Validation ─────────────────────────────────────────────────────────────
  const validate = (): string | null => {
    if (!user) return 'Vui lòng đăng nhập để đánh giá';
    if (!order) return 'Không tìm thấy đơn hàng';
    if (order.user_id !== user.id) return 'Bạn không có quyền đánh giá đơn hàng này';
    if (order.status !== 'COMPLETED') return 'Bạn cần mua và nhận hàng thành công để đánh giá';
    const hasProduct = order.items?.some((item) => item.product_id === Number(productId));
    if (!hasProduct) return 'Sản phẩm không có trong đơn hàng này';
    if (rating === 0) return 'Vui lòng chọn số sao đánh giá';
    if (comment.trim().length < 10) return 'Nội dung đánh giá phải có ít nhất 10 ký tự';
    return null;
  };

  const handleImageUpload = () => {
    if (images.length >= 5) { setError('Tối đa 5 hình ảnh'); return; }
    // TODO: Tích hợp expo-image-picker khi cần
    setImages((prev) => [
      ...prev,
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200&h=200&fit=crop',
    ]);
  };

  const handleSubmit = async () => {
    setError('');
    const msg = validate();
    if (msg) { setError(msg); return; }
    if (!product?.id) return;

    setIsSubmitting(true);
    try {
      await reviewService.createReview(product.id, {
        rating,
        comment: comment.trim() || undefined,
        image: images[0] ?? undefined,   // Backend nhận 1 image URL
      });
      setShowSuccess(true);
      setTimeout(() => {
        router.canGoBack() ? router.back() : router.push('/orders' as any);
      }, 1500);
    } catch {
      setError('Gửi đánh giá thất bại. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Loading ────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <View style={[styles.centerContainer, { paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color="#FF6B81" />
      </View>
    );
  }

  // ── Product not found ──────────────────────────────────────────────────────
  if (!product) {
    return (
      <View style={[styles.centerContainer, { paddingTop: insets.top }]}>
        <Text style={styles.errorText}>Không tìm thấy sản phẩm</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>Quay lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ── Cannot review ──────────────────────────────────────────────────────────
  const validationMsg = validate();
  // Chỉ chặn nếu lỗi không liên quan đến nội dung (rating/comment)
  const blockerMsg =
    !user || !order || order.user_id !== user.id || order.status !== 'COMPLETED'
      ? validationMsg
      : null;

  if (blockerMsg) {
    return (
      <View style={[styles.centerContainer, { paddingTop: insets.top, paddingHorizontal: 24 }]}>
        <View style={styles.errorIconContainer}><X color="#EF4444" size={40} /></View>
        <Text style={styles.errorTitle}>Không thể đánh giá</Text>
        <Text style={styles.errorDesc}>{blockerMsg}</Text>
        <TouchableOpacity onPress={() => router.push('/orders' as any)} style={styles.primaryBtn}>
          <Text style={styles.primaryBtnText}>Về đơn hàng</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ── Main UI ────────────────────────────────────────────────────────────────
  const ratingLabels = ['Rất không hài lòng', 'Không hài lòng', 'Bình thường', 'Hài lòng', 'Rất hài lòng'];

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={[styles.header, { paddingTop: insets.top || 16 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
          <ArrowLeft color="#111827" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Đánh giá sản phẩm</Text>
        <View style={styles.headerBtn} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* PRODUCT INFO */}
        <View style={styles.productCard}>
          <Image source={{ uri: product.image ?? undefined }} style={styles.productImage} contentFit="cover" />
          <View style={styles.productInfo}>
            <Text style={styles.productName} numberOfLines={2}>{product.name}</Text>
            <Text style={styles.productPrice}>{product.price.toLocaleString('vi-VN')}đ</Text>
          </View>
        </View>

        {/* RATING */}
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

        {/* COMMENT */}
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

        {/* IMAGES */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Thêm hình ảnh (Tùy chọn)</Text>
          <View style={styles.imagesGrid}>
            {images.map((img, index) => (
              <View key={index} style={styles.imageWrapper}>
                <Image source={{ uri: img }} style={styles.uploadedImage} contentFit="cover" />
                <TouchableOpacity onPress={() => setImages((p) => p.filter((_, i) => i !== index))} style={styles.removeImageBtn}>
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

        {/* ERROR */}
        {!!error && (
          <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.errorContainer}>
            <X color="#EF4444" size={20} style={{ marginTop: 2 }} />
            <Text style={styles.errorMsg}>{error}</Text>
          </Animated.View>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* SUBMIT */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom || 24 }]}>
        <TouchableOpacity
          style={[styles.submitBtn, (showSuccess || isSubmitting) && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          disabled={showSuccess || isSubmitting}
        >
          {isSubmitting
            ? <ActivityIndicator size="small" color="#FFF" />
            : <Text style={styles.submitBtnText}>Gửi đánh giá</Text>}
        </TouchableOpacity>
      </View>

      {/* SUCCESS MODAL */}
      {showSuccess && (
        <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.modalOverlay}>
          <Animated.View entering={ZoomIn} exiting={ZoomOut} style={styles.modalContent}>
            <View style={styles.successIconContainer}><Check color="#22C55E" size={40} strokeWidth={3} /></View>
            <Text style={styles.modalTitle}>Cảm ơn bạn đã đánh giá!</Text>
            <Text style={styles.modalDesc}>Đánh giá của bạn giúp người mua khác có thêm thông tin hữu ích</Text>
          </Animated.View>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  centerContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F9FAFB' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  headerBtn: { padding: 8, width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '900', color: '#111827' },
  scrollContent: { padding: 16, gap: 16 },
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
  errorContainer: { flexDirection: 'row', backgroundColor: '#FEF2F2', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#FECACA', gap: 8, alignItems: 'flex-start' },
  errorMsg: { flex: 1, color: '#B91C1C', fontSize: 14 },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#FFF', padding: 16, borderTopWidth: 1, borderTopColor: '#F3F4F6', shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 8 },
  submitBtn: { backgroundColor: '#FF6B81', paddingVertical: 16, borderRadius: 16, alignItems: 'center' },
  submitBtnDisabled: { opacity: 0.5 },
  submitBtnText: { color: '#FFF', fontSize: 16, fontWeight: '900' },
  errorIconContainer: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#FEF2F2', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  errorTitle: { fontSize: 20, fontWeight: '900', color: '#111827', marginBottom: 8 },
  errorDesc: { fontSize: 14, color: '#6B7280', textAlign: 'center', marginBottom: 24 },
  primaryBtn: { backgroundColor: '#FF6B81', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
  primaryBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  errorText: { fontSize: 16, color: '#6B7280', marginBottom: 16 },
  backBtn: { paddingVertical: 8 },
  backBtnText: { color: '#FF6B81', fontWeight: 'bold', fontSize: 16 },
  modalOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 999, alignItems: 'center', justifyContent: 'center', padding: 24 },
  modalContent: { backgroundColor: '#FFF', borderRadius: 24, padding: 32, alignItems: 'center', width: '100%', maxWidth: 320 },
  successIconContainer: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#DCFCE7', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 20, fontWeight: '900', color: '#111827', marginBottom: 8, textAlign: 'center' },
  modalDesc: { fontSize: 14, color: '#6B7280', textAlign: 'center', lineHeight: 20 },
});
