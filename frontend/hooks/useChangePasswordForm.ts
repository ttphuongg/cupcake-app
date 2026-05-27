import { useState } from 'react';
import { Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../store/authStore';

export function useChangePasswordForm() {
  const router = useRouter();
  const { requestChangePasswordLink, isLoading } = useAuthStore();
  const [apiError, setApiError] = useState<string | null>(null);

  const handleRequestLink = async () => {
    setApiError(null);
    try {
      await requestChangePasswordLink();
      if (Platform.OS === 'web') {
        window.alert('Đã gửi liên kết xác nhận vào Email của bạn. Vui lòng kiểm tra hộp thư.');
        router.back();
      } else {
        Alert.alert('Thành công', 'Đã gửi liên kết xác nhận vào Email của bạn. Vui lòng kiểm tra hộp thư.', [
          { text: 'OK', onPress: () => router.back() },
        ]);
      }
    } catch (error: unknown) {
      const msg: string =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        (error instanceof Error ? error.message : 'Không thể gửi yêu cầu');
      setApiError(msg);
      if (Platform.OS === 'web') window.alert('Lỗi: ' + msg);
      else Alert.alert('Lỗi', msg);
    }
  };

  return {
    isLoading,
    apiError,
    handleRequestLink,
    router,
  };
}
