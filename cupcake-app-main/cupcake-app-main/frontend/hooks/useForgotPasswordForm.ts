import { useState } from 'react';
import { Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../store/authStore';
import { isValidEmail } from '../utils/validators';

export function useForgotPasswordForm(startCountdown?: (s: number) => void) {
  const router = useRouter();
  const { forgotPassword, isLoading } = useAuthStore();

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
      setErrorMessages({ identifier: 'Vui lòng nhập địa chỉ email' });
      return;
    }
    if (!isValidEmail(identifier)) {
      setErrors({ identifier: true });
      setErrorMessages({ identifier: 'Địa chỉ email không hợp lệ' });
      return;
    }
    setErrors({});
    setErrorMessages({});

    try {
      await forgotPassword(identifier);
      if (Platform.OS !== 'web') {
        Alert.alert(
          'Thành công',
          'Liên kết đặt lại mật khẩu đã được gửi vào email của bạn. Vui lòng kiểm tra hộp thư!',
          [{ text: 'Đăng nhập', onPress: () => router.replace('/login') }]
        );
      } else {
        alert('Liên kết đặt lại mật khẩu đã được gửi vào email của bạn. Vui lòng kiểm tra hộp thư!');
        router.replace('/login');
      }
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        (err instanceof Error ? err.message : 'Không tìm thấy tài khoản');
      setErrors({ identifier: true });
      setErrorMessages({ identifier: msg });
      if (Platform.OS !== 'web') {
        Alert.alert('Thông báo', msg);
      }
    }
  };

  const handleVerifyAndReset = async () => {
    // Không sử dụng trong luồng Reset Link trực tiếp này
  };

  return {
    identifier, setIdentifier,
    targetIdentifier, setTargetIdentifier,
    otpCode, setOtpCode,
    newPassword, setNewPassword,
    isOtpStep: false, setIsOtpStep,
    focusedInput, setFocusedInput,
    errors, setErrors,
    errorMessages, setErrorMessages,
    showPassword, setShowPassword,
    isLoading,
    handleRequestOTP,
    handleVerifyAndReset,
  };
}
