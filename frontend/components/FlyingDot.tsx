/**
 * components/FlyingDot.tsx
 * Animation viên đạn bay lên giỏ hàng khi bấm "Thêm".
 * Tách ra từ app/(tabs)/index.tsx
 */
import React, { useEffect } from 'react';
import { Plus } from 'lucide-react-native';
import Animated, {
  useSharedValue,
  withTiming,
  Easing,
  useAnimatedStyle,
} from 'react-native-reanimated';

export interface FlyingDotProps {
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  onComplete: () => void;
}

export const FlyingDot: React.FC<FlyingDotProps> = ({
  startX,
  startY,
  targetX,
  targetY,
  onComplete,
}) => {
  const tX = useSharedValue(startX);
  const tY = useSharedValue(startY);
  const sc = useSharedValue(1);
  const op = useSharedValue(1);

  useEffect(() => {
    tX.value = withTiming(targetX, { duration: 650, easing: Easing.out(Easing.ease) });
    tY.value = withTiming(targetY, { duration: 650, easing: Easing.in(Easing.ease) });
    sc.value = withTiming(0.3, { duration: 650 });
    op.value = withTiming(0, { duration: 650 });
    const t = setTimeout(onComplete, 700);
    return () => clearTimeout(t);
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: tX.value },
      { translateY: tY.value },
      { scale: sc.value },
    ],
    opacity: op.value,
  }));

  return (
    <Animated.View style={[styles, style]}>
      <Plus size={12} color="#FFF" strokeWidth={4} />
    </Animated.View>
  );
};

const styles = {
  position: 'absolute' as const,
  top: 0,
  left: 0,
  width: 22,
  height: 22,
  backgroundColor: '#FF6B81',
  borderRadius: 11,
  borderWidth: 2,
  borderColor: '#FFF',
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
  zIndex: 9999,
  elevation: 999,
};
