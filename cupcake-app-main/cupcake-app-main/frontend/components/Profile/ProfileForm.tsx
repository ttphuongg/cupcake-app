import React from 'react';
import { StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Colors, Radius, Shadows } from '@/constants/theme';
import { ProfileItem } from './ProfileItem';

interface ProfileFormProps {
  user: any;
  isEditing: boolean;
  editData: any;
  setEditData: any;
  errors: any;
  setErrors: any;
  errorMessages: any;
  setErrorMessages: any;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({
  user,
  isEditing,
  editData,
  setEditData,
  errors,
  setErrors,
  errorMessages,
  setErrorMessages,
}) => {
  return (
    <Animated.View entering={FadeInDown.delay(100)} style={[styles.card, styles.spacedCard]}>
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
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white, marginHorizontal: 16, marginBottom: 16,
    borderRadius: Radius.xl, padding: 16, ...Shadows.sm,
  },
  spacedCard: { marginTop: 20 },
});
