import { formatCurrency } from '../../utils/formatters';
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Image } from 'expo-image';
import { useDesignStore } from '../../store/designStore';
import { Colors } from '../../constants/theme';

// Ảnh mặc định khi chưa chọn nguyên liệu nào
const DEFAULT_CAKE = require('../../assets/images/splash-icon.png');

export const CakePricePreview = () => {
  const {
    selectedBase,
    selectedFrosting,
    selectedSize,
    totalPrice,
    getScaleValue,
  } = useDesignStore();

  // ── Scale animation theo kích cỡ ─────────────────────────────────────────
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const targetScale = getScaleValue();

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: targetScale,
      friction: 6,
      tension: 80,
      useNativeDriver: true,
    }).start();
  }, [targetScale]);

  // ── Chọn ảnh hiển thị ────────────────────────────────────────────────────
  // Ưu tiên: frosting image → base image → ảnh mặc định
  const imageSource = (() => {
    if (selectedFrosting?.image_url) return { uri: selectedFrosting.image_url };
    if (selectedBase?.image_url) return { uri: selectedBase.image_url };
    return DEFAULT_CAKE;
  })();

  // ── Nhãn size ────────────────────────────────────────────────────────────
  const sizeLabel = selectedSize?.name ? `Size: ${selectedSize.name}` : null;

  return (
    <View style={styles.container}>
      {/* CANVAS ảnh bánh */}
      <Animated.View style={[styles.cakeCanvas, { transform: [{ scale: scaleAnim }] }]}>
        <Image
          source={imageSource}
          style={styles.cakeImage}
          contentFit="contain"
          transition={300}
        />
      </Animated.View>

      {/* BADGE kích cỡ (nếu đã chọn) */}
      {sizeLabel && (
        <View style={styles.sizeBadge}>
          <Text style={styles.sizeBadgeText}>{sizeLabel}</Text>
        </View>
      )}

      {/* BADGE tổng giá */}
      <View style={styles.priceBadge}>
        <Text style={styles.priceBadgeText}>
          {totalPrice > 0 ? formatCurrency(totalPrice) : 'Chưa có giá'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 16,
    gap: 8,
  },
  cakeCanvas: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cakeImage: {
    width: 180,
    height: 180,
  },
  sizeBadge: {
    backgroundColor: Colors.accent,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 12,
  },
  sizeBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.foreground,
  },
  priceBadge: {
    backgroundColor: Colors.primaryAlpha10,
    paddingHorizontal: 25,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.primaryAlpha20,
  },
  priceBadgeText: {
    color: Colors.primaryDark,
    fontWeight: '700',
    fontSize: 18,
  },
});
