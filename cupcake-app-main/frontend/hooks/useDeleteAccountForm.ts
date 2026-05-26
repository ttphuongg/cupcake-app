import { useState, useEffect } from 'react';
import { Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../store/authStore';

export function useDeleteAccountForm() {
  const router = useRouter();
  const { requestDeleteAccountOtp, verifyDeleteAccountOtp, isLoading } = useAuthStore();

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [otpModalVisible, setOtpModalVisible] = useState(false);
  const [targetIdentifier, setTargetIdentifier] = useState('');
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (otpModalVisible && countdown > 0) {
      timer = setInterval(() => setCountdown((p) => p - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [otpModalVisible, countdown]);

  const handleDeleteRequest = async () => {
    if (!password) {
      setError(true);
      setErrorMessage('Vui lòng nhập mật khẩu xác nhận');
      return;
    }
    setError(false);
    setErrorMessage('');

    try {
      const { targetIdentifier: ti } = await requestDeleteAccountOtp(password);
      setTargetIdentifier(ti);
      setOtpModalVisible(true);
      if (countdown === 0) setCountdown(60);
      if (Platform.OS !== 'web') Alert.alert('Xác thực', 'Mã OTP đã được gửi.');
    } catch (err: unknown) {
      const msg: string =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        (err instanceof Error ? err.message : 'Xác nhận mật khẩu thất bại');

      if (msg === 'Mật khẩu hiện tại không chính xác') {
        setError(true);
        setErrorMessage(msg);
      } else {
        if (Platform.OS === 'web') window.alert('Lỗi: ' + msg);
        else Alert.alert('Lỗi', msg);
      }
    }
  };

  const handleResendOtp = async () => {
    if (countdown > 0) return;
    setCountdown(60);
    await handleDeleteRequest();
  };

  const handleVerifyAndDelete = async (otp: string) => {
    try {
      await verifyDeleteAccountOtp({ otp, targetIdentifier });
      setOtpModalVisible(false);
      if (Platform.OS === 'web') {
        window.alert('Tài khoản của bạn đã được xóa vĩnh viễn. Tạm biệt!');
        router.replace('/register');
      } else {
        Alert.alert(
          'Thành công',
          'Tài khoản của bạn đã được xóa vĩnh viễn. Tạm biệt!',
          [{ text: 'Đăng ký tài khoản mới', onPress: () => router.replace('/register') }],
          { cancelable: false },
        );
      }
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Mã OTP không chính xác';
      if (Platform.OS === 'web') window.alert('Lỗi: ' + msg);
      else Alert.alert('Lỗi', msg);
    }
  };

  return {
    router,
    password, setPassword,
    showPassword, setShowPassword,
    error, setError,
    errorMessage, setErrorMessage,
    otpModalVisible, setOtpModalVisible,
    targetIdentifier,
    countdown,
    isLoading,
    handleDeleteRequest,
    handleResendOtp,
    handleVerifyAndDelete,
  };
}
