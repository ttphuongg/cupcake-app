import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../store/authStore';
import { EditProfileData, ProfileValidationErrors, ProfileValidationMessages } from '../types/profile';
import { isValidEmail, isValidPhone } from '../utils/validators';
import * as ImagePicker from 'expo-image-picker';
import { userService } from '../api/userService';

export function useProfileForm() {
  const router = useRouter();
  const { user, isLoading, fetchProfile, updateProfile, verifyProfileOtp, logout } = useAuthStore();

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<EditProfileData>({
    name: user?.name ?? '',
    email: user?.email ?? '',
    phone: user?.phone ?? '',
    avatar_url: user?.avatar_url ?? '',
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
        avatar_url: user.avatar_url ?? '',
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

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Quyền truy cập', 'Ứng dụng cần quyền truy cập thư viện ảnh để cập nhật ảnh đại diện.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.2, // Giảm chất lượng ảnh xuống 20% để file cực nhẹ, upload Base64 sẽ nhanh hơn rất nhiều
      base64: true,
    });

    if (!result.canceled && result.assets && result.assets[0].base64) {
      try {
        const base64Data = `data:image/jpeg;base64,${result.assets[0].base64}`;
        const uploadResult = await userService.uploadAvatar(base64Data);
        const avatarUrl = uploadResult.url;
        
        const updateResult = await updateProfile({ ...editData, avatar_url: avatarUrl });
        if (!updateResult.requiresOtp) {
          Alert.alert('Thành công', 'Đã cập nhật ảnh đại diện!');
        }
      } catch (err: unknown) {
        const msg =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
          'Không thể tải ảnh lên hoặc lưu ảnh đại diện';
        Alert.alert('Lỗi', msg);
      }
    }
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
    handleLogout,
    pickImage
  };
}
