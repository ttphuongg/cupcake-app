import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Link } from 'expo-router';
import { ShoppingBag } from 'lucide-react-native';
import Animated, { ZoomIn, ZoomOut } from 'react-native-reanimated';
import { Colors, Shadows } from '@/constants/theme';

interface FloatingCartButtonProps {
  cartTotal: number;
  animatedCart: any;
}

export const FloatingCartButton: React.FC<FloatingCartButtonProps> = ({ cartTotal, animatedCart }) => {
  if (cartTotal <= 0) return null;

  return (
    <Animated.View entering={ZoomIn} exiting={ZoomOut} style={styles.floatingCartWrap}>
      <Link href={'/cart' as any} asChild>
        <TouchableOpacity activeOpacity={0.8}>
          <Animated.View style={[styles.floatingCart, animatedCart]}>
            <ShoppingBag color="#FFF" size={24} />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{cartTotal}</Text>
            </View>
          </Animated.View>
        </TouchableOpacity>
      </Link>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  floatingCartWrap: { position: 'absolute', bottom: Platform.OS === 'ios' ? 100 : 80, right: 24, zIndex: 110 },
  floatingCart: { width: 60, height: 60, backgroundColor: Colors.primary, borderRadius: 30, alignItems: 'center', justifyContent: 'center', ...Shadows.md },
  badge: { position: 'absolute', top: -4, right: -4, backgroundColor: Colors.white, width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
  badgeText: { color: Colors.primaryDark, fontSize: 11, fontWeight: '900' },
});
