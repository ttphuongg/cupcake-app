import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TouchableOpacity, Text, View, ActivityIndicator, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useAuthStore } from '../../store/authStore';
import { AuthHeader } from '../../components/Auth/AuthHeader';
import { CustomTextInput } from '../../components/Shared/CustomTextInput';

export default function ResetPasswordScreen() {
  const router = useRouter();
  const { token } = useLocalSearchParams();
  const { verifyResetToken, resetPassword } = useAuthStore();

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [tokenStatus, setTokenStatus] = useState<'verifying' | 'valid' | 'invalid'>('verifying');
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [errorMessages, setErrorMessages] = useState<Record<string, string>>({});

  useEffect(() => {
    const checkToken = async () => {
      if (!token) {
        setTokenStatus('invalid');
        setErrorMessage('Không tìm thấy mã Token để đặt lại mật khẩu.');
        setIsLoading(false);
        return;
      }
      try {
        const result = await verifyResetToken(token as string);
        setEmail(result.email);
        setTokenStatus('valid');
      } catch (err: unknown) {
        setTokenStatus('invalid');
        const msg =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
          (err instanceof Error ? err.message : 'Đường dẫn đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.');
        setErrorMessage(msg);
      } finally {
        setIsLoading(false);
      }
    };

    checkToken();
  }, [token]);

  const handleSubmit = async () => {
    const newErrors: Record<string, boolean> = {};
    const newMsgs: Record<string, string> = {};

    if (!password) {
      newErrors.password = true;
      newMsgs.password = 'Vui lòng nhập mật khẩu mới';
    } else if (password.length < 6) {
      newErrors.password = true;
      newMsgs.password = 'Mật khẩu phải từ 6 ký tự trở lên';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = true;
      newMsgs.confirmPassword = 'Vui lòng xác nhận mật khẩu';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = true;
      newMsgs.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setErrorMessages(newMsgs);
      return;
    }

    setErrors({});
    setErrorMessages({});
    setIsSubmitting(true);

    try {
      await resetPassword({ token: token as string, newPassword: password });
      setIsSuccess(true);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Không thể đặt lại mật khẩu. Vui lòng thử lại.';
      Alert.alert('Lỗi', msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.mainContainer}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" bounces={false}>
        <LinearGradient
          colors={['rgba(192, 219, 234, 0.2)', 'rgba(186, 144, 198, 0.1)', 'rgba(232, 160, 191, 0.2)']}
          style={styles.gradientContainer}
        >
          <Animated.View entering={ZoomIn.duration(500).springify()} style={styles.contentWrapper}>
            <AuthHeader icon="lock" title="Đổi mật khẩu" subtitle="Thiết lập mật khẩu mới cho tài khoản" color={Colors.primary} />

            <Animated.View entering={FadeInDown.delay(300).duration(600)} style={styles.card}>
              {isLoading ? (
                <View style={styles.loaderContainer}>
                  <ActivityIndicator size="large" color={Colors.primary} />
                  <Text style={styles.loaderText}>Đang xác thực liên kết...</Text>
                </View>
              ) : tokenStatus === 'invalid' ? (
                <View style={styles.errorContainer}>
                  <View style={styles.errorIconWrapper}>
                    <Feather name="alert-circle" size={48} color={Colors.danger} />
                  </View>
                  <Text style={styles.errorTitle}>Liên kết không hợp lệ</Text>
                  <Text style={styles.errorText}>{errorMessage}</Text>
                  <TouchableOpacity
                    style={styles.errorBtn}
                    onPress={() => router.replace('/forgot-password')}
                  >
                    <Text style={styles.errorBtnText}>Yêu cầu liên kết mới</Text>
                  </TouchableOpacity>
                </View>
              ) : isSuccess ? (
                <Animated.View entering={FadeInDown} style={styles.successContainer}>
                  <View style={styles.successIconWrapper}>
                    <Feather name="check-circle" size={50} color="#22c55e" />
                  </View>
                  <Text style={styles.successTitle}>Đổi mật khẩu thành công!</Text>
                  <Text style={styles.successText}>Mật khẩu của bạn đã được cập nhật. Bạn có thể sử dụng mật khẩu mới để đăng nhập.</Text>
                  <TouchableOpacity
                    style={styles.successBtn}
                    onPress={() => router.replace('/login')}
                  >
                    <Text style={styles.successBtnText}>Đăng nhập ngay</Text>
                  </TouchableOpacity>
                </Animated.View>
              ) : (
                <Animated.View style={styles.formContainer} entering={FadeInDown}>
                  <Text style={styles.emailLabel}>Đang đặt lại mật khẩu cho:</Text>
                  <Text style={styles.emailValue}>{email}</Text>

                  <CustomTextInput
                    label="Mật khẩu mới"
                    fieldKey="password"
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Tối thiểu 6 ký tự"
                    isPassword
                    showPassword={showPassword}
                    onToggleShow={() => setShowPassword(!showPassword)}
                    focusedInput={focusedInput}
                    onFocusKey={setFocusedInput}
                    onBlurKey={() => setFocusedInput(null)}
                    error={errors.password}
                    errorMsg={errorMessages.password}
                    onClearError={(key) => {
                      setErrors((prev) => ({ ...prev, [key]: false }));
                      setErrorMessages((prev) => ({ ...prev, [key]: '' }));
                    }}
                  />

                  <CustomTextInput
                    label="Xác nhận mật khẩu"
                    fieldKey="confirmPassword"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="Nhập lại mật khẩu mới"
                    isPassword
                    showPassword={showConfirmPassword}
                    onToggleShow={() => setShowConfirmPassword(!showConfirmPassword)}
                    focusedInput={focusedInput}
                    onFocusKey={setFocusedInput}
                    onBlurKey={() => setFocusedInput(null)}
                    error={errors.confirmPassword}
                    errorMsg={errorMessages.confirmPassword}
                    onClearError={(key) => {
                      setErrors((prev) => ({ ...prev, [key]: false }));
                      setErrorMessages((prev) => ({ ...prev, [key]: '' }));
                    }}
                  />

                  <TouchableOpacity onPress={handleSubmit} activeOpacity={0.8} disabled={isSubmitting}>
                    <Animated.View style={styles.submitButton} entering={FadeInDown.delay(100)}>
                      {isSubmitting ? (
                        <ActivityIndicator size="small" color="white" />
                      ) : (
                        <Text style={styles.submitButtonText}>Xác nhận Đổi</Text>
                      )}
                    </Animated.View>
                  </TouchableOpacity>
                </Animated.View>
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
  gradientContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 40 },
  contentWrapper: { width: '100%', maxWidth: 400 },
  card: { backgroundColor: Colors.card, borderRadius: 32, padding: 32, elevation: 5, borderWidth: 1, borderColor: Colors.border },
  loaderContainer: { alignItems: 'center', paddingVertical: 30 },
  loaderText: { marginTop: 16, fontSize: 14, color: Colors.mutedForeground },
  errorContainer: { alignItems: 'center', paddingVertical: 10 },
  errorIconWrapper: {
    width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(239, 68, 68, 0.1)',
    justifyContent: 'center', alignItems: 'center', marginBottom: 20
  },
  errorTitle: { fontSize: 20, fontWeight: '700', color: Colors.danger, marginBottom: 12 },
  errorText: { fontSize: 14, color: Colors.mutedForeground, textAlign: 'center', lineHeight: 20, marginBottom: 24 },
  errorBtn: {
    backgroundColor: Colors.primary, borderRadius: 20, paddingVertical: 15, paddingHorizontal: 24,
    alignItems: 'center', width: '100%', ...Platform.select({ ios: { shadowColor: Colors.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 12 }, android: { elevation: 6 } })
  },
  errorBtnText: { color: 'white', fontSize: 15, fontWeight: '700' },
  successContainer: { alignItems: 'center', paddingVertical: 20 },
  successIconWrapper: {
    width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(34, 197, 94, 0.1)',
    justifyContent: 'center', alignItems: 'center', marginBottom: 20
  },
  successTitle: { fontSize: 20, fontWeight: '700', color: Colors.foreground, marginBottom: 12 },
  successText: { fontSize: 14, color: Colors.mutedForeground, textAlign: 'center', lineHeight: 20, marginBottom: 24 },
  successBtn: {
    backgroundColor: Colors.primary, borderRadius: 20, paddingVertical: 15, paddingHorizontal: 24,
    alignItems: 'center', width: '100%', ...Platform.select({ ios: { shadowColor: Colors.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 12 }, android: { elevation: 6 } })
  },
  successBtnText: { color: 'white', fontSize: 15, fontWeight: '700' },
  formContainer: { gap: 16 },
  emailLabel: { fontSize: 13, color: Colors.mutedForeground, textAlign: 'center' },
  emailValue: { fontSize: 16, fontWeight: '600', color: Colors.foreground, textAlign: 'center', marginBottom: 10 },
  submitButton: {
    backgroundColor: Colors.primary, borderRadius: 20, paddingVertical: 18,
    alignItems: 'center', marginTop: 12, height: 56, justifyContent: 'center',
    shadowColor: Colors.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 6,
  },
  submitButtonText: { color: 'white', fontSize: 17, fontWeight: '700' },
});
