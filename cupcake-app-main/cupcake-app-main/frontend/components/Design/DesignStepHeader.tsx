import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useUiStore } from '../../store/uiStore';
import { Colors } from '../../constants/theme';

const TOTAL_STEPS = 5;

const STEP_CONFIG: Record<number, { title: string; subtitle: string }> = {
  1: { title: 'Cốt bánh', subtitle: 'Chọn loại đế bánh bạn yêu thích' },
  2: { title: 'Nhân bánh', subtitle: 'Tùy chọn — bỏ qua nếu không muốn' },
  3: { title: 'Kem phủ', subtitle: 'Lớp kem tạo nên điểm nhấn' },
  4: { title: 'Topping', subtitle: 'Tối đa 3 loại topping' },
  5: { title: 'Hoàn thiện', subtitle: 'Xem lại và thêm vào giỏ hàng' },
};

export const DesignStepHeader = () => {
  const { currentDesignStep } = useUiStore();

  const config = STEP_CONFIG[currentDesignStep] ?? STEP_CONFIG[1];
  const progress = currentDesignStep / TOTAL_STEPS;

  // ── Progress bar animation ────────────────────────────────────────────────
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(progressAnim, {
      toValue: progress,
      friction: 8,
      tension: 60,
      useNativeDriver: false, // width animation requires native: false
    }).start();
  }, [progress]);

  return (
    <View style={styles.container}>
      {/* Step counter + title */}
      <View style={styles.titleRow}>
        <View style={styles.stepBadge}>
          <Text style={styles.stepBadgeText}>{currentDesignStep}/{TOTAL_STEPS}</Text>
        </View>
        <View style={styles.titleBlock}>
          <Text style={styles.title}>{config.title}</Text>
          <Text style={styles.subtitle} numberOfLines={1}>{config.subtitle}</Text>
        </View>
      </View>

      {/* Progress bar */}
      <View style={styles.progressTrack}>
        <Animated.View
          style={[
            styles.progressFill,
            {
              width: progressAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />
        {/* Step dots */}
        <View style={styles.dotsRow}>
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i < currentDesignStep ? styles.dotDone : styles.dotPending,
              ]}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  stepBadge: {
    backgroundColor: Colors.primary + '22', // 13% opacity
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.primary + '44',
  },
  stepBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primaryDark,
  },
  titleBlock: {
    flex: 1,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.foreground,
    lineHeight: 22,
  },
  subtitle: {
    fontSize: 12,
    color: Colors.mutedForeground,
    marginTop: 2,
  },
  progressTrack: {
    height: 6,
    backgroundColor: Colors.primary + '22',
    borderRadius: 3,
    overflow: 'hidden',
    position: 'relative',
  },
  progressFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 3,
  },
  dotsRow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 1,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: Colors.card,
  },
  dotDone: {
    backgroundColor: Colors.primary,
  },
  dotPending: {
    backgroundColor: Colors.primary + '33',
  },
});
