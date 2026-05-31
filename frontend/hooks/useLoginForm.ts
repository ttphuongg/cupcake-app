import { useState } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../store/authStore';
import { isValidEmail, isValidPhone } from '../utils/validators';

export function useLoginForm() {
  const router = useRouter();
  const { login, isLoading } = useAuthStore();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [errorMessages, setErrorMessages] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async () => {
    const newErrors: Record<string, boolean> = {};
    const newMsgs: Record<string, string> = {};
    if (!identifier) {
      newErrors.identifier = true;
      newMsgs.identifier = 'Vui lòng nhập email hoặc sdt';
    } else if (!isValidEmail(identifier) && !isValidPhone(identifier)) {
      newErrors.identifier = true;
      newMsgs.identifier = 'Vui lòng nhập email hoặc sdt';
    }
    if (!password) {
      newErrors.password = true;
      newMsgs.password = 'Vui lòng nhập mật khẩu';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setErrorMessages(newMsgs);
      return;
    }

    setErrors({});
    setErrorMessages({});

    // ── Gọi store ────────────────────────────────────────────────────────────
    try {
      await login({ identifier, password });
      router.replace('/');
    } catch (error: unknown) {
      const msg: string =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        (error instanceof Error ? error.message : 'Lỗi đăng nhập');

      if (msg === 'Tài khoản không tồn tại') {
        setErrors({ identifier: true });
        setErrorMessages({ identifier: msg });
      } else if (msg.includes('Mật khẩu')) {
        setErrors({ password: true });
        setErrorMessages({ password: 'Mật khẩu không chính xác' });
      } else if (msg.includes('xác thực')) {
        setErrors({ identifier: true });
        setErrorMessages({ identifier: 'Tài khoản chưa xác thực' });
      } else {
        Alert.alert('Thông báo', msg);
      }
    }
  };

  return {
    identifier, setIdentifier,
    password, setPassword,
    focusedInput, setFocusedInput,
    errors, setErrors,
    errorMessages, setErrorMessages,
    showPassword, setShowPassword,
    isLoading,
    handleSubmit,
  };
}
