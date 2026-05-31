import { useState } from 'react';
import { Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../store/authStore';

export function useDeleteAccountForm() {
  const router = useRouter();
  const { requestDeleteAccountLink, isLoading } = useAuthStore();

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleDeleteRequest = async () => {
    if (!password) {
      setError(true);
      setErrorMessage('Vui lòng nhập mật khẩu xác nhận');
      return;
    }
    setError(false);
    setErrorMessage('');

    try {
      await requestDeleteAccountLink(password);
      if (Platform.OS === 'web') {
        window.alert('Đã gửi liên kết xác nhận xóa tài khoản vào Email của bạn. Vui lòng kiểm tra hộp thư.');
        router.back();
      } else {
        Alert.alert('Thành công', 'Đã gửi liên kết xác nhận xóa tài khoản vào Email của bạn. Vui lòng kiểm tra hộp thư.', [
          { text: 'OK', onPress: () => router.back() }
        ]);
      }
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

  return {
    router,
    password, setPassword,
    showPassword, setShowPassword,
    error, setError,
    errorMessage, setErrorMessage,
    isLoading,
    handleDeleteRequest,
  };
}
