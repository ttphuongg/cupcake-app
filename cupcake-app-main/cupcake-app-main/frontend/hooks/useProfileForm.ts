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

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const uri = result.assets[0].uri;
        const fileName = uri.split('/').pop() || 'avatar.jpg';
        // Match mimetype based on extension
        const match = /\.(\w+)$/.exec(fileName);
        const type = match ? `image/${match[1]}` : `image`;
        
        const uploadRes = await userService.uploadAvatar(uri, type, fileName);
        if (uploadRes && uploadRes.avatarUrl) {
          const avatarUrl = uploadRes.avatarUrl;
          setEditData(prev => ({ ...prev, avatar_url: avatarUrl }));
          
          // Tự động lưu lên DB
          const result = await updateProfile({ ...editData, avatar_url: avatarUrl });
          if (!result.requiresOtp) {
             Alert.alert('Thành công', 'Ảnh đại diện đã được cập nhật');
          }
        }
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Lỗi', 'Không thể tải ảnh lên');
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
