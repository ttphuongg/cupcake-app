import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { AuthHeader } from '../components/Auth/AuthHeader';
import { useAuthStore } from '../store/authStore';

export default function DeleteAccountConfirmScreen() {
  const router = useRouter();
  const { token } = useLocalSearchParams<{ token?: string }>();
  const { deleteAccount, isLoading } = useAuthStore();

  const handleConfirmDelete = async () => {
    if (!token) {
      if (Platform.OS === 'web') window.alert('Liên kết xác nhận không hợp lệ.');
      else Alert.alert('Lỗi', 'Liên kết xác nhận không hợp lệ.');
      return;
    }

    try {
      await deleteAccount(token);
      if (Platform.OS === 'web') {
        router.replace('/register');
        setTimeout(() => {
          window.alert('Tài khoản của bạn đã được xóa vĩnh viễn. Tạm biệt!');
        }, 100);
      } else {
        Alert.alert(
          'Thành công',
          'Tài khoản của bạn đã được xóa vĩnh viễn. Tạm biệt!',
          [{ text: 'Đóng', onPress: () => router.replace('/register') }],
          { cancelable: false },
        );
      }
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Mã xác nhận không hợp lệ hoặc đã hết hạn';
      if (Platform.OS === 'web') window.alert('Lỗi: ' + msg);
      else Alert.alert('Lỗi', msg);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.mainContainer}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" bounces={false}>
        <LinearGradient
          colors={['rgba(239, 68, 68, 0.15)', 'rgba(239, 68, 68, 0.05)', 'rgba(255, 255, 255, 1)']}
          style={styles.gradientContainer}
        >
          <Animated.View entering={ZoomIn.duration(500).springify()} style={styles.contentWrapper}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.replace('/login')}>
              <Feather name="arrow-left" size={24} color={Colors.mutedForeground} />
            </TouchableOpacity>

            <AuthHeader icon="trash-2" title="Xóa tài khoản" subtitle="Xác nhận xóa vĩnh viễn tài khoản của bạn" />

            <Animated.View entering={FadeInDown.delay(300).duration(600)} style={styles.card}>
              {!token ? (
                <View style={styles.errorBox}>
                  <Feather name="alert-triangle" size={54} color="#ff6b6b" style={styles.icon} />
                  <Text style={styles.errorTitle}>Liên kết không hợp lệ</Text>
                  <Text style={styles.errorDescription}>Vui lòng kiểm tra lại đường dẫn từ email.</Text>
                  <TouchableOpacity style={styles.actionButton} onPress={() => router.replace('/login')}>
                    <Text style={styles.actionButtonText}>Quay lại Đăng nhập</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.formContainer}>
                  <View style={styles.warningBox}>
                    <Feather name="alert-octagon" size={32} color="#ef4444" style={styles.warningIcon} />
                    <Text style={styles.warningTitle}>Cảnh báo nguy hiểm!</Text>
                    <Text style={styles.warningText}>
                      Hành động này <Text style={{ fontWeight: 'bold', color: '#ef4444' }}>không thể hoàn tác</Text>. Tất cả dữ liệu, hồ sơ và cài đặt của bạn sẽ bị xóa vĩnh viễn khỏi hệ thống của chúng tôi.
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={[styles.submitButton, isLoading && styles.disabledButton]}
                    onPress={handleConfirmDelete}
                    disabled={isLoading}
                    activeOpacity={0.8}
                  >
                    {isLoading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <>
                        <Text style={styles.submitButtonText}>Xác nhận xóa vĩnh viễn</Text>
                        <Feather name="trash-2" size={16} color="#fff" style={{ marginLeft: 8 }} />
                      </>
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.secondaryButton} onPress={() => router.replace('/login')}>
                    <Text style={styles.secondaryButtonText}>Tôi đổi ý, không xóa nữa</Text>
                  </TouchableOpacity>
                </View>
              )}
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
  errorBox: { alignItems: 'center', paddingVertical: 10 },
  icon: { marginBottom: 16 },
  errorTitle: { fontSize: 20, fontWeight: '700', color: Colors.foreground, marginBottom: 8 },
  errorDescription: { fontSize: 14, color: Colors.mutedForeground, textAlign: 'center', lineHeight: 20, marginBottom: 24 },
  formContainer: { gap: 16 },
  warningBox: {
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 8,
  },
  warningIcon: { marginBottom: 12 },
  warningTitle: { fontSize: 18, fontWeight: '700', color: '#ef4444', marginBottom: 8 },
  warningText: { fontSize: 14, color: Colors.mutedForeground, textAlign: 'center', lineHeight: 22 },
  submitButton: {
    backgroundColor: '#ef4444',
    paddingVertical: 16,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
    marginTop: 8,
  },
  disabledButton: { backgroundColor: '#fca5a5' },
  submitButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  actionButton: {
    width: '100%',
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  actionButtonText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  secondaryButton: {
    width: '100%',
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: { color: Colors.mutedForeground, fontSize: 15, fontWeight: '600' },
});
