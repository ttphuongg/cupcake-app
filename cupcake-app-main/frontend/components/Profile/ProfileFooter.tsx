import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Colors, Radius, Shadows } from '@/constants/theme';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../store/authStore';

interface ProfileFooterProps {
  onLogout: () => void;
}

export const ProfileFooter: React.FC<ProfileFooterProps> = ({ onLogout }) => {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  const handleLogoutPress = () => {
    onLogout();
  };

  return (
    <Animated.View entering={FadeInDown.delay(400)}>
      {isAuthenticated ? (
        <>
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogoutPress}>
            <Text style={styles.logoutBtnText}>Đăng xuất</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/delete-account' as never)}>
            <Text style={styles.deleteAccText}>Xóa tài khoản</Text>
          </TouchableOpacity>
        </>
      ) : (
        <TouchableOpacity style={styles.loginBtn} onPress={() => router.push('/login')}>
          <Text style={styles.loginBtnText}>Đăng nhập</Text>
        </TouchableOpacity>
      )}
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
  loginBtn: {
    marginHorizontal: 16, marginTop: 8, padding: 16, backgroundColor: Colors.primary,
    borderRadius: Radius.xl, alignItems: 'center', justifyContent: 'center', ...Shadows.sm,
  },
  loginBtnText: { color: Colors.white, fontSize: 15, fontWeight: '700' },
  deleteAccText: { color: Colors.danger, fontSize: 13, textAlign: 'center', marginTop: 16 },
  versionText: { color: Colors.mutedForeground, fontSize: 12, textAlign: 'center', marginTop: 16 },
});
