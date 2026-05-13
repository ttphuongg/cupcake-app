import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Colors } from '@/constants/theme';
import { CustomTextInput } from '../Shared/CustomTextInput';

interface ChangePasswordFormProps {
  form: any;
}

export const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({ form }) => {
  return (
    <View style={styles.inputStack}>
      <CustomTextInput
        label="Mật khẩu hiện tại"
        fieldKey="current"
        value={form.currentPassword}
        onChangeText={form.setCurrentPassword}
        placeholder="Nhập mật khẩu hiện tại"
        isPassword
        showPassword={form.showCurrent}
        onToggleShow={() => form.setShowCurrent((p: boolean) => !p)}
        focusedInput={form.focusedInput}
        onFocusKey={form.setFocusedInput}
        onBlurKey={() => form.setFocusedInput(null)}
        error={form.errors.current}
        errorMsg={form.errorMessages.current}
        onClearError={(key) => {
          form.setErrors((p: any) => ({ ...p, [key]: false }));
          form.setErrorMessages((p: any) => ({ ...p, [key]: '' }));
        }}
      />
      <View style={styles.divider} />
      <CustomTextInput
        label="Mật khẩu mới"
        fieldKey="new"
        value={form.newPassword}
        onChangeText={form.setNewPassword}
        placeholder="Ít nhất 6 ký tự"
        isPassword
        showPassword={form.showNew}
        onToggleShow={() => form.setShowNew((p: boolean) => !p)}
        focusedInput={form.focusedInput}
        onFocusKey={form.setFocusedInput}
        onBlurKey={() => form.setFocusedInput(null)}
        error={form.errors.new}
        errorMsg={form.errorMessages.new}
        onClearError={(key) => {
          form.setErrors((p: any) => ({ ...p, [key]: false }));
          form.setErrorMessages((p: any) => ({ ...p, [key]: '' }));
        }}
      />
      <CustomTextInput
        label="Xác nhận mật khẩu mới"
        fieldKey="confirm"
        value={form.confirmPassword}
        onChangeText={form.setConfirmPassword}
        placeholder="Nhập lại mật khẩu mới"
        isPassword
        showPassword={form.showConfirm}
        onToggleShow={() => form.setShowConfirm((p: boolean) => !p)}
        focusedInput={form.focusedInput}
        onFocusKey={form.setFocusedInput}
        onBlurKey={() => form.setFocusedInput(null)}
        error={form.errors.confirm}
        errorMsg={form.errorMessages.confirm}
        onClearError={(key) => {
          form.setErrors((p: any) => ({ ...p, [key]: false }));
          form.setErrorMessages((p: any) => ({ ...p, [key]: '' }));
        }}
      />

      {form.apiError && (
        <Animated.View entering={FadeInDown} style={styles.apiErrorBox}>
          <Text style={styles.apiErrorText}>{form.apiError}</Text>
        </Animated.View>
      )}

      <TouchableOpacity onPress={form.handleChangePassword} activeOpacity={0.8} disabled={form.isLoading}>
        <Animated.View style={[styles.primaryButton, form.isLoading && styles.primaryButtonLoading]} entering={FadeInUp.delay(400)}>
          <Text style={styles.primaryButtonText}>
            {form.isLoading ? 'Đang xử lý...' : 'Cập nhật mật khẩu'}
          </Text>
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  inputStack: { gap: 16 },
  divider: { height: 1, backgroundColor: Colors.border, marginVertical: 4 },
  apiErrorBox: { padding: 12, backgroundColor: '#fee2e2', borderRadius: 8, marginTop: 4 },
  apiErrorText: { color: '#ef4444', fontSize: 13, textAlign: 'center', fontWeight: '500' },
  primaryButton: { backgroundColor: Colors.primary, borderRadius: 20, paddingVertical: 18, alignItems: 'center', marginTop: 8, elevation: 6 },
  primaryButtonLoading: { opacity: 0.7 },
  primaryButtonText: { color: 'white', fontSize: 17, fontWeight: '700' },
});
