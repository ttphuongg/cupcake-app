import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/theme';
import { useProfileForm } from '../../hooks/useProfileForm';
import { useOtpTimer } from '../../hooks/useOtpTimer';
import { OtpModal } from '../../components/Auth/OtpModal';
import { ProfileHeader } from '../../components/Profile/ProfileHeader';
import { ProfileForm } from '../../components/Profile/ProfileForm';
import { ProfileMenu } from '../../components/Profile/ProfileMenu';
import { ProfileFooter } from '../../components/Profile/ProfileFooter';

export default function ProfileTab() {
  const router = useRouter();
  const {
    user, isLoading, isEditing, setIsEditing, editData, setEditData,
    errors, setErrors, errorMessages, setErrorMessages,
    otpModalVisible, setOtpModalVisible, targetIdentifier,
    handleSaveProfile, handleVerifyProfileOtp, cancelEdit, handleLogout,
    pickImage
  } = useProfileForm();

  const { countdown, startCountdown, resetCountdown } = useOtpTimer(0);

  // When OTP modal visibility changes, start or reset timer
  useEffect(() => {
    if (otpModalVisible) {
      startCountdown(60);
    } else {
      resetCountdown();
    }
  }, [otpModalVisible]);

  const onSaveProfile = () => {
    handleSaveProfile(() => startCountdown(60));
  };

  const onResendOtp = async () => {
    if (countdown > 0) return;
    startCountdown(60);
    await handleSaveProfile();
  };

  if (!user && isLoading) {
    return <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 60 }} />;
  }

  if (!user && !isLoading) {
    return (
      <View style={[styles.container, styles.guestContainer]}>
        <Text style={styles.guestText}>Vui lòng đăng nhập để xem thông tin tài khoản</Text>
        <TouchableOpacity style={styles.guestBtn} onPress={() => router.push('/login')}>
          <Text style={styles.guestBtnText}>Đăng nhập ngay</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ProfileHeader
        user={user}
        isEditing={isEditing}
        isLoading={isLoading}
        editData={editData}
        onEdit={() => setIsEditing(true)}
        onCancel={cancelEdit}
        onSave={onSaveProfile}
        onPickImage={pickImage}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <ProfileForm
          user={user}
          isEditing={isEditing}
          editData={editData}
          setEditData={setEditData}
          errors={errors}
          setErrors={setErrors}
          errorMessages={errorMessages}
          setErrorMessages={setErrorMessages}
        />

        <ProfileMenu />
        <ProfileFooter onLogout={handleLogout} />
      </ScrollView>

      <OtpModal
        visible={otpModalVisible}
        targetIdentifier={targetIdentifier}
        isLoading={isLoading}
        countdown={countdown}
        onVerify={handleVerifyProfileOtp}
        onResend={onResendOtp}
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
  scrollContent: { paddingBottom: 40 },
  guestContainer: { justifyContent: 'center', alignItems: 'center', padding: 24 },
  guestText: { fontSize: 16, color: Colors.mutedForeground, marginBottom: 24, textAlign: 'center' },
  guestBtn: { backgroundColor: Colors.primary, paddingHorizontal: 32, paddingVertical: 14, borderRadius: 24, elevation: 2, shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8 },
  guestBtnText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});