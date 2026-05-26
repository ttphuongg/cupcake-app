import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Colors } from '@/constants/theme';
import { CustomTextInput } from '../Shared/CustomTextInput';

interface ForgotPasswordFormProps {
  form: any;
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ form }) => {
  return (
    <>
      <CustomTextInput
        label="Email hoặc Số điện thoại"
        fieldKey="identifier"
        value={form.identifier}
        onChangeText={form.setIdentifier}
        placeholder="Email hoặc SĐT"
        focusedInput={form.focusedInput}
        onFocusKey={form.setFocusedInput}
        onBlurKey={() => form.setFocusedInput(null)}
        error={form.errors.identifier}
        errorMsg={form.errorMessages.identifier}
        onClearError={(key) => {
          form.setErrors((p: any) => ({ ...p, [key]: false }));
          form.setErrorMessages((p: any) => ({ ...p, [key]: '' }));
        }}
      />

      <TouchableOpacity onPress={form.handleRequestOTP} activeOpacity={0.8} disabled={form.isLoading}>
        <Animated.View style={styles.primaryButton} entering={FadeInUp.delay(400)}>
          <Text style={styles.primaryButtonText}>
            {form.isLoading ? 'Đang gửi...' : 'Gửi yêu cầu'}
          </Text>
        </Animated.View>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  field: { gap: 8 },
  primaryButton: {
    backgroundColor: Colors.accent, borderRadius: 20, paddingVertical: 18,
    alignItems: 'center', marginTop: 12,
    shadowColor: Colors.accent, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 6,
  },
  primaryButtonText: { color: 'white', fontSize: 17, fontWeight: '700' },
});
