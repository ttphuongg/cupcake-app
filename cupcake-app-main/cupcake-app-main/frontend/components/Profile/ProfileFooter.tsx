import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Colors, Radius, Shadows } from '@/constants/theme';
import { useRouter } from 'expo-router';

interface ProfileFooterProps {
  onLogout: () => void;
}

export const ProfileFooter: React.FC<ProfileFooterProps> = ({ onLogout }) => {
  const router = useRouter();

  const handleLogoutPress = () => {
    Alert.alert(
      'Đăng xuất',
      'Bạn có chắc chắn muốn đăng xuất không?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Đăng xuất',
          style: 'destructive',
          onPress: async () => {
            await onLogout();
            router.replace('/login');
          },
        },
      ],
    );
  };

  return (
    <Animated.View entering={FadeInDown.delay(400)}>
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogoutPress}>
        <Text style={styles.logoutBtnText}>Đăng xuất</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/delete-account' as never)}>
        <Text style={styles.deleteAccText}>Xóa tài khoản</Text>
      </TouchableOpacity>
      <Text style={styles.versionText}>Phiên bản ứng dụng v2.0.26</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  logoutBtn: {
    marginHorizontal: 16, marginTop: 8, padding: 16, backgroundColor: Colors.white,
    borderRadius: Radius.xl, alignItems: 'center', justifyContent: 'center', ...Shadows.sm,
  },
  logoutBtnText: { color: '#E8A0BF', fontSize: 15, fontWeight: '700' },
  deleteAccText: { color: Colors.danger, fontSize: 13, textAlign: 'center', marginTop: 16 },
  versionText: { color: Colors.mutedForeground, fontSize: 12, textAlign: 'center', marginTop: 16 },
});
