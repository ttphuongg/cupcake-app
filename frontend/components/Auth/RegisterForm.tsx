import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { CustomTextInput } from '../Shared/CustomTextInput';

interface RegisterFormProps {
  form: any;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ form }) => {
  return (
    <>
      <CustomTextInput
        label="Họ tên"
        fieldKey="name"
        value={form.name}
        onChangeText={form.setName}
        placeholder="Nguyễn Văn A"
        autoCapitalize="words"
        focusedInput={form.focusedInput}
        onFocusKey={form.setFocusedInput}
        onBlurKey={() => form.setFocusedInput(null)}
        error={form.errors.name}
        errorMsg={form.errorMessages.name}
        onClearError={(key) => {
          form.setErrors((prev: any) => ({ ...prev, [key]: false }));
          form.setErrorMessages((prev: any) => ({ ...prev, [key]: '' }));
        }}
      />

      <CustomTextInput
        label="Số điện thoại"
        fieldKey="phone"
        value={form.phone}
        onChangeText={form.setPhone}
        placeholder="0123456789"
        keyboardType="phone-pad"
        maxLength={11}
        focusedInput={form.focusedInput}
        onFocusKey={form.setFocusedInput}
        onBlurKey={() => form.setFocusedInput(null)}
        error={form.errors.phone}
        errorMsg={form.errorMessages.phone}
        onClearError={(key) => {
          form.setErrors((prev: any) => ({ ...prev, [key]: false }));
          form.setErrorMessages((prev: any) => ({ ...prev, [key]: '' }));
        }}
      />

      <CustomTextInput
        label="Email"
        fieldKey="email"
        value={form.email}
        onChangeText={form.setEmail}
        placeholder="your@email.com"
        keyboardType="email-address"
        focusedInput={form.focusedInput}
        onFocusKey={form.setFocusedInput}
        onBlurKey={() => form.setFocusedInput(null)}
        error={form.errors.email}
        errorMsg={form.errorMessages.email}
        onClearError={(key) => {
          form.setErrors((prev: any) => ({ ...prev, [key]: false }));
          form.setErrorMessages((prev: any) => ({ ...prev, [key]: '' }));
        }}
      />

      <CustomTextInput
        label="Mật khẩu"
        fieldKey="password"
        value={form.password}
        onChangeText={form.setPassword}
        placeholder="••••••••"
        isPassword
        showPassword={form.showPassword}
        onToggleShow={() => form.setShowPassword((p: boolean) => !p)}
        focusedInput={form.focusedInput}
        onFocusKey={form.setFocusedInput}
        onBlurKey={() => form.setFocusedInput(null)}
        error={form.errors.password}
        errorMsg={form.errorMessages.password}
        onClearError={(key) => {
          form.setErrors((prev: any) => ({ ...prev, [key]: false }));
          form.setErrorMessages((prev: any) => ({ ...prev, [key]: '' }));
        }}
      />

      <CustomTextInput
        label="Xác nhận mật khẩu"
        fieldKey="confirmPassword"
        value={form.confirmPassword}
        onChangeText={form.setConfirmPassword}
        placeholder="••••••••"
        isPassword
        showPassword={form.showConfirmPassword}
        onToggleShow={() => form.setShowConfirmPassword((p: boolean) => !p)}
        focusedInput={form.focusedInput}
        onFocusKey={form.setFocusedInput}
        onBlurKey={() => form.setFocusedInput(null)}
        error={form.errors.confirmPassword}
        errorMsg={form.errorMessages.confirmPassword}
        onClearError={(key) => {
          form.setErrors((prev: any) => ({ ...prev, [key]: false }));
          form.setErrorMessages((prev: any) => ({ ...prev, [key]: '' }));
        }}
      />
      {form.apiError && (
        <Animated.View entering={FadeInDown} style={styles.apiErrorBox}>
          <Text style={styles.apiErrorText}>{form.apiError}</Text>
        </Animated.View>
      )}

      <TouchableOpacity onPress={form.handleSubmit} activeOpacity={0.8} disabled={form.isLoading}>
        <Animated.View style={styles.secondaryButton} entering={FadeInUp.delay(400)}>
          <Text style={styles.secondaryButtonText}>
            {form.isLoading ? 'Đang tạo...' : 'Đăng ký'}
          </Text>
        </Animated.View>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  field: { gap: 6 },
  fieldLabel: { fontSize: 14, fontWeight: '600', color: Colors.foreground, marginLeft: 4 },
  apiErrorBox: { padding: 12, backgroundColor: '#fee2e2', borderRadius: 8, marginTop: 4 },
  apiErrorText: { color: '#ef4444', fontSize: 13, textAlign: 'center', fontWeight: '500' },
  secondaryButton: {
    backgroundColor: Colors.primary, borderRadius: 20, paddingVertical: 18, alignItems: 'center', marginTop: 12,
    shadowColor: Colors.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 6,
  },
  secondaryButtonText: { color: 'white', fontSize: 17, fontWeight: '700' },
});
