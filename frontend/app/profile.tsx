import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Colors } from '@/constants/theme';
import { useProfileForm } from '../hooks/useProfileForm';
import { useOtpTimer } from '../hooks/useOtpTimer';
import { OtpModal } from '../components/Auth/OtpModal';
import { ProfileHeader } from '../components/Profile/ProfileHeader';
import { ProfileForm } from '../components/Profile/ProfileForm';
import { ProfileMenu } from '../components/Profile/ProfileMenu';
import { ProfileFooter } from '../components/Profile/ProfileFooter';

export default function ProfileScreen() {
  const {
    user, isLoading, isEditing, setIsEditing, editData, setEditData,
    errors, setErrors, errorMessages, setErrorMessages,
    otpModalVisible, setOtpModalVisible, targetIdentifier,
    handleSaveProfile, handleVerifyProfileOtp, cancelEdit, handleLogout
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

  return (
    <View style={styles.container}>
      <ProfileHeader
        user={user}
        isEditing={isEditing}
        isLoading={isLoading}
        onEdit={() => setIsEditing(true)}
        onCancel={cancelEdit}
        onSave={onSaveProfile}
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
});
