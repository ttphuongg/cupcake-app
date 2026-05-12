/**
 * app/profile.tsx — Màn hình Hồ sơ cá nhân
 * Logic: useAuthStore.fetchProfile(), updateProfile(), verifyProfileOtp(), logout()
 * UI: ProfileItem + OtpModal từ components/
 */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Colors, Radius, Shadows } from '@/constants/theme';
import { ChevronLeft, Camera, Edit2 } from 'lucide-react-native';
import { useAuthStore } from '../store/authStore';
import { ProfileItem, EditProfileData } from '../components/ProfileItem';
import { OtpModal } from '../components/OtpModal';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, isLoading, fetchProfile, updateProfile, verifyProfileOtp, logout } = useAuthStore();

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<EditProfileData>({
    name: user?.name ?? '',
    email: user?.email ?? '',
    phone: user?.phone ?? '',
  });
  const [errors, setErrors]         = useState<Record<string, boolean>>({});
  const [errorMessages, setErrorMessages] = useState<Record<string, string>>({});

  // OTP state
  const [otpModalVisible, setOtpModalVisible] = useState(false);
  const [targetIdentifier, setTargetIdentifier] = useState('');
  const [pendingTempData, setPendingTempData] = useState<unknown>(null);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    fetchProfile();
  }, []);

  // Cập nhật form khi user thay đổi trong store
  useEffect(() => {
    if (user) {
      setEditData({
        name: user.name ?? '',
        email: user.email ?? '',
        phone: user.phone ?? '',
      });
    }
  }, [user]);

  // Đếm ngược OTP
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (otpModalVisible && countdown > 0) {
      timer = setInterval(() => setCountdown((p) => p - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [otpModalVisible, countdown]);

  const validate = (): boolean => {
    const newErrors: Record<string, boolean> = {};
    const newMsgs: Record<string, string> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;

    if (!editData.name.trim()) {
      newErrors.name = true;
      newMsgs.name = 'Họ tên không được để trống';
    }
    if (editData.email && !emailRegex.test(editData.email)) {
      newErrors.email = true;
      newMsgs.email = 'Email không hợp lệ';
    }
    if (editData.phone && !phoneRegex.test(editData.phone)) {
      newErrors.phone = true;
      newMsgs.phone = 'Số điện thoại không hợp lệ';
    }
    setErrors(newErrors);
    setErrorMessages(newMsgs);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveProfile = async () => {
    if (!validate()) return;

    try {
      const result = await updateProfile(editData);
      if (result.requiresOtp && result.targetIdentifier) {
        setTargetIdentifier(result.targetIdentifier);
        setPendingTempData(result.tempData);
        setOtpModalVisible(true);
        if (countdown === 0) setCountdown(60);
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

  const handleResendOtp = async () => {
    if (countdown > 0) return;
    setCountdown(60);
    await handleSaveProfile();
  };

  const handleLogout = () => {
    Alert.alert(
      'Đăng xuất',
      'Bạn có chắc chắn muốn đăng xuất không?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Đăng xuất',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/login');
          },
        },
      ],
    );
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

  if (!user && isLoading) {
    return <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 60 }} />;
  }

  return (
    <View style={styles.container}>
      {/* Pink Header */}
      <View style={styles.pinkHeader}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ChevronLeft size={28} color={Colors.white} />
        </TouchableOpacity>
        <View style={styles.avatarContainer}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarLetter}>{(user?.name ?? 'U')[0].toUpperCase()}</Text>
          </View>
          <View style={styles.cameraIconBadge}>
            <Camera size={14} color={Colors.mutedForeground} />
          </View>
        </View>
        {!isEditing ? (
          <TouchableOpacity style={styles.editPillBtn} onPress={() => setIsEditing(true)}>
            <Edit2 size={14} color={Colors.white} style={{ marginRight: 6 }} />
            <Text style={styles.editPillText}>Sửa hồ sơ</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.editActions}>
            <TouchableOpacity onPress={cancelEdit} style={styles.cancelEditBtn}>
              <Text style={styles.cancelEditText}>Hủy</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSaveProfile} style={[styles.saveBtn, isLoading && { opacity: 0.7 }]} disabled={isLoading}>
              {isLoading ? <ActivityIndicator size="small" color="white" /> : <Text style={styles.saveBtnText}>Lưu</Text>}
            </TouchableOpacity>
          </View>
        )}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Profile Info Card */}
        <Animated.View entering={FadeInDown.delay(100)} style={[styles.card, styles.overlappingCard]}>


          <ProfileItem
            label="Họ và tên"
            value={user?.name ?? ''}
            field="name"
            editable
            isEditing={isEditing}
            editData={editData}
            setEditData={setEditData}
            errors={errors}
            setErrors={setErrors}
            errorMessages={errorMessages}
            setErrorMessages={setErrorMessages}
          />
          <ProfileItem
            label="Email"
            value={user?.email ?? ''}
            field="email"
            editable
            isEditing={isEditing}
            editData={editData}
            setEditData={setEditData}
            errors={errors}
            setErrors={setErrors}
            errorMessages={errorMessages}
            setErrorMessages={setErrorMessages}
          />
          <ProfileItem
            label="Số điện thoại"
            value={user?.phone ?? ''}
            field="phone"
            editable
            isEditing={isEditing}
            editData={editData}
            setEditData={setEditData}
            errors={errors}
            setErrors={setErrors}
            errorMessages={errorMessages}
            setErrorMessages={setErrorMessages}
            isLast
          />
        </Animated.View>

        {/* Quick Links */}
        <Animated.View entering={FadeInDown.delay(200)} style={styles.card}>
          {[
            { label: 'Địa chỉ', icon: 'map-pin', value: 'Thiết lập ngay' },
            { label: 'Thanh toán', icon: 'credit-card', value: 'Chưa liên kết', color: Colors.foreground },
          ].map((item, index) => (
            <TouchableOpacity key={index} style={[styles.linkRow, index === 1 && { borderBottomWidth: 0 }]}>
              <Text style={styles.linkLabel}>{item.label}</Text>
              <Text style={[styles.linkValue, item.color ? { color: item.color, fontWeight: '600' } : {}]}>{item.value}</Text>
              <Feather name="chevron-right" size={16} color={Colors.mutedForeground} />
            </TouchableOpacity>
          ))}
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300)} style={styles.card}>
          {[
            { label: 'Đổi mật khẩu', icon: 'lock', route: '/change-password' as const },
            { label: 'Lịch sử đơn hàng', icon: 'package', route: '/order' as const },
          ].map((item, index) => (
            <TouchableOpacity
              key={item.route}
              style={styles.linkRow}
              onPress={() => router.push(item.route as never)}
            >
              <Feather name={item.icon as never} size={18} color={item.icon === 'trash-2' ? Colors.danger : Colors.foreground} />
              <Text style={[styles.linkLabel, item.icon === 'trash-2' && { color: Colors.danger }]}>
                {item.label}
              </Text>
              <Feather name="chevron-right" size={18} color={Colors.mutedForeground} />
            </TouchableOpacity>
          ))}
        </Animated.View>

        {/* Logout */}
        <Animated.View entering={FadeInDown.delay(400)}>
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Text style={styles.logoutBtnText}>Đăng xuất</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/delete-account' as never)}>
             <Text style={styles.deleteAccText}>Xóa tài khoản</Text>
          </TouchableOpacity>
          <Text style={styles.versionText}>Phiên bản ứng dụng v2.0.26</Text>
        </Animated.View>
      </ScrollView>

      <OtpModal
        visible={otpModalVisible}
        targetIdentifier={targetIdentifier}
        isLoading={isLoading}
        countdown={countdown}
        onVerify={handleVerifyProfileOtp}
        onResend={handleResendOtp}
        onClose={() => setOtpModalVisible(false)}
        title="Xác nhận thay đổi"
        verifyBtnLabel="Xác nhận"
        variant="center"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  pinkHeader: {
    backgroundColor: '#E8A0BF', // Solid pink matching Figma
    paddingTop: Platform.OS === 'android' ? 44 : 54,
    paddingHorizontal: 16,
    paddingBottom: 60,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: 'center',
  },
  backBtn: { position: 'absolute', top: Platform.OS === 'android' ? 44 : 54, left: 16, zIndex: 10 },
  avatarContainer: { position: 'relative', marginTop: 20, marginBottom: 12 },
  avatarCircle: {
    width: 90, height: 90, borderRadius: 45, backgroundColor: Colors.white,
    justifyContent: 'center', alignItems: 'center',
  },
  avatarLetter: { fontSize: 36, fontWeight: '800', color: Colors.primary },
  cameraIconBadge: {
    position: 'absolute', bottom: 0, right: 0,
    backgroundColor: Colors.white, width: 26, height: 26, borderRadius: 13,
    justifyContent: 'center', alignItems: 'center', ...Shadows.sm,
  },
  editPillBtn: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: Radius.xl,
  },
  editPillText: { color: Colors.white, fontSize: 13, fontWeight: '600' },
  editActions: { flexDirection: 'row', gap: 8 },
  cancelEditBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: Radius.md, backgroundColor: Colors.white },
  cancelEditText: { fontSize: 13, color: Colors.primaryDark, fontWeight: '600' },
  saveBtn: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: Radius.md, backgroundColor: Colors.primaryDark, minWidth: 50, alignItems: 'center' },
  saveBtnText: { fontSize: 13, color: 'white', fontWeight: '700' },
  scrollContent: { paddingBottom: 40 },
  overlappingCard: { marginTop: -30 },
  card: {
    backgroundColor: Colors.white, marginHorizontal: 16, marginBottom: 16,
    borderRadius: Radius.xl, padding: 16, ...Shadows.sm,
  },
  linkRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  linkLabel: { flex: 1, fontSize: 14, color: Colors.foreground },
  linkValue: { fontSize: 14, color: Colors.mutedForeground, marginRight: 8 },
  logoutBtn: {
    marginHorizontal: 16, marginTop: 8, padding: 16, backgroundColor: Colors.white,
    borderRadius: Radius.xl, alignItems: 'center', justifyContent: 'center', ...Shadows.sm,
  },
  logoutBtnText: { color: '#E8A0BF', fontSize: 15, fontWeight: '700' },
  deleteAccText: { color: Colors.danger, fontSize: 13, textAlign: 'center', marginTop: 16 },
  versionText: { color: Colors.mutedForeground, fontSize: 12, textAlign: 'center', marginTop: 16 },
});
