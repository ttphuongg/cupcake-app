/**
 * components/PasswordField.tsx
 * Ô nhập mật khẩu có nút show/hide, label, và hiển thị lỗi.
 * Tách ra từ app/change-password.tsx
 */
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';

export interface PasswordFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  fieldKey: string;
  show: boolean;
  onToggleShow: () => void;
  placeholder: string;
  error: boolean;
  errorMsg: string;
  focusedInput: string | null;
  onFocus: (key: string) => void;
  onBlur: () => void;
  setErrors: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  setErrorMessages: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

export const PasswordField: React.FC<PasswordFieldProps> = ({
  label,
  value,
  onChangeText,
  fieldKey,
  show,
  onToggleShow,
  placeholder,
  error,
  errorMsg,
  focusedInput,
  onFocus,
  onBlur,
  setErrors,
  setErrorMessages,
}) => (
  <View style={styles.field}>
    <Text style={styles.fieldLabel}>{label}</Text>
    <View
      style={[
        styles.inputWrapper,
        focusedInput === fieldKey && styles.inputWrapperActive,
        error && styles.inputWrapperError,
      ]}
    >
      <TextInput
        style={styles.textInput}
        value={value}
        onChangeText={(text) => {
          onChangeText(text);
          if (error) setErrors((prev) => ({ ...prev, [fieldKey]: false }));
          if (errorMsg) setErrorMessages((prev) => ({ ...prev, [fieldKey]: '' }));
        }}
        placeholder={placeholder}
        placeholderTextColor="#9ca3af"
        secureTextEntry={!show}
        autoCapitalize="none"
        onFocus={() => onFocus(fieldKey)}
        onBlur={() => onBlur()}
      />
      <TouchableOpacity onPress={onToggleShow} style={styles.eyeButton}>
        <Feather
          name={show ? 'eye' : 'eye-off'}
          size={18}
          color={error ? '#ef4444' : Colors.mutedForeground}
        />
      </TouchableOpacity>
    </View>
    {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}
  </View>
);

const styles = StyleSheet.create({
  field: { gap: 8 },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.foreground,
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.inputBackground,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  inputWrapperActive: { borderColor: 'rgba(232, 160, 191, 0.5)' },
  inputWrapperError: { borderColor: '#ef4444' },
  textInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: Colors.foreground,
    backgroundColor: 'transparent',
    // @ts-ignore — web-only property
    outlineStyle: 'none',
  },
  eyeButton: { paddingHorizontal: 14, paddingVertical: 14 },
  errorText: { color: '#ef4444', fontSize: 12, fontWeight: '500', marginTop: 2, marginLeft: 4 },
});
