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
    if (!email) { 
      newErrors.email = true; 
      newMsgs.email = 'Vui lòng nhập email';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        newErrors.email = true;
        newMsgs.email = 'Email không hợp lệ';
      }
    }

    if (phone) {
      const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})\b$/;
      if (!phoneRegex.test(phone)) {
        newErrors.phone = true;
        newMsgs.phone = 'Số điện thoại không hợp lệ (ví dụ: 0912345678)';
      }
    }

    if (!password) { 
      newErrors.password = true; 
      newMsgs.password = 'Vui lòng nhập mật khẩu';
    } else if (password.length < 6) {
      newErrors.password = true;
      newMsgs.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }
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
