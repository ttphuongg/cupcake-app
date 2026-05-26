/**
 * components/ToastRenderer.tsx
 * Lắng nghe uiStore.toast và hiển thị thông báo trượt xuống từ đỉnh màn hình.
 * Chèn một lần duy nhất vào _layout.tsx để hoạt động trên mọi màn hình.
 */
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  Platform,
  StatusBar,
  View,
} from 'react-native';
import { CheckCircle, XCircle, Info } from 'lucide-react-native';
import { useUiStore, ToastType } from '../store/uiStore';

// ─── Config ──────────────────────────────────────────────────────────────────

const SLIDE_DISTANCE = -120; // Bắt đầu ngoài màn hình (phía trên)
const ANIMATION_MS   = 320;
const STATUS_BAR_H   = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) : 50;

// ─── Toast theme per type ────────────────────────────────────────────────────

const TOAST_CONFIG: Record<
  ToastType,
  { bg: string; border: string; icon: React.ReactNode }
> = {
  success: {
    bg: '#F0FDF4',
    border: '#86EFAC',
    icon: <CheckCircle size={20} color="#16A34A" strokeWidth={2.5} />,
  },
  error: {
    bg: '#FFF0F3',
    border: '#FFAAB5',
    icon: <XCircle size={20} color="#E11D48" strokeWidth={2.5} />,
  },
  info: {
    bg: '#EFF6FF',
    border: '#93C5FD',
    icon: <Info size={20} color="#2563EB" strokeWidth={2.5} />,
  },
};

const TEXT_COLOR: Record<ToastType, string> = {
  success: '#15803D',
  error:   '#BE123C',
  info:    '#1D4ED8',
};

// ─── Component ───────────────────────────────────────────────────────────────

export const ToastRenderer = () => {
  const { toast } = useUiStore();

  const translateY = useRef(new Animated.Value(SLIDE_DISTANCE)).current;
  const opacity    = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (toast.visible) {
      // Trượt xuống + hiện
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          friction: 8,
          tension: 70,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: ANIMATION_MS,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Trượt lên + ẩn
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: SLIDE_DISTANCE,
          duration: ANIMATION_MS,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: ANIMATION_MS,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [toast.visible]);

  const config = TOAST_CONFIG[toast.type];

  return (
    <Animated.View
      style={[
        styles.wrapper,
        { transform: [{ translateY }], opacity },
      ]}
      pointerEvents="none"   // Không chặn touch của UI bên dưới
    >
      <View
        style={[
          styles.card,
          { backgroundColor: config.bg, borderColor: config.border },
        ]}
      >
        {config.icon}
        <Text
          style={[styles.message, { color: TEXT_COLOR[toast.type] }]}
          numberOfLines={2}
        >
          {toast.message}
        </Text>
      </View>
    </Animated.View>
  );
};

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    top: STATUS_BAR_H + 12,
    left: 20,
    right: 20,
    zIndex: 9999,
    elevation: 9999,     // Android: phải có elevation cao hơn mọi view khác
    alignItems: 'center',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    width: '100%',
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  message: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
});
