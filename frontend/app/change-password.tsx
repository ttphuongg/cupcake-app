/**
 * app/change-password.tsx — Màn hình Đổi mật khẩu
 * Logic: useAuthStore.changePassword() + verifyChangePasswordOtp()
 * UI: dùng PasswordField + OtpModal từ components/
 */
import React, { useState } from 'react';
import {
  View,
  Text,
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
import { useAuthStore } from '../store/authStore';
import { PasswordField } from '../components/PasswordField';
import { OtpModal } from '../components/OtpModal';

export default function ChangePasswordScreen() {
  const router = useRouter();
  const { changePassword, verifyChangePasswordOtp, isLoading } = useAuthStore();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [errorMessages, setErrorMessages] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string | null>(null);

  // OTP state
  const [otpModalVisible, setOtpModalVisible] = useState(false);
  const [targetIdentifier, setTargetIdentifier] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [storedNewPassword, setStoredNewPassword] = useState('');

  // Đếm ngược
  React.useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (otpModalVisible && countdown > 0) {
      timer = setInterval(() => setCountdown((p) => p - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [otpModalVisible, countdown]);

  const handleChangePassword = async () => {
    const newErrors: Record<string, boolean> = {};
    const newMsgs: Record<string, string> = {};
    setApiError(null);

    if (!currentPassword) { newErrors.current = true; newMsgs.current = 'Vui lòng nhập mật khẩu hiện tại'; }
    if (!newPassword) { newErrors.new = true; newMsgs.new = 'Vui lòng nhập mật khẩu mới'; }
    else if (newPassword.length < 6) { newErrors.new = true; newMsgs.new = 'Mật khẩu ít nhất 6 ký tự'; }
    if (!confirmPassword) { newErrors.confirm = true; newMsgs.confirm = 'Vui lòng xác nhận mật khẩu mới'; }
    else if (newPassword !== confirmPassword) { newErrors.confirm = true; newMsgs.confirm = 'Mật khẩu xác nhận không khớp'; }
    if (newPassword && currentPassword === newPassword) { newErrors.new = true; newMsgs.new = 'Mật khẩu mới không được trùng mật khẩu cũ'; }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setErrorMessages(newMsgs);
      return;
    }
    setErrors({});
    setErrorMessages({});

    try {
      const { targetIdentifier: ti } = await changePassword({ currentPassword, newPassword });
      setTargetIdentifier(ti);
      setStoredNewPassword(newPassword);
      setOtpModalVisible(true);
      if (countdown === 0) setCountdown(60);
      Alert.alert('Xác thực', 'Mã OTP đã được gửi.');
    } catch (error: unknown) {
      const msg: string =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        (error instanceof Error ? error.message : 'Không thể thực hiện yêu cầu');

      if (msg === 'Mật khẩu hiện tại không chính xác') {
        setErrors({ current: true });
        setErrorMessages({ current: msg });
      } else {
        setApiError(msg);
      }
    }
  };

  const handleResendOtp = async () => {
    if (countdown > 0) return;
    setCountdown(60);
    await handleChangePassword();
  };

  const handleVerifyOtp = async (otp: string) => {
    try {
      await verifyChangePasswordOtp({ otp, newPassword: storedNewPassword, targetIdentifier });
      setOtpModalVisible(false);
      if (Platform.OS === 'web') {
        window.alert('Thành công: Mật khẩu của bạn đã được cập nhật!');
        router.back();
      } else {
        Alert.alert('Thành công', 'Mật khẩu của bạn đã được cập nhật!', [
          { text: 'OK', onPress: () => router.back() },
        ]);
      }
    } catch (error: unknown) {
      const msg =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Mã OTP không chính xác';
      if (Platform.OS === 'web') {
        window.alert('Lỗi: ' + msg);
      } else {
        Alert.alert('Lỗi', msg);
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
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <Feather name="arrow-left" size={24} color={Colors.mutedForeground} />
            </TouchableOpacity>

            <View style={styles.header}>
              <Animated.View entering={ZoomIn.delay(200).springify()} style={styles.logoContainer}>
                <Feather name="lock" size={40} color="white" />
              </Animated.View>
              <Text style={styles.titleText}>Đổi mật khẩu</Text>
              <Text style={styles.subtitleText}>Cập nhật mật khẩu bảo mật của bạn</Text>
            </View>

            <Animated.View entering={FadeInDown.delay(300).duration(600)} style={styles.card}>
              <View style={styles.inputStack}>
                <PasswordField
                  label="Mật khẩu hiện tại"
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  fieldKey="current"
                  show={showCurrent}
                  onToggleShow={() => setShowCurrent((p) => !p)}
                  placeholder="Nhập mật khẩu hiện tại"
                  error={errors.current ?? false}
                  errorMsg={errorMessages.current ?? ''}
                  focusedInput={focusedInput}
                  onFocus={setFocusedInput}
                  onBlur={() => setFocusedInput(null)}
                  setErrors={setErrors}
                  setErrorMessages={setErrorMessages}
                />
                <View style={styles.divider} />
                <PasswordField
                  label="Mật khẩu mới"
                  value={newPassword}
                  onChangeText={setNewPassword}
                  fieldKey="new"
                  show={showNew}
                  onToggleShow={() => setShowNew((p) => !p)}
                  placeholder="Ít nhất 6 ký tự"
                  error={errors.new ?? false}
                  errorMsg={errorMessages.new ?? ''}
                  focusedInput={focusedInput}
                  onFocus={setFocusedInput}
                  onBlur={() => setFocusedInput(null)}
                  setErrors={setErrors}
                  setErrorMessages={setErrorMessages}
                />
                <PasswordField
                  label="Xác nhận mật khẩu mới"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  fieldKey="confirm"
                  show={showConfirm}
                  onToggleShow={() => setShowConfirm((p) => !p)}
                  placeholder="Nhập lại mật khẩu mới"
                  error={errors.confirm ?? false}
                  errorMsg={errorMessages.confirm ?? ''}
                  focusedInput={focusedInput}
                  onFocus={setFocusedInput}
                  onBlur={() => setFocusedInput(null)}
                  setErrors={setErrors}
                  setErrorMessages={setErrorMessages}
                />

                {apiError && (
                  <Animated.View entering={FadeInDown} style={styles.apiErrorBox}>
                    <Text style={styles.apiErrorText}>{apiError}</Text>
                  </Animated.View>
                )}

                <TouchableOpacity onPress={handleChangePassword} activeOpacity={0.8} disabled={isLoading}>
                  <Animated.View style={[styles.primaryButton, isLoading && styles.primaryButtonLoading]} entering={FadeInUp.delay(400)}>
                    <Text style={styles.primaryButtonText}>
                      {isLoading ? 'Đang xử lý...' : 'Cập nhật mật khẩu'}
                    </Text>
                  </Animated.View>
                </TouchableOpacity>
              </View>
            </Animated.View>

            <Animated.View entering={FadeInUp.delay(500).duration(500)} style={styles.footer}>
              <Feather name="shield" size={14} color={Colors.mutedForeground} style={{ marginRight: 6 }} />
              <Text style={styles.footerText}>Mật khẩu được mã hóa an toàn</Text>
            </Animated.View>
          </Animated.View>
        </LinearGradient>
      </ScrollView>

      <OtpModal
        visible={otpModalVisible}
        targetIdentifier={targetIdentifier}
        isLoading={isLoading}
        countdown={countdown}
        onVerify={handleVerifyOtp}
        onResend={handleResendOtp}
        onClose={() => setOtpModalVisible(false)}
        title="Xác nhận đổi mật khẩu"
        verifyBtnLabel="Xác nhận thay đổi"
        variant="center"
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { flexGrow: 1 },
  gradientContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 60 },
  contentWrapper: { width: '100%', maxWidth: 400, position: 'relative' },
  backButton: { position: 'absolute', top: -20, left: 0, width: 40, height: 40, justifyContent: 'center', alignItems: 'center', zIndex: 10 },
  header: { alignItems: 'center', marginBottom: 32 },
  logoContainer: { width: 80, height: 80, backgroundColor: Colors.primary, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginBottom: 16, elevation: 10 },
  titleText: { fontSize: 28, fontWeight: '800', color: Colors.foreground, marginBottom: 8 },
  subtitleText: { fontSize: 15, color: Colors.mutedForeground, textAlign: 'center' },
  card: { backgroundColor: Colors.card, borderRadius: 32, padding: 28, elevation: 5, borderWidth: 1, borderColor: Colors.border },
  inputStack: { gap: 16 },
  divider: { height: 1, backgroundColor: Colors.border, marginVertical: 4 },
  apiErrorBox: { padding: 12, backgroundColor: '#fee2e2', borderRadius: 8, marginTop: 4 },
  apiErrorText: { color: '#ef4444', fontSize: 13, textAlign: 'center', fontWeight: '500' },
  primaryButton: { backgroundColor: Colors.primary, borderRadius: 20, paddingVertical: 18, alignItems: 'center', marginTop: 8, elevation: 6 },
  primaryButtonLoading: { opacity: 0.7 },
  primaryButtonText: { color: 'white', fontSize: 17, fontWeight: '700' },
  footer: { marginTop: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  footerText: { fontSize: 13, color: Colors.mutedForeground },
});
