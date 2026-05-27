import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Colors, Radius } from '@/constants/theme';
import { EditProfileData } from '../../types/profile';

interface ProfileItemProps {
  label: string;
  value: string;
  field?: keyof EditProfileData;
  editable?: boolean;
  isEditing?: boolean;
  editData?: EditProfileData;
  setEditData?: (data: EditProfileData) => void;
  errors?: Record<string, boolean>;
  setErrors?: (updater: (prev: Record<string, boolean>) => Record<string, boolean>) => void;
  errorMessages?: Record<string, string>;
  setErrorMessages?: (updater: (prev: Record<string, string>) => Record<string, string>) => void;
  isLast?: boolean;
}

export const ProfileItem: React.FC<ProfileItemProps> = ({
  label,
  value,
  field,
  editable = false,
  isEditing,
  editData,
  setEditData,
  errors,
  setErrors,
  errorMessages,
  setErrorMessages,
}) => (
  <View style={styles.itemRow}>
    <View style={{ flex: 1 }}>
      <Text style={styles.itemLabel}>{label}</Text>
      {isEditing && editable && field && editData && setEditData && errors && errorMessages ? (
        <>
          <TextInput
            style={[styles.editInput, errors[field] && { borderBottomColor: '#ef4444' }]}
            value={editData[field]}
            onChangeText={(text) => {
              setEditData({ ...editData, [field]: text });
              if (errors[field] && setErrors) setErrors((prev) => ({ ...prev, [field]: false }));
              if (errorMessages[field] && setErrorMessages) setErrorMessages((prev) => ({ ...prev, [field]: '' }));
            }}
            textContentType="none"
            autoComplete="off"
            importantForAutofill="no"
            autoCorrect={false}
            spellCheck={false}
          />
          {errorMessages[field] ? (
            <Text style={styles.inlineError}>{errorMessages[field]}</Text>
          ) : null}
        </>
      ) : (
        <Text style={styles.itemValue}>{value || 'Chưa thiết lập'}</Text>
      )}
    </View>
  </View>
);

const styles = StyleSheet.create({
  itemRow: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  itemLabel: { fontSize: 13, color: '#9ca3af', marginBottom: 4 },
  itemValue: { fontSize: 16, color: '#1f2937', fontWeight: '600' },
  editInput: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '600',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: Colors.primary,
  },
  inlineError: { color: '#ef4444', fontSize: 11, marginTop: 2, fontWeight: '500' },
});
