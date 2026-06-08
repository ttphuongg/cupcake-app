import React from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Colors } from '../../constants/theme';
import { useProfileForm } from '../../hooks/useProfileForm';

import { ProfileHeader } from '../../components/Profile/ProfileHeader';
import { ProfileForm } from '../../components/Profile/ProfileForm';
import { ProfileMenu } from '../../components/Profile/ProfileMenu';
import { ProfileFooter } from '../../components/Profile/ProfileFooter';

export default function ProfileTab() {
  const {
    user, isLoading, isEditing, setIsEditing, editData, setEditData,
    errors, setErrors, errorMessages, setErrorMessages,
    handleSaveProfile, cancelEdit, handleLogout, pickImage
  } = useProfileForm();

  const onSaveProfile = () => {
    handleSaveProfile();
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

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { paddingBottom: 40 },
});