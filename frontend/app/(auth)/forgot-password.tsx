/**
 * app/(auth)/forgot-password.tsx — Màn hình Quên mật khẩu
 * Logic: useAuthStore.forgotPassword() + resetPassword()
 * UI: giữ nguyên StyleSheet, sửa Colors.light.x → Colors.x
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
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp, ZoomIn } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useAuthStore } from '../../store/authStore';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { forgotPassword, resetPassword, isLoading } = useAuthStore();

  const [identifier, setIdentifier]           = useState('');
  const [targetIdentifier, setTargetIdentifier] = useState('');
  const [otpCode, setOtpCode]                 = useState('');
  const [newPassword, setNewPassword]         = useState('');
  const [isOtpStep, setIsOtpStep]             = useState(false);
  const [focusedInput, setFocusedInput]       = useState<string | null>(null);
  const [errors, setErrors]                   = useState<Record<string, boolean>>({});
  const [errorMessages, setErrorMessages]     = useState<Record<string, string>>({});
  const [showPassword, setShowPassword]       = useState(false);
  const [countdown, setCountdown]             = useState(0);

  // Đếm ngược
  React.useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (isOtpStep && countdown > 0) {
      timer = setInterval(() => setCountdown((p) => p - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isOtpStep, countdown]);

  const handleRequestOTP = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;

    if (!identifier) {
      setErrors({ identifier: true });
      setErrorMessages({ identifier: 'Vui lòng nhập email hoặc sdt' });
      return;
    }
    if (!emailRegex.test(identifier) && !phoneRegex.test(identifier)) {
      setErrors({ identifier: true });
      setErrorMessages({ identifier: 'Thông tin không hợp lệ' });
      return;
    }
    setErrors({});
    setErrorMessages({});

    try {
      await forgotPassword(identifier);
      setIsOtpStep(true);
      if (countdown === 0) setCountdown(60);
      Alert.alert('Xác thực', 'Mã OTP đã được gửi đến tài khoản của bạn.');
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        (err instanceof Error ? err.message : 'Không tìm thấy tài khoản');
      if (msg === 'Tài khoản không tồn tại') {
        setErrors({ identifier: true });
        setErrorMessages({ identifier: msg });
      } else {
        Alert.alert('Lỗi', msg);
      }
    }
  };

  const handleResendOtp = async () => {
    if (countdown > 0) return;
    setCountdown(60);
    await handleRequestOTP();
  };

  const handleVerifyAndReset = async () => {
    const newErrors: Record<string, boolean> = {};
    const newMsgs: Record<string, string> = {};

    if (!otpCode) { newErrors.otp = true; newMsgs.otp = 'Vui lòng nhập mã OTP'; }
    if (!newPassword) { newErrors.newPassword = true; newMsgs.newPassword = 'Vui lòng nhập mật khẩu mới'; }
    else if (newPassword.length < 6) { newErrors.newPassword = true; newMsgs.newPassword = 'Mật khẩu ít nhất 6 ký tự'; }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setErrorMessages(newMsgs);
      return;
    }

    try {
      await resetPassword({ email: identifier, otp: otpCode, newPassword });
      Alert.alert('Thành công', 'Mật khẩu của bạn đã được cập nhật!', [
        { text: 'Đăng nhập ngay', onPress: () => router.replace('/login') },
      ]);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Mã OTP không đúng hoặc đã hết hạn';
      if (msg.includes('OTP')) {
        setErrors({ otp: true });
        setErrorMessages({ otp: msg });
      } else {
        Alert.alert('Lỗi', msg);
      }
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
            {/* Back Button */}
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <Feather name="arrow-left" size={24} color={Colors.mutedForeground} />
            </TouchableOpacity>

            {/* Header */}
            <View style={styles.header}>
              <Animated.View entering={ZoomIn.delay(200).springify()} style={styles.logoContainer}>
                <Feather name="help-circle" size={40} color="white" />
              </Animated.View>
              <Text style={styles.titleText}>Quên mật khẩu</Text>
              <Text style={styles.subtitleText}>Nhập email để nhận mã đặt lại</Text>
            </View>

            {/* Form */}
            <Animated.View entering={FadeInDown.delay(300).duration(600)} style={styles.card}>
              <View style={styles.inputStack}>
                {!isOtpStep ? (
                  <>
                    <View style={styles.field}>
                      <Text style={styles.fieldLabel}>Email hoặc Số điện thoại</Text>
                      <TextInput
                        style={[
                          styles.textInput,
                          focusedInput === 'identifier' && styles.textInputActive,
                          errors.identifier && styles.textInputError,
                        ]}
                        value={identifier}
                        onChangeText={(text) => {
                          setIdentifier(text);
                          if (errors.identifier) setErrors((p) => ({ ...p, identifier: false }));
                          if (errorMessages.identifier) setErrorMessages((p) => ({ ...p, identifier: '' }));
                        }}
                        placeholder="Email hoặc SĐT"
                        placeholderTextColor="#9ca3af"
                        autoCapitalize="none"
                        textContentType="none"
                        autoComplete="off"
                        importantForAutofill="no"
                        autoCorrect={false}
                        spellCheck={false}
                        onFocus={() => setFocusedInput('identifier')}
                        onBlur={() => setFocusedInput(null)}
                      />
                      {errorMessages.identifier ? (
                        <Text style={styles.errorText}>{errorMessages.identifier}</Text>
                      ) : null}
                    </View>

                    <TouchableOpacity onPress={handleRequestOTP} activeOpacity={0.8} disabled={isLoading}>
                      <Animated.View style={styles.primaryButton} entering={FadeInUp.delay(400)}>
                        <Text style={styles.primaryButtonText}>
                          {isLoading ? 'Đang gửi...' : 'Gửi yêu cầu'}
                        </Text>
                      </Animated.View>
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    {/* OTP */}
                    <View style={styles.field}>
                      <Text style={styles.fieldLabel}>Mã xác thực OTP</Text>
                      <TextInput
                        style={[
                          styles.textInput,
                          focusedInput === 'otp' && styles.textInputActive,
                          errors.otp && styles.textInputError,
                        ]}
                        value={otpCode}
                        onChangeText={(text) => {
                          setOtpCode(text);
                          if (errors.otp) setErrors((p) => ({ ...p, otp: false }));
                          if (errorMessages.otp) setErrorMessages((p) => ({ ...p, otp: '' }));
                        }}
                        placeholder="123456"
                        placeholderTextColor="#9ca3af"
                        keyboardType="number-pad"
                        maxLength={6}
                        textContentType="none"
                        autoComplete="off"
                        importantForAutofill="no"
                        autoCorrect={false}
                        spellCheck={false}
                        onFocus={() => setFocusedInput('otp')}
                        onBlur={() => setFocusedInput(null)}
                      />
                      {errorMessages.otp ? <Text style={styles.errorText}>{errorMessages.otp}</Text> : null}
                    </View>

                    {/* Mật khẩu mới */}
                    <View style={styles.field}>
                      <Text style={styles.fieldLabel}>Mật khẩu mới</Text>
                      <View style={styles.passwordContainer}>
                        <TextInput
                          style={[
                            styles.textInput,
                            styles.passwordInput,
                            focusedInput === 'newPassword' && styles.textInputActive,
                            errors.newPassword && styles.textInputError,
                          ]}
                          value={newPassword}
                          onChangeText={(text) => {
                            setNewPassword(text);
                            if (errors.newPassword) setErrors((p) => ({ ...p, newPassword: false }));
                            if (errorMessages.newPassword) setErrorMessages((p) => ({ ...p, newPassword: '' }));
                          }}
                          placeholder="••••••••"
                          placeholderTextColor="#9ca3af"
                          secureTextEntry={!showPassword}
                          textContentType="none"
                          autoComplete="off"
                          importantForAutofill="no"
                          autoCorrect={false}
                          spellCheck={false}
                          onFocus={() => setFocusedInput('newPassword')}
                          onBlur={() => setFocusedInput(null)}
                        />
                        <TouchableOpacity
                          style={styles.eyeIcon}
                          onPress={() => setShowPassword(!showPassword)}
                        >
                          <Feather
                            name={showPassword ? 'eye' : 'eye-off'}
                            size={20}
                            color={errors.newPassword ? '#ef4444' : '#9ca3af'}
                          />
                        </TouchableOpacity>
                      </View>
                      {errorMessages.newPassword ? (
                        <Text style={styles.errorText}>{errorMessages.newPassword}</Text>
                      ) : null}
                    </View>

                    <TouchableOpacity onPress={handleVerifyAndReset} activeOpacity={0.8} disabled={isLoading}>
                      <Animated.View style={styles.primaryButton} entering={FadeInUp.delay(200)}>
                        <Text style={styles.primaryButtonText}>
                          {isLoading ? 'Đang xử lý...' : 'Cập nhật mật khẩu'}
                        </Text>
                      </Animated.View>
                    </TouchableOpacity>

                    {/* Gửi lại OTP */}
                    <Animated.View entering={FadeInUp.delay(300)}>
                      <TouchableOpacity
                        style={[styles.resendBtn, countdown > 0 && styles.resendBtnDisabled]}
                        onPress={handleResendOtp}
                        disabled={countdown > 0 || isLoading}
                      >
                        <Text style={[styles.resendBtnText, countdown > 0 && styles.resendBtnTextDisabled]}>
                          {countdown > 0 ? `Gửi lại mã OTP sau ${countdown}s` : 'Gửi lại mã OTP'}
                        </Text>
                      </TouchableOpacity>
                    </Animated.View>

                    <TouchableOpacity onPress={() => setIsOtpStep(false)} style={styles.backToEmail}>
                      <Text style={styles.backToEmailText}>Quay lại nhập email</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </Animated.View>

            {/* Footer */}
            <Animated.View entering={FadeInUp.delay(500).duration(500)} style={styles.footer}>
              <Text style={styles.footerBaseText}>
                Bạn đã nhớ lại mật khẩu?{' '}
                <TouchableOpacity onPress={() => router.back()}>
                  <Text style={styles.footerLinkText}>Đăng nhập</Text>
                </TouchableOpacity>
              </Text>
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
  contentWrapper: { width: '100%', maxWidth: 400, position: 'relative' },
  backButton: { position: 'absolute', top: -20, left: 0, width: 40, height: 40, justifyContent: 'center', alignItems: 'center', zIndex: 10 },
  header: { alignItems: 'center', marginBottom: 32 },
  logoContainer: {
    width: 80, height: 80, backgroundColor: Colors.accent, borderRadius: 24,
    justifyContent: 'center', alignItems: 'center', marginBottom: 16,
    shadowColor: Colors.accent, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 15, elevation: 10,
  },
  titleText: { fontSize: 28, fontWeight: '800', color: Colors.foreground, marginBottom: 8 },
  subtitleText: { fontSize: 16, color: Colors.mutedForeground },
  card: { backgroundColor: Colors.card, borderRadius: 32, padding: 32, elevation: 5, borderWidth: 1, borderColor: Colors.border },
  inputStack: { gap: 20 },
  field: { gap: 8 },
  fieldLabel: { fontSize: 14, fontWeight: '600', color: Colors.foreground, marginLeft: 4 },
  textInput: {
    backgroundColor: Colors.inputBackground, borderRadius: 16, paddingHorizontal: 16,
    paddingVertical: 14, fontSize: 16, borderWidth: 2, borderColor: 'transparent', color: Colors.foreground,
    // @ts-ignore
    outlineStyle: 'none',
  },
  passwordContainer: { position: 'relative', justifyContent: 'center' },
  passwordInput: { paddingRight: 50 },
  eyeIcon: { position: 'absolute', right: 16, height: '100%', justifyContent: 'center', alignItems: 'center' },
  textInputActive: { borderColor: 'rgba(192, 219, 234, 0.5)' },
  textInputError: { borderColor: '#ef4444' },
  errorText: { color: '#ef4444', fontSize: 12, fontWeight: '500', marginTop: 4, marginLeft: 4 },
  backToEmail: { marginTop: 12, alignItems: 'center' },
  backToEmailText: { fontSize: 14, color: Colors.mutedForeground, textDecorationLine: 'underline' },
  primaryButton: {
    backgroundColor: Colors.accent, borderRadius: 20, paddingVertical: 18,
    alignItems: 'center', marginTop: 12,
    shadowColor: Colors.accent, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 6,
  },
  primaryButtonText: { color: 'white', fontSize: 17, fontWeight: '700' },
  footer: { marginTop: 24, alignItems: 'center' },
  footerBaseText: { fontSize: 15, color: Colors.mutedForeground },
  footerLinkText: { color: Colors.accent, fontWeight: '700' },
  resendBtn: {
    paddingVertical: 14, alignItems: 'center', marginTop: 8, borderRadius: 16,
    borderWidth: 1, borderColor: Colors.primary, backgroundColor: 'rgba(232, 160, 191, 0.1)',
  },
  resendBtnDisabled: { borderColor: '#e2e8f0', backgroundColor: '#f8fafc' },
  resendBtnText: { color: Colors.primary, fontSize: 15, fontWeight: '700' },
  resendBtnTextDisabled: { color: '#94a3b8', fontWeight: '600' },
});
