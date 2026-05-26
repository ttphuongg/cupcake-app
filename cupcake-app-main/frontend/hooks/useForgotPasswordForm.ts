import { useState } from 'react';
import { Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../store/authStore';
import { isValidEmail, isValidPhone } from '../utils/validators';

export function useForgotPasswordForm(startCountdown: (s: number) => void) {
  const router = useRouter();
  const { forgotPassword, resetPassword, isLoading } = useAuthStore();

  const [identifier, setIdentifier] = useState('');
  const [targetIdentifier, setTargetIdentifier] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  const [isOtpStep, setIsOtpStep] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [errorMessages, setErrorMessages] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);

  const handleRequestOTP = async () => {
    if (!identifier) {
      setErrors({ identifier: true });
      setErrorMessages({ identifier: 'Vui lòng nhập email hoặc sdt' });
      return;
    }
    if (!isValidEmail(identifier) && !isValidPhone(identifier)) {
      setErrors({ identifier: true });
      setErrorMessages({ identifier: 'Thông tin không hợp lệ' });
      return;
    }
    setErrors({});
    setErrorMessages({});

    try {
      await forgotPassword(identifier);
      setIsOtpStep(true);
      startCountdown(60);
      if (Platform.OS !== 'web') {
        Alert.alert('Xác thực', 'Mã OTP đã được gửi đến tài khoản của bạn.');
      }
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        (err instanceof Error ? err.message : 'Không tìm thấy tài khoản');
      if (msg === 'Tài khoản không tồn tại') {
        setErrors({ identifier: true });
        setErrorMessages({ identifier: msg });
      } else {
        if (Platform.OS !== 'web') Alert.alert('Lỗi', msg);
      }
    }
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
      if (Platform.OS !== 'web') {
        Alert.alert('Thành công', 'Mật khẩu của bạn đã được cập nhật!', [
          { text: 'Đăng nhập ngay', onPress: () => router.replace('/login') },
        ]);
      } else {
        router.replace('/login');
      }
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Mã OTP không đúng hoặc đã hết hạn';
      if (msg.includes('OTP')) {
        setErrors({ otp: true });
        setErrorMessages({ otp: msg });
      } else {
        if (Platform.OS !== 'web') Alert.alert('Lỗi', msg);
      }
    }
  };

  return {
    identifier, setIdentifier,
    targetIdentifier, setTargetIdentifier,
    otpCode, setOtpCode,
    newPassword, setNewPassword,
    isOtpStep, setIsOtpStep,
    focusedInput, setFocusedInput,
    errors, setErrors,
    errorMessages, setErrorMessages,
    showPassword, setShowPassword,
    isLoading,
    handleRequestOTP,
    handleVerifyAndReset,
  };
}
