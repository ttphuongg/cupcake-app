import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Link } from 'expo-router';
import { Colors } from '@/constants/theme';
import { CustomTextInput } from '../Shared/CustomTextInput';

interface LoginFormProps {
  form: any;
}

export const LoginForm: React.FC<LoginFormProps> = ({ form }) => {
  return (
    <View style={styles.inputStack}>
      {/* Email / SĐT */}
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
          form.setErrors((prev: any) => ({ ...prev, [key]: false }));
          form.setErrorMessages((prev: any) => ({ ...prev, [key]: '' }));
        }}
      />

      {/* Mật khẩu */}
      <View style={styles.field}>
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
        <Link href="/forgot-password" asChild>
          <TouchableOpacity style={styles.forgotPasswordLink}>
            <Text style={styles.forgotPasswordText}>Quên mật khẩu?</Text>
          </TouchableOpacity>
        </Link>
      </View>

      {/* Submit */}
      <TouchableOpacity
        onPress={form.handleSubmit}
        activeOpacity={0.8}
        disabled={form.isLoading}
      >
        <Animated.View style={styles.primaryButton} entering={FadeInUp.delay(400)}>
          <Text style={styles.primaryButtonText}>
            {form.isLoading ? 'Đang xử lý...' : 'Đăng nhập'}
          </Text>
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  inputStack: { gap: 20 },
  field: { gap: 8 },
  forgotPasswordLink: { alignSelf: 'flex-end', marginTop: -4 },
  forgotPasswordText: { color: Colors.mutedForeground, fontSize: 13, fontWeight: '600' },
  primaryButton: {
    backgroundColor: Colors.primary, borderRadius: 20, paddingVertical: 18, alignItems: 'center', marginTop: 12,
    shadowColor: Colors.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 6,
  },
  primaryButtonText: { color: 'white', fontSize: 17, fontWeight: '700' },
});
