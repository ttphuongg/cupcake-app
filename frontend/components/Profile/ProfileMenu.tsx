import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Colors, Radius, Shadows } from '@/constants/theme';
import { useRouter } from 'expo-router';

export const ProfileMenu = () => {
  const router = useRouter();

  return (
    <>
      {/* Navigation Links */}
      <Animated.View entering={FadeInDown.delay(300)} style={styles.card}>
        {[
          { label: 'Đổi mật khẩu', icon: 'lock', route: '/change-password' as const },
          { label: 'Lịch sử đơn hàng', icon: 'package', route: '/orders' as const },
        ].map((item, index) => (
          <TouchableOpacity
            key={item.route}
            style={[styles.linkRow, index === 1 && { borderBottomWidth: 0 }]}
            onPress={() => router.push(item.route as never)}
          >
            <Feather name={item.icon as never} size={18} color={Colors.foreground} />
            <Text style={styles.linkLabelWithIcon}>{item.label}</Text>
            <Feather name="chevron-right" size={18} color={Colors.mutedForeground} />
          </TouchableOpacity>
        ))}
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white, marginHorizontal: 16, marginBottom: 16,
    borderRadius: Radius.xl, padding: 16, ...Shadows.sm,
  },
  linkRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  linkLabel: { flex: 1, fontSize: 14, color: Colors.foreground },
  linkLabelWithIcon: { flex: 1, fontSize: 14, color: Colors.foreground, marginLeft: 12 },
  linkValue: { fontSize: 14, color: Colors.mutedForeground, marginRight: 8 },
});
