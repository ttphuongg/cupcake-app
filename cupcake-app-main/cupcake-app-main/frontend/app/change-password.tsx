import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { AuthHeader } from '../components/Auth/AuthHeader';
import { useAuthStore } from '../store/authStore';

export default function ChangePasswordScreen() {
  const router = useRouter();
  const { user, forgotPassword, isLoading } = useAuthStore();

  const handleSendResetLink = async () => {
    if (!user?.email) {
      Alert.alert('Lỗi', 'Không tìm thấy thông tin email tài khoản.');
      return;
    }
    try {
      await forgotPassword(user.email);
      Alert.alert(
        'Thành công',
        `Liên kết đổi mật khẩu đã được gửi đến email ${user.email} của bạn. Vui lòng kiểm tra hộp thư!`,
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error: any) {
      const msg = error?.response?.data?.message || error?.message || 'Không thể gửi yêu cầu.';
      Alert.alert('Thông báo', msg);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.mainContainer}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" bounces={false}>
        <LinearGradient
          colors={['rgba(232, 160, 191, 0.15)', 'rgba(186, 144, 198, 0.10)', 'rgba(192, 219, 234, 0.20)']}
          style={styles.gradientContainer}
        >
          <Animated.View entering={ZoomIn.duration(500).springify()} style={styles.contentWrapper}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <Feather name="arrow-left" size={24} color={Colors.mutedForeground} />
            </TouchableOpacity>

            <AuthHeader icon="lock" title="Đổi mật khẩu" subtitle="Cập nhật mật khẩu bảo mật của bạn" />

            <Animated.View entering={FadeInDown.delay(300).duration(600)} style={styles.card}>
              <View style={styles.infoBox}>
                <Feather name="mail" size={48} color={Colors.primary} style={styles.infoIcon} />
                <Text style={styles.infoTitle}>Đổi mật khẩu qua Email</Text>
                <Text style={styles.infoDescription}>
                  Để đảm bảo an toàn tuyệt đối, hệ thống sẽ gửi một liên kết đổi mật khẩu đến địa chỉ email tài khoản của bạn:
                </Text>
                <Text style={styles.emailText}>{user?.email || 'email@domain.com'}</Text>
                <Text style={styles.infoNote}>
                  Vui lòng kiểm tra hộp thư (và thư mục Spam/Quảng cáo nếu không thấy) sau khi nhấn nút gửi.
                </Text>
              </View>

              <TouchableOpacity
                style={[styles.submitButton, isLoading && styles.disabledButton]}
                onPress={handleSendResetLink}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Text style={styles.submitButtonText}>Gửi liên kết đổi mật khẩu</Text>
                    <Feather name="send" size={16} color="#fff" style={{ marginLeft: 8 }} />
                  </>
                )}
              </TouchableOpacity>
            </Animated.View>
          </Animated.View>
        </LinearGradient>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { flexGrow: 1 },
  gradientContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 60 },
  contentWrapper: { width: '100%', maxWidth: 400, position: 'relative' },
  backButton: { position: 'absolute', top: -20, left: 0, width: 40, height: 40, justifyContent: 'center', alignItems: 'center', zIndex: 10 },
  card: { backgroundColor: Colors.card, borderRadius: 32, padding: 28, elevation: 5, borderWidth: 1, borderColor: Colors.border },
  infoBox: { alignItems: 'center', marginBottom: 24 },
  infoIcon: { marginBottom: 16 },
  infoTitle: { fontSize: 18, fontWeight: '700', color: Colors.foreground, marginBottom: 8 },
  infoDescription: { fontSize: 14, color: Colors.mutedForeground, textAlign: 'center', lineHeight: 20 },
  emailText: { fontSize: 16, fontWeight: '600', color: Colors.primary, marginVertical: 8, textAlign: 'center' },
  infoNote: { fontSize: 12, color: Colors.mutedForeground, textAlign: 'center', marginTop: 8, fontStyle: 'italic', lineHeight: 16 },
  submitButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  disabledButton: { backgroundColor: Colors.inputBackground },
  submitButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
