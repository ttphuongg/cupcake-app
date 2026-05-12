/**
 * app/delete-account.tsx — Màn hình Xóa tài khoản
 * Logic: useAuthStore.requestDeleteAccountOtp() + verifyDeleteAccountOtp()
 * UI: dùng OtpModal từ components/
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';
import { Colors } from '@/constants/theme';
import { useAuthStore } from '../store/authStore';
import { OtpModal } from '../components/OtpModal';

export default function DeleteAccountScreen() {
  const router = useRouter();
  const { requestDeleteAccountOtp, verifyDeleteAccountOtp, isLoading } = useAuthStore();

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // OTP state
  const [otpModalVisible, setOtpModalVisible] = useState(false);
  const [targetIdentifier, setTargetIdentifier] = useState('');
  const [countdown, setCountdown] = useState(0);

  // Đếm ngược
  React.useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (otpModalVisible && countdown > 0) {
      timer = setInterval(() => setCountdown((p) => p - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [otpModalVisible, countdown]);

  const handleDeleteRequest = async () => {
    if (!password) {
      setError(true);
      setErrorMessage('Vui lòng nhập mật khẩu xác nhận');
      return;
    }
    setError(false);
    setErrorMessage('');

    try {
      const { targetIdentifier: ti } = await requestDeleteAccountOtp(password);
      setTargetIdentifier(ti);
      setOtpModalVisible(true);
      if (countdown === 0) setCountdown(60);
      Alert.alert('Xác thực', 'Mã OTP đã được gửi.');
    } catch (err: unknown) {
      const msg: string =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        (err instanceof Error ? err.message : 'Xác nhận mật khẩu thất bại');

      if (msg === 'Mật khẩu hiện tại không chính xác') {
        setError(true);
        setErrorMessage(msg);
      } else {
        Alert.alert('Lỗi', msg);
      }
    }
  };

  const handleResendOtp = async () => {
    if (countdown > 0) return;
    setCountdown(60);
    await handleDeleteRequest();
  };

  const handleVerifyAndDelete = async (otp: string) => {
    try {
      await verifyDeleteAccountOtp({ otp, targetIdentifier });
      setOtpModalVisible(false);
      if (Platform.OS === 'web') {
        window.alert('Tài khoản của bạn đã được xóa vĩnh viễn. Tạm biệt!');
        router.replace('/register');
      } else {
        Alert.alert(
          'Thành công',
          'Tài khoản của bạn đã được xóa vĩnh viễn. Tạm biệt!',
          [{ text: 'Đăng ký tài khoản mới', onPress: () => router.replace('/register') }],
          { cancelable: false },
        );
      }
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Mã OTP không chính xác';
      Alert.alert('Lỗi', msg);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Feather name="chevron-left" size={30} color="#1f2937" />
        </TouchableOpacity>

        <View style={styles.content}>
          <Animated.View entering={ZoomIn} style={styles.iconContainer}>
            <Feather name="alert-triangle" size={50} color={Colors.primary} />
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(200)}>
            <Text style={styles.title}>Xóa tài khoản?</Text>
            <Text style={styles.warningText}>
              Hành động này <Text style={{ fontWeight: 'bold' }}>không thể hoàn tác</Text>. Tất cả dữ liệu, hồ sơ và cài đặt của bạn sẽ bị xóa vĩnh viễn khỏi hệ thống của chúng tôi.
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(400)} style={styles.formCard}>
            <Text style={styles.label}>Nhập mật khẩu hiện tại</Text>
            <View style={[styles.passwordWrapper, error && styles.inputError]}>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (error) setError(false);
                  if (errorMessage) setErrorMessage('');
                }}
                placeholder="Mật khẩu của bạn"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                textContentType="none"
                autoComplete="off"
                importantForAutofill="no"
                autoCorrect={false}
                spellCheck={false}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                <Feather name={showPassword ? 'eye' : 'eye-off'} size={20} color={error ? '#ef4444' : '#9ca3af'} />
              </TouchableOpacity>
            </View>
            {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

            <TouchableOpacity
              style={[styles.deleteBtn, isLoading && { opacity: 0.7 }]}
              onPress={handleDeleteRequest}
              disabled={isLoading}
            >
              <Text style={styles.deleteBtnText}>
                {isLoading ? 'Đang xử lý...' : 'Xác nhận xóa tài khoản'}
              </Text>
            </TouchableOpacity>
          </Animated.View>

          <TouchableOpacity style={styles.cancelBtn} onPress={() => router.back()}>
            <Text style={styles.cancelBtnText}>Tôi đã đổi ý, giữ lại tài khoản</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <OtpModal
        visible={otpModalVisible}
        targetIdentifier={targetIdentifier}
        isLoading={isLoading}
        countdown={countdown}
        onVerify={handleVerifyAndDelete}
        onResend={handleResendOtp}
        onClose={() => setOtpModalVisible(false)}
        title="Bước cuối cùng"
        verifyBtnLabel="Xóa vĩnh viễn"
        variant="bottom-sheet"
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  scrollContent: { padding: 24, paddingTop: 60 },
  backButton: { marginBottom: 20 },
  content: { alignItems: 'center' },
  iconContainer: {
    width: 100, height: 100, backgroundColor: 'rgba(232, 160, 191, 0.2)',
    borderRadius: 50, justifyContent: 'center', alignItems: 'center', marginBottom: 24,
  },
  title: { fontSize: 30, fontWeight: '800', color: '#111827', marginBottom: 12 },
  warningText: { textAlign: 'center', color: '#6b7280', fontSize: 16, lineHeight: 24, marginBottom: 32 },
  formCard: {
    width: '100%', backgroundColor: '#f9fafb', borderRadius: 24,
    padding: 24, borderWidth: 1, borderColor: '#f3f4f6',
  },
  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 },
  passwordWrapper: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: 'white',
    borderRadius: 16, borderWidth: 1, borderColor: '#e5e7eb', marginBottom: 24,
  },
  input: {
    flex: 1, padding: 16, fontSize: 16,
    // @ts-ignore — web-only property
    outlineStyle: 'none',
  },
  eyeBtn: { padding: 16 },
  deleteBtn: {
    backgroundColor: Colors.primary, padding: 18, borderRadius: 16, alignItems: 'center',
    shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4,
  },
  deleteBtnText: { color: 'white', fontSize: 16, fontWeight: '700' },
  cancelBtn: { marginTop: 24 },
  cancelBtnText: { color: '#6b7280', fontWeight: '600' },
  inputError: { borderColor: '#ef4444', borderWidth: 2 },
  errorText: { color: '#ef4444', fontSize: 12, fontWeight: '500', marginTop: -16, marginBottom: 16, marginLeft: 4 },
});
