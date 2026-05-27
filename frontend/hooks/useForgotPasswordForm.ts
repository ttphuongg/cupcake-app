import { useState } from 'react';
import { Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../store/authStore';
import { isValidEmail, isValidPhone } from '../utils/validators';

export function useForgotPasswordForm() {
  const router = useRouter();
  const { forgotPassword, isLoading } = useAuthStore();

  const [identifier, setIdentifier] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [errorMessages, setErrorMessages] = useState<Record<string, string>>({});

  const handleRequestOTP = async () => {
    if (!identifier) {
      setErrors({ identifier: true });
      setErrorMessages({ identifier: 'Vui lòng nhập email của bạn' });
      return;
    }
    if (!isValidEmail(identifier)) {
      setErrors({ identifier: true });
      setErrorMessages({ identifier: 'Email không hợp lệ' });
      return;
    }
    setErrors({});
    setErrorMessages({});

    try {
      await forgotPassword(identifier);
      setIsSubmitted(true);
      if (Platform.OS !== 'web') {
        Alert.alert('Thành công', 'Liên kết đặt lại mật khẩu đã được gửi đến email của bạn.');
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

  return {
    identifier, setIdentifier,
    isSubmitted, setIsSubmitted,
    focusedInput, setFocusedInput,
    errors, setErrors,
    errorMessages, setErrorMessages,
    isLoading,
    handleRequestOTP,
  };
}
