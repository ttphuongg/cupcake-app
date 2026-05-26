import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Colors } from '@/constants/theme';

interface RegisterOtpStepProps {
  form: any;
  countdown: number;
  handleResendOtp: () => void;
}

export const RegisterOtpStep: React.FC<RegisterOtpStepProps> = ({ form, countdown, handleResendOtp }) => {
  return (
    <>
      <View style={styles.field}>
        <Text style={styles.fieldLabel}>Mã xác thực OTP</Text>
        <TextInput
          style={[styles.textInput, form.focusedInput === 'otp' && styles.textInputActive, form.errors.otp && styles.textInputError]}
          value={form.otpCode}
          onChangeText={(t) => { form.setOtpCode(t); if (form.errors.otp) form.setErrors((p: any) => ({ ...p, otp: false })); }}
          placeholder="123456"
          placeholderTextColor="#9ca3af"
          keyboardType="number-pad"
          maxLength={6}
          onFocus={() => form.setFocusedInput('otp')}
          onBlur={() => form.setFocusedInput(null)}
        />
        <Text style={styles.otpNotice}>
          Vui lòng kiểm tra {form.targetIdentifier.includes('@') ? 'email' : 'tin nhắn SĐT'}: {form.targetIdentifier}
        </Text>
      </View>

      <TouchableOpacity onPress={form.handleVerifyOtp} activeOpacity={0.8} disabled={form.isLoading}>
        <Animated.View style={styles.secondaryButton} entering={FadeInUp.delay(200)}>
          <Text style={styles.secondaryButtonText}>
            {form.isLoading ? 'Đang xác thực...' : 'Xác nhận Đăng ký'}
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

      <TouchableOpacity onPress={() => form.setIsOtpStep(false)} style={styles.backButton}>
        <Text style={styles.backButtonText}>Quay lại sửa thông tin</Text>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  field: { gap: 6 },
  fieldLabel: { fontSize: 14, fontWeight: '600', color: Colors.foreground, marginLeft: 4 },
  textInput: {
    backgroundColor: Colors.inputBackground, borderRadius: 16, paddingHorizontal: 16,
    paddingVertical: 14, fontSize: 16, borderWidth: 2, borderColor: 'transparent', color: Colors.foreground,
    // @ts-ignore
  },
  textInputActive: { borderColor: 'rgba(232, 160, 191, 0.5)' },
  textInputError: { borderColor: '#ff0000', borderWidth: 2.5 },
  otpNotice: { fontSize: 12, color: Colors.mutedForeground, textAlign: 'center', marginTop: 4 },
  secondaryButton: {
    backgroundColor: Colors.primary, borderRadius: 20, paddingVertical: 18, alignItems: 'center', marginTop: 12,
    shadowColor: Colors.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 6,
  },
  secondaryButtonText: { color: 'white', fontSize: 17, fontWeight: '700' },
  resendBtn: {
    paddingVertical: 14, alignItems: 'center', marginTop: 8, borderRadius: 16,
    borderWidth: 1, borderColor: Colors.primary, backgroundColor: 'rgba(232, 160, 191, 0.1)',
  },
  resendBtnDisabled: { borderColor: '#e2e8f0', backgroundColor: '#f8fafc' },
  resendBtnText: { color: Colors.primary, fontSize: 15, fontWeight: '700' },
  resendBtnTextDisabled: { color: '#94a3b8', fontWeight: '600' },
  backButton: { marginTop: 12, alignItems: 'center' },
  backButtonText: { fontSize: 14, color: Colors.mutedForeground, textDecorationLine: 'underline' },
});
