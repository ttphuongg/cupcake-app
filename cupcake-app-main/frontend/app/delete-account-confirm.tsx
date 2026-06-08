import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useAuthStore } from '../store/authStore';

export default function DeleteAccountConfirmScreen() {
  const { token } = useLocalSearchParams<{ token: string }>();
  const router = useRouter();
  const { confirmDeleteAccount, isLoading } = useAuthStore();

  const [error, setError] = useState('');

  const handleConfirm = async () => {
    if (!token) {
      setError('Liên kết không hợp lệ hoặc đã bị thiếu.');
      return;
    }

    setError('');

    try {
      await confirmDeleteAccount(token);
      if (Platform.OS === 'web') {
        window.alert('Tài khoản của bạn đã được xóa thành công. Hẹn gặp lại!');
        router.replace('/');
      } else {
        Alert.alert('Thành công', 'Tài khoản của bạn đã được xóa thành công. Hẹn gặp lại!', [
          { text: 'Về trang chủ', onPress: () => router.replace('/') }
        ]);
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Không thể xóa tài khoản';
      setError(msg);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <View style={[styles.iconContainer, { backgroundColor: 'rgba(239, 68, 68, 0.1)' }]}>
            <Feather name="trash-2" size={50} color="#ef4444" />
          </View>

          <Text style={styles.title}>Xác nhận xóa tài khoản</Text>
          <Text style={styles.subtitle}>
            Bạn đang yêu cầu xóa vĩnh viễn tài khoản này. Vui lòng nhấn xác nhận để hoàn tất.
          </Text>

          <View style={styles.formCard}>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <TouchableOpacity
              style={[styles.submitBtn, isLoading && { opacity: 0.7 }]}
              onPress={handleConfirm}
              disabled={isLoading}
            >
              <Text style={styles.submitBtnText}>{isLoading ? 'Đang xử lý...' : 'Xác nhận Xóa Vĩnh Viễn'}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => router.replace('/')}
              disabled={isLoading}
            >
              <Text style={styles.cancelBtnText}>Hủy bỏ</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  scrollContent: { padding: 24, paddingTop: 80 },
  content: { alignItems: 'center' },
  iconContainer: {
    width: 100, height: 100,
    borderRadius: 50, justifyContent: 'center', alignItems: 'center', marginBottom: 24,
  },
  title: { fontSize: 26, fontWeight: '800', color: '#111827', marginBottom: 12 },
  subtitle: { textAlign: 'center', color: '#6b7280', fontSize: 16, marginBottom: 32 },
  formCard: {
    width: '100%', backgroundColor: '#f9fafb', borderRadius: 24,
    padding: 24, borderWidth: 1, borderColor: '#f3f4f6',
  },
  submitBtn: {
    backgroundColor: '#ef4444', padding: 18, borderRadius: 16, alignItems: 'center', marginTop: 10,
    shadowColor: '#ef4444', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4,
  },
  submitBtnText: { color: 'white', fontSize: 16, fontWeight: '700' },
  cancelBtn: { marginTop: 24, alignItems: 'center' },
  cancelBtnText: { color: '#6b7280', fontSize: 16, fontWeight: '600' },
  errorText: { color: '#ef4444', fontSize: 13, marginBottom: 16, textAlign: 'center' },
});
