import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Colors } from '@/constants/theme';
import { CustomTextInput } from '../Shared/CustomTextInput';

interface ForgotPasswordOtpStepProps {
  form: any;
  countdown: number;
  handleResendOtp: () => void;
}

export const ForgotPasswordOtpStep: React.FC<ForgotPasswordOtpStepProps> = ({ form, countdown, handleResendOtp }) => {
  return (
    <>
      <CustomTextInput
        label="Mã xác thực OTP"
        fieldKey="otp"
        value={form.otpCode}
        onChangeText={form.setOtpCode}
        placeholder="123456"
        keyboardType="number-pad"
        maxLength={6}
        focusedInput={form.focusedInput}
        onFocusKey={form.setFocusedInput}
        onBlurKey={() => form.setFocusedInput(null)}
        error={form.errors.otp}
        errorMsg={form.errorMessages.otp}
        onClearError={(key: string) => {
          form.setErrors((p: any) => ({ ...p, [key]: false }));
          form.setErrorMessages((p: any) => ({ ...p, [key]: '' }));
        }}
      />

      <View style={styles.field}>
        <CustomTextInput
          label="Mật khẩu mới"
          fieldKey="newPassword"
          value={form.newPassword}
          onChangeText={form.setNewPassword}
          placeholder="••••••••"
          isPassword
          showPassword={form.showPassword}
          onToggleShow={() => form.setShowPassword((p: boolean) => !p)}
          focusedInput={form.focusedInput}
          onFocusKey={form.setFocusedInput}
          onBlurKey={() => form.setFocusedInput(null)}
          error={form.errors.newPassword}
          errorMsg={form.errorMessages.newPassword}
          onClearError={(key: string) => {
            form.setErrors((p: any) => ({ ...p, [key]: false }));
            form.setErrorMessages((p: any) => ({ ...p, [key]: '' }));
          }}
        />
      </View>

      <TouchableOpacity onPress={form.handleVerifyAndReset} activeOpacity={0.8} disabled={form.isLoading}>
        <Animated.View style={styles.primaryButton} entering={FadeInUp.delay(200)}>
          <Text style={styles.primaryButtonText}>
            {form.isLoading ? 'Đang xử lý...' : 'Cập nhật mật khẩu'}
          </Text>
        </Animated.View>
      </TouchableOpacity>

      <Animated.View entering={FadeInUp.delay(300)}>
        <TouchableOpacity
          style={[styles.resendBtn, countdown > 0 && styles.resendBtnDisabled]}
          onPress={handleResendOtp}
          disabled={countdown > 0 || form.isLoading}
        >
          <Text style={[styles.resendBtnText, countdown > 0 && styles.resendBtnTextDisabled]}>
            {countdown > 0 ? `Gửi lại mã OTP sau ${countdown}s` : 'Gửi lại mã OTP'}
          </Text>
        </TouchableOpacity>
      </Animated.View>

      <TouchableOpacity onPress={() => form.setIsOtpStep(false)} style={styles.backToEmail}>
        <Text style={styles.backToEmailText}>Quay lại nhập email</Text>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  field: { gap: 8 },
  fieldLabel: { fontSize: 14, fontWeight: '600', color: Colors.foreground, marginLeft: 4 },
  primaryButton: {
    backgroundColor: Colors.accent, borderRadius: 20, paddingVertical: 18,
    alignItems: 'center', marginTop: 12,
    shadowColor: Colors.accent, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 6,
  },
  primaryButtonText: { color: 'white', fontSize: 17, fontWeight: '700' },
  resendBtn: {
    paddingVertical: 14, alignItems: 'center', marginTop: 8, borderRadius: 16,
    borderWidth: 1, borderColor: Colors.primary, backgroundColor: 'rgba(232, 160, 191, 0.1)',
  },
  resendBtnDisabled: { borderColor: '#e2e8f0', backgroundColor: '#f8fafc' },
  resendBtnText: { color: Colors.primary, fontSize: 15, fontWeight: '700' },
  resendBtnTextDisabled: { color: '#94a3b8', fontWeight: '600' },
  backToEmail: { marginTop: 12, alignItems: 'center' },
  backToEmailText: { fontSize: 14, color: Colors.mutedForeground, textDecorationLine: 'underline' },
});
