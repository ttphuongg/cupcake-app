/**
 * app/(auth)/register.tsx — Màn hình Đăng ký
 * Logic: useAuthStore.register() + verifyRegisterOtp()
 * Đã xóa: fetch, API_ENDPOINTS, biến simulatedSms không được định nghĩa, Colors.light.x
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
import { useRouter, Link } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp, ZoomIn } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useAuthStore } from '../../store/authStore';

export default function RegisterScreen() {
  const router = useRouter();
  const { register, verifyRegisterOtp, isLoading } = useAuthStore();

  const [name, setName]                       = useState('');
  const [email, setEmail]                     = useState('');
  const [phone, setPhone]                     = useState('');
  const [password, setPassword]               = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otpCode, setOtpCode]                 = useState('');
  const [otpMethod, setOtpMethod]             = useState<'email' | 'phone'>('email');
  const [targetIdentifier, setTargetIdentifier] = useState('');
  const [isOtpStep, setIsOtpStep]             = useState(false);
  const [focusedInput, setFocusedInput]       = useState<string | null>(null);
  const [errors, setErrors]                   = useState<Record<string, boolean>>({});
  const [errorMessages, setErrorMessages]     = useState<Record<string, string>>({});
  const [apiError, setApiError]               = useState<string | null>(null);
  const [showPassword, setShowPassword]       = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [countdown, setCountdown]             = useState(0);

  // Đếm ngược
  React.useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (isOtpStep && countdown > 0) {
      timer = setInterval(() => setCountdown((p) => p - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isOtpStep, countdown]);

  const handleResendOtp = async () => {
    if (countdown > 0) return;
    setCountdown(60);
    await handleSubmit();
  };

  const handleSubmit = async () => {
    const newErrors: Record<string, boolean> = {};
    const newMsgs: Record<string, string> = {};

    if (!name.trim()) { newErrors.name = true; newMsgs.name = 'Vui lòng nhập họ tên'; }
    if (!email) { newErrors.email = true; }
    if (!password) { newErrors.password = true; }
    if (!confirmPassword) { newErrors.confirmPassword = true; }
    if (otpMethod === 'phone' && !phone) { newErrors.phone = true; }
    if (password && confirmPassword && password !== confirmPassword) {
      newErrors.confirmPassword = true;
      newMsgs.confirmPassword = 'Mật khẩu không khớp';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setErrorMessages(newMsgs);
      return;
    }
    setApiError(null);
    setErrors({});
    setErrorMessages({});

    try {
      const result = await register({ name, email, phone, password, otpMethod });
      setTargetIdentifier(result.targetIdentifier);
      setIsOtpStep(true);
      if (countdown === 0) setCountdown(60);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        (err instanceof Error ? err.message : 'Đăng ký không thành công');
      setApiError(msg);
      if (Platform.OS !== 'web') Alert.alert('Lỗi', msg);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otpCode) {
      setErrors({ otp: true });
      return;
    }

    try {
      await verifyRegisterOtp({ email, phone, otp: otpCode, targetIdentifier });
      Alert.alert('Thành công', 'Tài khoản đã được tạo và xác thực!', [
        { text: 'Đăng nhập', onPress: () => router.replace('/login') },
      ]);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Mã OTP không đúng hoặc đã hết hạn';
      Alert.alert('Lỗi', msg);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.mainContainer}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={['rgba(232, 160, 191, 0.2)', 'rgba(247, 233, 237, 0.3)', 'rgba(186, 144, 198, 0.15)']}
          style={styles.gradientContainer}
        >
          <Animated.View entering={ZoomIn.duration(500).springify()} style={styles.contentWrapper}>
            {/* Header */}
            <View style={styles.header}>
              <Animated.View entering={ZoomIn.delay(200).springify()} style={styles.logoContainer}>
                <Feather name="user-plus" size={40} color="white" />
              </Animated.View>
              <Text style={styles.titleText}>Đăng ký</Text>
              <Text style={styles.subtitleText}>Tạo tài khoản mới</Text>
            </View>

            {/* Form */}
            <Animated.View entering={FadeInDown.delay(300).duration(600)} style={styles.card}>
              <View style={styles.inputStack}>
                {!isOtpStep ? (
                  <>
                    {/* Họ tên */}
                    <View style={styles.field}>
                      <Text style={styles.fieldLabel}>Họ tên</Text>
                      <TextInput
                        style={[styles.textInput, focusedInput === 'name' && styles.textInputActive, errors.name && styles.textInputError]}
                        value={name}
                        onChangeText={(t) => { setName(t); if (errors.name) setErrors((p) => ({ ...p, name: false })); }}
                        placeholder="Nguyễn Văn A"
                        placeholderTextColor="#9ca3af"
                        autoCapitalize="words"
                        textContentType="none"
                        autoComplete="off"
                        importantForAutofill="no"
                        autoCorrect={false}
                        spellCheck={false}
                        onFocus={() => setFocusedInput('name')}
                        onBlur={() => setFocusedInput(null)}
                      />
                      {errorMessages.name ? <Text style={styles.errorText}>{errorMessages.name}</Text> : null}
                    </View>

                    {/* SĐT */}
                    <View style={styles.field}>
                      <Text style={styles.fieldLabel}>Số điện thoại</Text>
                      <TextInput
                        style={[styles.textInput, focusedInput === 'phone' && styles.textInputActive, errors.phone && styles.textInputError]}
                        value={phone}
                        onChangeText={(t) => { setPhone(t); if (errors.phone) setErrors((p) => ({ ...p, phone: false })); }}
                        placeholder="0123456789"
                        placeholderTextColor="#9ca3af"
                        keyboardType="phone-pad"
                        textContentType="telephoneNumber"
                        autoComplete="tel"
                        importantForAutofill="no"
                        autoCorrect={false}
                        spellCheck={false}
                        maxLength={11}
                        onFocus={() => setFocusedInput('phone')}
                        onBlur={() => setFocusedInput(null)}
                      />
                      {errorMessages.phone ? <Text style={styles.errorText}>{errorMessages.phone}</Text> : null}
                    </View>

                    {/* Email */}
                    <View style={styles.field}>
                      <Text style={styles.fieldLabel}>Email</Text>
                      <TextInput
                        style={[styles.textInput, focusedInput === 'email' && styles.textInputActive, errors.email && styles.textInputError]}
                        value={email}
                        onChangeText={(t) => { setEmail(t); if (errors.email) setErrors((p) => ({ ...p, email: false })); }}
                        placeholder="your@email.com"
                        placeholderTextColor="#9ca3af"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        textContentType="none"
                        autoComplete="off"
                        importantForAutofill="no"
                        autoCorrect={false}
                        spellCheck={false}
                        onFocus={() => setFocusedInput('email')}
                        onBlur={() => setFocusedInput(null)}
                      />
                    </View>

                    {/* Mật khẩu */}
                    <View style={styles.field}>
                      <Text style={styles.fieldLabel}>Mật khẩu</Text>
                      <View style={styles.passwordContainer}>
                        <TextInput
                          style={[styles.textInput, styles.passwordInput, focusedInput === 'password' && styles.textInputActive, errors.password && styles.textInputError]}
                          value={password}
                          onChangeText={(t) => { setPassword(t); if (errors.password) setErrors((p) => ({ ...p, password: false })); }}
                          placeholder="••••••••"
                          placeholderTextColor="#9ca3af"
                          secureTextEntry={!showPassword}
                          textContentType="none"
                          autoComplete="new-password"
                          importantForAutofill="no"
                          autoCorrect={false}
                          spellCheck={false}
                          onFocus={() => setFocusedInput('password')}
                          onBlur={() => setFocusedInput(null)}
                        />
                        <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword((p) => !p)}>
                          <Feather name={showPassword ? 'eye' : 'eye-off'} size={20} color={errors.password ? '#ff0000' : '#9ca3af'} />
                        </TouchableOpacity>
                      </View>
                    </View>

                    {/* Xác nhận mật khẩu */}
                    <View style={styles.field}>
                      <Text style={styles.fieldLabel}>Xác nhận mật khẩu</Text>
                      <View style={styles.passwordContainer}>
                        <TextInput
                          style={[styles.textInput, styles.passwordInput, focusedInput === 'confirmPassword' && styles.textInputActive, errors.confirmPassword && styles.textInputError]}
                          value={confirmPassword}
                          onChangeText={(t) => { setConfirmPassword(t); if (errors.confirmPassword) setErrors((p) => ({ ...p, confirmPassword: false })); }}
                          placeholder="••••••••"
                          placeholderTextColor="#9ca3af"
                          secureTextEntry={!showConfirmPassword}
                          textContentType="none"
                          autoComplete="new-password"
                          importantForAutofill="no"
                          autoCorrect={false}
                          spellCheck={false}
                          onFocus={() => setFocusedInput('confirmPassword')}
                          onBlur={() => setFocusedInput(null)}
                        />
                        <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowConfirmPassword((p) => !p)}>
                          <Feather name={showConfirmPassword ? 'eye' : 'eye-off'} size={20} color={errors.confirmPassword ? '#ff0000' : '#9ca3af'} />
                        </TouchableOpacity>
                      </View>
                      {errorMessages.confirmPassword ? <Text style={styles.errorText}>{errorMessages.confirmPassword}</Text> : null}
                    </View>

                    {/* OTP Method */}
                    <View style={styles.field}>
                      <Text style={styles.fieldLabel}>Nhận mã OTP qua</Text>
                      <View style={styles.methodRow}>
                        <TouchableOpacity style={[styles.methodBtn, otpMethod === 'email' && styles.methodBtnActive]} onPress={() => setOtpMethod('email')}>
                          <Feather name="mail" size={16} color={otpMethod === 'email' ? 'white' : Colors.mutedForeground} />
                          <Text style={[styles.methodText, otpMethod === 'email' && styles.methodTextActive]}>Email</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.methodBtn, otpMethod === 'phone' && styles.methodBtnActive]} onPress={() => setOtpMethod('phone')}>
                          <Feather name="phone" size={16} color={otpMethod === 'phone' ? 'white' : Colors.mutedForeground} />
                          <Text style={[styles.methodText, otpMethod === 'phone' && styles.methodTextActive]}>SĐT</Text>
                        </TouchableOpacity>
                      </View>
                    </View>

                    {apiError && (
                      <Animated.View entering={FadeInDown} style={styles.apiErrorBox}>
                        <Text style={styles.apiErrorText}>{apiError}</Text>
                      </Animated.View>
                    )}

                    <TouchableOpacity onPress={handleSubmit} activeOpacity={0.8} disabled={isLoading}>
                      <Animated.View style={styles.secondaryButton} entering={FadeInUp.delay(400)}>
                        <Text style={styles.secondaryButtonText}>
                          {isLoading ? 'Đang gửi...' : 'Tiếp tục'}
                        </Text>
                      </Animated.View>
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    {/* OTP step */}
                    <View style={styles.field}>
                      <Text style={styles.fieldLabel}>Mã xác thực OTP</Text>
                      <TextInput
                        style={[styles.textInput, focusedInput === 'otp' && styles.textInputActive, errors.otp && styles.textInputError]}
                        value={otpCode}
                        onChangeText={(t) => { setOtpCode(t); if (errors.otp) setErrors((p) => ({ ...p, otp: false })); }}
                        placeholder="123456"
                        placeholderTextColor="#9ca3af"
                        keyboardType="number-pad"
                        maxLength={6}
                        onFocus={() => setFocusedInput('otp')}
                        onBlur={() => setFocusedInput(null)}
                      />
                      <Text style={styles.otpNotice}>
                        Vui lòng kiểm tra {otpMethod === 'email' ? 'email' : 'tin nhắn SĐT'}: {targetIdentifier}
                      </Text>
                    </View>

                    <TouchableOpacity onPress={handleVerifyOtp} activeOpacity={0.8} disabled={isLoading}>
                      <Animated.View style={styles.secondaryButton} entering={FadeInUp.delay(200)}>
                        <Text style={styles.secondaryButtonText}>
                          {isLoading ? 'Đang xác thực...' : 'Xác nhận Đăng ký'}
                        </Text>
                      </Animated.View>
                    </TouchableOpacity>

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

                    <TouchableOpacity onPress={() => setIsOtpStep(false)} style={styles.backButton}>
                      <Text style={styles.backButtonText}>Quay lại sửa thông tin</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </Animated.View>

            {/* Footer */}
            <Animated.View entering={FadeInUp.delay(500).duration(500)} style={styles.footer}>
              <Text style={styles.footerBaseText}>
                Đã có tài khoản?{' '}
                <Link href="/login" asChild>
                  <TouchableOpacity>
                    <Text style={styles.footerLinkText}>Đăng nhập</Text>
                  </TouchableOpacity>
                </Link>
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
  gradientContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 60 },
  contentWrapper: { width: '100%', maxWidth: 400 },
  header: { alignItems: 'center', marginBottom: 32 },
  logoContainer: {
    width: 80, height: 80, backgroundColor: Colors.primary, borderRadius: 24,
    justifyContent: 'center', alignItems: 'center', marginBottom: 16,
    shadowColor: Colors.primary, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 15, elevation: 10,
  },
  titleText: { fontSize: 32, fontWeight: '800', color: Colors.foreground, marginBottom: 8 },
  subtitleText: { fontSize: 16, color: Colors.mutedForeground },
  card: { backgroundColor: Colors.card, borderRadius: 32, padding: 32, elevation: 5, borderWidth: 1, borderColor: Colors.border },
  inputStack: { gap: 16 },
  field: { gap: 6 },
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
  textInputActive: { borderColor: 'rgba(232, 160, 191, 0.5)' },
  textInputError: { borderColor: '#ff0000', borderWidth: 2.5 },
  errorText: { color: '#ff0000', fontSize: 12, fontWeight: '500', marginTop: 4, marginLeft: 4 },
  otpNotice: { fontSize: 12, color: Colors.mutedForeground, textAlign: 'center', marginTop: 4 },
  backButton: { marginTop: 12, alignItems: 'center' },
  backButtonText: { fontSize: 14, color: Colors.mutedForeground, textDecorationLine: 'underline' },
  apiErrorBox: { padding: 12, backgroundColor: '#fee2e2', borderRadius: 8, marginTop: 4 },
  apiErrorText: { color: '#ef4444', fontSize: 13, textAlign: 'center', fontWeight: '500' },
  secondaryButton: {
    backgroundColor: Colors.primary, borderRadius: 20, paddingVertical: 18, alignItems: 'center', marginTop: 12,
    shadowColor: Colors.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 6,
  },
  secondaryButtonText: { color: 'white', fontSize: 17, fontWeight: '700' },
  footer: { marginTop: 24, alignItems: 'center', paddingBottom: 20 },
  footerBaseText: { fontSize: 15, color: Colors.mutedForeground },
  footerLinkText: { color: Colors.primary, fontWeight: '700' },
  methodRow: { flexDirection: 'row', gap: 12, marginTop: 4 },
  methodBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    paddingVertical: 12, borderRadius: 12, backgroundColor: Colors.inputBackground, borderWidth: 1, borderColor: Colors.border,
  },
  methodBtnActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  methodText: { fontSize: 14, fontWeight: '600', color: Colors.mutedForeground },
  methodTextActive: { color: 'white' },
  resendBtn: {
    paddingVertical: 14, alignItems: 'center', marginTop: 8, borderRadius: 16,
    borderWidth: 1, borderColor: Colors.primary, backgroundColor: 'rgba(232, 160, 191, 0.1)',
  },
  resendBtnDisabled: { borderColor: '#e2e8f0', backgroundColor: '#f8fafc' },
  resendBtnText: { color: Colors.primary, fontSize: 15, fontWeight: '700' },
  resendBtnTextDisabled: { color: '#94a3b8', fontWeight: '600' },
});
