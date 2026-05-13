import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { ArrowLeft, X, Check } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeOut, ZoomIn, ZoomOut } from 'react-native-reanimated';

import { useReviewForm } from '../hooks/useReviewForm';
import { ProductInfoSection, RatingSection, CommentSection, ImageUploadSection } from '../components/ReviewSections';

export default function ReviewProductScreen() {
  const insets = useSafeAreaInsets();
  const { orderId, productId } = useLocalSearchParams<{ orderId: string; productId: string }>();
  
  const {
    router,
    product,
    isLoading,
    rating, setRating,
    comment, setComment,
    images, setImages,
    error,
    isSubmitting,
    showSuccess,
    blockerMsg,
    handleImageUpload,
    handleSubmit,
  } = useReviewForm(productId, orderId);

  if (isLoading) {
    return (
      <View style={[styles.centerContainer, { paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color="#FF6B81" />
      </View>
    );
  }

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

  const ratingLabels = ['Rất không hài lòng', 'Không hài lòng', 'Bình thường', 'Hài lòng', 'Rất hài lòng'];

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top || 16 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
          <ArrowLeft color="#111827" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Đánh giá sản phẩm</Text>
        <View style={styles.headerBtn} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <ProductInfoSection product={product} />

        <RatingSection 
          rating={rating} 
          setRating={setRating} 
          ratingLabels={ratingLabels} 
        />

        <CommentSection 
          comment={comment} 
          setComment={setComment} 
        />

        <ImageUploadSection 
          images={images} 
          setImages={setImages} 
          handleImageUpload={handleImageUpload} 
        />

        {!!error && (
          <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.errorContainer}>
            <X color="#EF4444" size={20} style={{ marginTop: 2 }} />
            <Text style={styles.errorMsg}>{error}</Text>
          </Animated.View>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>

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
