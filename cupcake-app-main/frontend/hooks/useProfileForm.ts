import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../store/authStore';
import { EditProfileData, ProfileValidationErrors, ProfileValidationMessages } from '../types/profile';
import { isValidEmail, isValidPhone } from '../utils/validators';

export function useProfileForm() {
  const router = useRouter();
  const { user, isLoading, fetchProfile, updateProfile, verifyProfileOtp, logout } = useAuthStore();

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<EditProfileData>({
    name: user?.name ?? '',
    email: user?.email ?? '',
    phone: user?.phone ?? '',
  });

  const [errors, setErrors] = useState<ProfileValidationErrors>({});
  const [errorMessages, setErrorMessages] = useState<ProfileValidationMessages>({});

  // OTP state
  const [otpModalVisible, setOtpModalVisible] = useState(false);
  const [targetIdentifier, setTargetIdentifier] = useState('');
  const [pendingTempData, setPendingTempData] = useState<unknown>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  // Sync state when user from store updates
  useEffect(() => {
    if (user) {
      setEditData({
        name: user.name ?? '',
        email: user.email ?? '',
        phone: user.phone ?? '',
      });
    }
  }, [user]);

  const validate = (): boolean => {
    const newErrors: Record<string, boolean> = {};
    const newMsgs: Record<string, string> = {};

    if (!editData.name.trim()) {
      newErrors.name = true;
      newMsgs.name = 'Họ tên không được để trống';
    }
    if (editData.email && !isValidEmail(editData.email)) {
      newErrors.email = true;
      newMsgs.email = 'Email không hợp lệ';
    }
    if (editData.phone && !isValidPhone(editData.phone)) {
      newErrors.phone = true;
      newMsgs.phone = 'Số điện thoại không hợp lệ';
    }
    setErrors(newErrors);
    setErrorMessages(newMsgs);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveProfile = async (onOtpRequired?: () => void) => {
    if (!validate()) return;

    try {
      const result = await updateProfile(editData);
      if (result.requiresOtp && result.targetIdentifier) {
        setTargetIdentifier(result.targetIdentifier);
        setPendingTempData(result.tempData);
        setOtpModalVisible(true);
        if (onOtpRequired) onOtpRequired();
        Alert.alert('Xác thực', 'Mã OTP đã được gửi để xác nhận thay đổi.');
      } else {
        setIsEditing(false);
        Alert.alert('Thành công', 'Hồ sơ đã được cập nhật!');
      }
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        (err instanceof Error ? err.message : 'Không thể cập nhật hồ sơ');
      Alert.alert('Lỗi', msg);
    }
  };

  const handleVerifyProfileOtp = async (otp: string) => {
    try {
      await verifyProfileOtp({ otp, targetIdentifier, tempData: pendingTempData });
      setOtpModalVisible(false);
      setIsEditing(false);
      Alert.alert('Thành công', 'Hồ sơ đã được cập nhật!');
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Mã OTP không chính xác';
      Alert.alert('Lỗi', msg);
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditData({
      name: user?.name ?? '',
      email: user?.email ?? '',
      phone: user?.phone ?? '',
    });
    setErrors({});
    setErrorMessages({});
  };

  const handleLogout = () => {
    Alert.alert(
      'Xác nhận Đăng xuất',
      'Bạn có chắc chắn muốn đăng xuất không?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Đăng xuất',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/login');
          }
        }
      ]
    );
  };

  return {
    user,
    isLoading,
    isEditing,
    setIsEditing,
    editData,
    setEditData,
    errors,
    setErrors,
    errorMessages,
    setErrorMessages,
    otpModalVisible,
    setOtpModalVisible,
    targetIdentifier,
    handleSaveProfile,
    handleVerifyProfileOtp,
    cancelEdit,
    handleLogout
  };
}
