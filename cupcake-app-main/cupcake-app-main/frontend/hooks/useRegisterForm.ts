import { useState } from 'react';
import { Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../store/authStore';

export function useRegisterForm(startCountdown: (s: number) => void) {
  const router = useRouter();
  const { register, verifyRegisterOtp, isLoading } = useAuthStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [otpCode, setOtpCode] = useState('');
  const [otpMethod, setOtpMethod] = useState<'email' | 'phone'>('email');
  
  const [isOtpStep, setIsOtpStep] = useState(false);
  const [targetIdentifier, setTargetIdentifier] = useState('');
  
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
      await register({ name, email, phone, password });
      Alert.alert('Thành công', 'Đăng ký tài khoản thành công! Bạn có thể đăng nhập ngay bây giờ.', [
        { text: 'Đăng nhập', onPress: () => router.replace('/login') },
      ]);
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

  return {
    name, setName,
    email, setEmail,
    phone, setPhone,
    password, setPassword,
    confirmPassword, setConfirmPassword,
    otpCode, setOtpCode,
    otpMethod, setOtpMethod,
    isOtpStep, setIsOtpStep,
    targetIdentifier,
    focusedInput, setFocusedInput,
    errors, setErrors,
    errorMessages, setErrorMessages,
    apiError,
    showPassword, setShowPassword,
    showConfirmPassword, setShowConfirmPassword,
    isLoading,
    handleSubmit,
    handleVerifyOtp,
  };
}
