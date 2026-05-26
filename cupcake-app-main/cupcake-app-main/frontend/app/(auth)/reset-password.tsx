import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { AuthHeader } from '../../components/Auth/AuthHeader';
import { useAuthStore } from '../../store/authStore';
import { CustomTextInput } from '../../components/Shared/CustomTextInput';

export default function ResetPasswordScreen() {
  const router = useRouter();
  const { token } = useLocalSearchParams<{ token?: string }>();
  const { verifyResetToken, resetPassword, isLoading } = useAuthStore();

  const [isVerifying, setIsVerifying] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [errorMessages, setErrorMessages] = useState<Record<string, string>>({});

  useEffect(() => {
    const checkToken = async () => {
      if (!token) {
        setErrorMessage('Mã liên kết đặt lại mật khẩu không hợp lệ hoặc đã thiếu.');
        setTokenValid(false);
        setIsVerifying(false);
        return;
      }

      try {
        const res = await verifyResetToken(token);
        setTokenValid(true);
        if (res && res.email) {
          setEmail(res.email);
        }
      } catch (err: any) {
        const msg = err?.response?.data?.message || err?.message || 'Liên kết đặt lại mật khẩu đã hết hạn hoặc không hợp lệ.';
        setErrorMessage(msg);
        setTokenValid(false);
      } finally {
        setIsVerifying(false);
      }
    };

    checkToken();
  }, [token]);

  const handleResetPassword = async () => {
    if (!token) return;

    const newErrors: Record<string, boolean> = {};
    const newMsgs: Record<string, string> = {};

    if (!newPassword) {
      newErrors.newPassword = true;
      newMsgs.newPassword = 'Vui lòng nhập mật khẩu mới';
    } else if (newPassword.length < 6) {
      newErrors.newPassword = true;
      newMsgs.newPassword = 'Mật khẩu phải dài ít nhất 6 ký tự';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = true;
      newMsgs.confirmPassword = 'Vui lòng xác nhận mật khẩu mới';
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = true;
      newMsgs.confirmPassword = 'Mật khẩu không trùng khớp';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setErrorMessages(newMsgs);
      return;
    }

    setErrors({});
    setErrorMessages({});

    try {
      await resetPassword({ token, newPassword });
      if (Platform.OS !== 'web') {
        Alert.alert(
          'Thành công',
          'Mật khẩu của bạn đã được cập nhật thành công! Vui lòng đăng nhập bằng mật khẩu mới.',
          [{ text: 'Đăng nhập', onPress: () => router.replace('/login') }],
          { cancelable: false }
        );
      } else {
        // Đổi trang trước khi hiện alert để tránh lỗi chặn navigation trên trình duyệt điện thoại
        router.replace('/login');
        setTimeout(() => {
          alert('Mật khẩu của bạn đã được cập nhật thành công! Vui lòng đăng nhập bằng mật khẩu mới.');
        }, 100);
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Có lỗi xảy ra khi đặt lại mật khẩu.';
      if (Platform.OS !== 'web') {
        Alert.alert('Thất bại', msg);
      } else {
        alert(msg);
      }
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
            <TouchableOpacity style={styles.backButton} onPress={() => router.replace('/login')}>
              <Feather name="arrow-left" size={24} color={Colors.mutedForeground} />
            </TouchableOpacity>

            <AuthHeader icon="key" title="Đặt lại mật khẩu" subtitle="Thiết lập mật khẩu mới cho tài khoản của bạn" />

            <Animated.View entering={FadeInDown.delay(300).duration(600)} style={styles.card}>
              {isVerifying ? (
                <View style={styles.centerBox}>
                  <ActivityIndicator size="large" color={Colors.primary} />
                  <Text style={styles.loadingText}>Đang xác thực liên kết của bạn...</Text>
                </View>
              ) : !tokenValid ? (
                <View style={styles.errorBox}>
                  <Feather name="alert-triangle" size={54} color="#ff6b6b" style={styles.icon} />
                  <Text style={styles.errorTitle}>Liên kết không hợp lệ</Text>
                  <Text style={styles.errorDescription}>{errorMessage}</Text>
                  <TouchableOpacity style={styles.actionButton} onPress={() => router.replace('/login')}>
                    <Text style={styles.actionButtonText}>Quay lại Đăng nhập</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.secondaryButton} onPress={() => router.replace('/forgot-password')}>
                    <Text style={styles.secondaryButtonText}>Gửi lại yêu cầu mới</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.formContainer}>
                  {email ? (
                    <View style={styles.emailContainer}>
                      <Text style={styles.emailLabel}>Tài khoản email:</Text>
                      <Text style={styles.emailValue}>{email}</Text>
                    </View>
                  ) : null}

                  <CustomTextInput
                    label="Mật khẩu mới"
                    fieldKey="newPassword"
                    value={newPassword}
                    onChangeText={setNewPassword}
                    placeholder="Nhập mật khẩu mới"
                    isPassword={true}
                    showPassword={showPassword}
                    onToggleShow={() => setShowPassword(!showPassword)}
                    focusedInput={focusedInput}
                    onFocusKey={setFocusedInput}
                    onBlurKey={() => setFocusedInput(null)}
                    error={errors.newPassword}
                    errorMsg={errorMessages.newPassword}
                    onClearError={(key) => {
                      setErrors((p) => ({ ...p, [key]: false }));
                      setErrorMessages((p) => ({ ...p, [key]: '' }));
                    }}
                  />

                  <CustomTextInput
                    label="Xác nhận mật khẩu mới"
                    fieldKey="confirmPassword"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="Xác nhận mật khẩu mới"
                    isPassword={true}
                    showPassword={showConfirmPassword}
                    onToggleShow={() => setShowConfirmPassword(!showConfirmPassword)}
                    focusedInput={focusedInput}
                    onFocusKey={setFocusedInput}
                    onBlurKey={() => setFocusedInput(null)}
                    error={errors.confirmPassword}
                    errorMsg={errorMessages.confirmPassword}
                    onClearError={(key) => {
                      setErrors((p) => ({ ...p, [key]: false }));
                      setErrorMessages((p) => ({ ...p, [key]: '' }));
                    }}
                  />

                  <TouchableOpacity
                    style={[styles.submitButton, isLoading && styles.disabledButton]}
                    onPress={handleResetPassword}
                    disabled={isLoading}
                    activeOpacity={0.8}
                  >
                    {isLoading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <>
                        <Text style={styles.submitButtonText}>Xác nhận đổi mật khẩu</Text>
                        <Feather name="check-circle" size={16} color="#fff" style={{ marginLeft: 8 }} />
                      </>
                    )}
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
  centerBox: { alignItems: 'center', paddingVertical: 40 },
  loadingText: { marginTop: 16, fontSize: 15, color: Colors.mutedForeground, textAlign: 'center' },
  errorBox: { alignItems: 'center', paddingVertical: 10 },
  icon: { marginBottom: 16 },
  errorTitle: { fontSize: 20, fontWeight: '700', color: Colors.foreground, marginBottom: 8 },
  errorDescription: { fontSize: 14, color: Colors.mutedForeground, textAlign: 'center', lineHeight: 20, marginBottom: 24 },
  formContainer: { gap: 16 },
  emailContainer: {
    backgroundColor: 'rgba(232, 160, 191, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(232, 160, 191, 0.15)',
    borderRadius: 16,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  emailLabel: { fontSize: 13, color: Colors.mutedForeground },
  emailValue: { fontSize: 14, fontWeight: '600', color: Colors.primary },
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
    marginTop: 12,
  },
  disabledButton: { backgroundColor: Colors.inputBackground },
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
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: { color: Colors.foreground, fontSize: 15, fontWeight: '600' },
});
