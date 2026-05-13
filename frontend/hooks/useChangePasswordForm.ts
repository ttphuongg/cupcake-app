import { useState, useEffect } from 'react';
import { Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../store/authStore';

export function useChangePasswordForm() {
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

  const [otpModalVisible, setOtpModalVisible] = useState(false);
  const [targetIdentifier, setTargetIdentifier] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [storedNewPassword, setStoredNewPassword] = useState('');

  useEffect(() => {
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
      if (Platform.OS !== 'web') Alert.alert('Xác thực', 'Mã OTP đã được gửi.');
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

  return {
    currentPassword, setCurrentPassword,
    newPassword, setNewPassword,
    confirmPassword, setConfirmPassword,
    focusedInput, setFocusedInput,
    showCurrent, setShowCurrent,
    showNew, setShowNew,
    showConfirm, setShowConfirm,
    errors, setErrors,
    errorMessages, setErrorMessages,
    apiError,
    otpModalVisible, setOtpModalVisible,
    targetIdentifier,
    countdown,
    isLoading,
    handleChangePassword,
    handleResendOtp,
    handleVerifyOtp,
    router,
  };
}
