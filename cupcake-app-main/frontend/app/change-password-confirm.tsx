import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useAuthStore } from '../store/authStore';

export default function ChangePasswordConfirmScreen() {
  const { token } = useLocalSearchParams<{ token: string }>();
  const router = useRouter();
  const { confirmChangePassword, isLoading } = useAuthStore();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleConfirm = async () => {
    if (!token) {
      setError('Liên kết không hợp lệ hoặc đã bị thiếu.');
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setError('Mật khẩu mới phải có ít nhất 6 ký tự');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    setError('');

    try {
      await confirmChangePassword({ token, newPassword });
      setIsSuccess(true);
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Không thể đổi mật khẩu';
      setError(msg);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          {isSuccess ? (
            <Animated.View entering={FadeInDown} style={styles.successContainer}>
              <View style={[styles.iconContainer, { backgroundColor: 'rgba(34, 197, 94, 0.1)' }]}>
                <Feather name="check-circle" size={50} color="#22c55e" />
              </View>
              <Text style={styles.title}>Đổi mật khẩu thành công!</Text>
              <Text style={styles.subtitle}>Mật khẩu của bạn đã được cập nhật. Bây giờ bạn có thể tiếp tục sử dụng ứng dụng với mật khẩu mới.</Text>
              <TouchableOpacity
                style={[styles.submitBtn, { width: '100%' }]}
                onPress={() => router.replace('/')}
              >
                <Text style={styles.submitBtnText}>Về trang chủ</Text>
              </TouchableOpacity>
            </Animated.View>
          ) : (
            <>
              <View style={styles.iconContainer}>
                <Feather name="lock" size={50} color={Colors.primary} />
              </View>

              <Text style={styles.title}>Đặt lại mật khẩu</Text>
              <Text style={styles.subtitle}>Vui lòng nhập mật khẩu mới cho tài khoản của bạn.</Text>

              <View style={styles.formCard}>
                <Text style={styles.label}>Mật khẩu mới</Text>
                <View style={styles.passwordWrapper}>
                  <TextInput
                    style={[styles.input, Platform.OS === 'web' && { outlineStyle: 'none' } as any]}
                    value={newPassword}
                    onChangeText={setNewPassword}
                    placeholder="Ít nhất 6 ký tự"
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                    <Feather name={showPassword ? 'eye' : 'eye-off'} size={20} color="#9ca3af" />
                  </TouchableOpacity>
                </View>

                <Text style={styles.label}>Xác nhận mật khẩu</Text>
                <View style={styles.passwordWrapper}>
                  <TextInput
                    style={[styles.input, Platform.OS === 'web' && { outlineStyle: 'none' } as any]}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="Nhập lại mật khẩu"
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                    <Feather name={showPassword ? 'eye' : 'eye-off'} size={20} color="#9ca3af" />
                  </TouchableOpacity>
                </View>

                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                <TouchableOpacity
                  style={[styles.submitBtn, isLoading && { opacity: 0.7 }]}
                  onPress={handleConfirm}
                  disabled={isLoading}
                >
                  <Text style={styles.submitBtnText}>{isLoading ? 'Đang xử lý...' : 'Xác nhận'}</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  scrollContent: { padding: 24, paddingTop: 80 },
  content: { alignItems: 'center' },
  successContainer: { alignItems: 'center', width: '100%', paddingVertical: 20 },
  iconContainer: {
    width: 100, height: 100, backgroundColor: 'rgba(232, 160, 191, 0.2)',
    borderRadius: 50, justifyContent: 'center', alignItems: 'center', marginBottom: 24,
  },
  title: { fontSize: 26, fontWeight: '800', color: '#111827', marginBottom: 12 },
  subtitle: { textAlign: 'center', color: '#6b7280', fontSize: 16, marginBottom: 32 },
  formCard: {
    width: '100%', backgroundColor: '#f9fafb', borderRadius: 24,
    padding: 24, borderWidth: 1, borderColor: '#f3f4f6',
  },
  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 },
  passwordWrapper: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: 'white',
    borderRadius: 16, borderWidth: 1, borderColor: '#e5e7eb', marginBottom: 20,
  },
  input: { flex: 1, padding: 16, fontSize: 16 },
  eyeBtn: { padding: 16 },
  submitBtn: {
    backgroundColor: Colors.primary, padding: 18, borderRadius: 16, alignItems: 'center', marginTop: 10,
    shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4,
  },
  submitBtnText: { color: 'white', fontSize: 16, fontWeight: '700' },
  errorText: { color: '#ef4444', fontSize: 13, marginBottom: 16, textAlign: 'center' },
});
