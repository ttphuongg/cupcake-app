import { useState } from 'react';
import { Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../store/authStore';

export function useRegisterForm() {
  const router = useRouter();
  const { register, login, isLoading } = useAuthStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [errorMessages, setErrorMessages] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string | null>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async () => {
    const newErrors: Record<string, boolean> = {};
    const newMsgs: Record<string, string> = {};

    if (!name.trim()) { newErrors.name = true; newMsgs.name = 'Vui lòng nhập họ tên'; }
    if (!email) { newErrors.email = true; }
    if (!password) { newErrors.password = true; }
    if (!confirmPassword) { newErrors.confirmPassword = true; }
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
      await register({ name, email, phone, password });
      
      // Auto login after successful registration
      await login({ identifier: email, password });
      
      Alert.alert('Thành công', 'Đăng ký tài khoản thành công! 🎉', [
        { text: 'Bắt đầu', onPress: () => router.replace('/(tabs)') },
      ]);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        (err instanceof Error ? err.message : 'Đăng ký không thành công');
      setApiError(msg);
      if (Platform.OS !== 'web') Alert.alert('Lỗi', msg);
    }
  };

  return {
    name, setName,
    email, setEmail,
    phone, setPhone,
    password, setPassword,
    confirmPassword, setConfirmPassword,
    focusedInput, setFocusedInput,
    errors, setErrors,
    errorMessages, setErrorMessages,
    apiError,
    showPassword, setShowPassword,
    showConfirmPassword, setShowConfirmPassword,
    isLoading,
    handleSubmit,
  };
}
