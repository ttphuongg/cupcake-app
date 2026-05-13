import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';
import { Colors } from '@/constants/theme';
import { OtpModal } from '../components/Auth/OtpModal';
import { useDeleteAccountForm } from '../hooks/useDeleteAccountForm';

export default function DeleteAccountScreen() {
  const form = useDeleteAccountForm();

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={() => form.router.back()}>
          <Feather name="chevron-left" size={30} color="#1f2937" />
        </TouchableOpacity>

        <View style={styles.content}>
          <Animated.View entering={ZoomIn} style={styles.iconContainer}>
            <Feather name="alert-triangle" size={50} color={Colors.primary} />
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(200)}>
            <Text style={styles.title}>Xóa tài khoản?</Text>
            <Text style={styles.warningText}>
              Hành động này <Text style={{ fontWeight: 'bold' }}>không thể hoàn tác</Text>. Tất cả dữ liệu, hồ sơ và cài đặt của bạn sẽ bị xóa vĩnh viễn khỏi hệ thống của chúng tôi.
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(400)} style={styles.formCard}>
            <Text style={styles.label}>Nhập mật khẩu hiện tại</Text>
            <View style={[styles.passwordWrapper, form.error && styles.inputError]}>
              <TextInput
                style={styles.input}
                value={form.password}
                onChangeText={(text) => {
                  form.setPassword(text);
                  if (form.error) form.setError(false);
                  if (form.errorMessage) form.setErrorMessage('');
                }}
                placeholder="Mật khẩu của bạn"
                secureTextEntry={!form.showPassword}
                autoCapitalize="none"
                textContentType="none"
                autoComplete="off"
                importantForAutofill="no"
                autoCorrect={false}
                spellCheck={false}
              />
              <TouchableOpacity onPress={() => form.setShowPassword(!form.showPassword)} style={styles.eyeBtn}>
                <Feather name={form.showPassword ? 'eye' : 'eye-off'} size={20} color={form.error ? '#ef4444' : '#9ca3af'} />
              </TouchableOpacity>
            </View>
            {form.errorMessage ? <Text style={styles.errorText}>{form.errorMessage}</Text> : null}

            <TouchableOpacity
              style={[styles.deleteBtn, form.isLoading && { opacity: 0.7 }]}
              onPress={form.handleDeleteRequest}
              disabled={form.isLoading}
            >
              <Text style={styles.deleteBtnText}>
                {form.isLoading ? 'Đang xử lý...' : 'Xác nhận xóa tài khoản'}
              </Text>
            </TouchableOpacity>
          </Animated.View>

          <TouchableOpacity style={styles.cancelBtn} onPress={() => form.router.back()}>
            <Text style={styles.cancelBtnText}>Tôi đã đổi ý, giữ lại tài khoản</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <OtpModal
        visible={form.otpModalVisible}
        targetIdentifier={form.targetIdentifier}
        isLoading={form.isLoading}
        countdown={form.countdown}
        onVerify={form.handleVerifyAndDelete}
        onResend={form.handleResendOtp}
        onClose={() => form.setOtpModalVisible(false)}
        title="Bước cuối cùng"
        verifyBtnLabel="Xóa vĩnh viễn"
        variant="bottom-sheet"
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  scrollContent: { padding: 24, paddingTop: 60 },
  backButton: { marginBottom: 20 },
  content: { alignItems: 'center' },
  iconContainer: {
    width: 100, height: 100, backgroundColor: 'rgba(232, 160, 191, 0.2)',
    borderRadius: 50, justifyContent: 'center', alignItems: 'center', marginBottom: 24,
  },
  title: { fontSize: 30, fontWeight: '800', color: '#111827', marginBottom: 12 },
  warningText: { textAlign: 'center', color: '#6b7280', fontSize: 16, lineHeight: 24, marginBottom: 32 },
  formCard: {
    width: '100%', backgroundColor: '#f9fafb', borderRadius: 24,
    padding: 24, borderWidth: 1, borderColor: '#f3f4f6',
  },
  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 },
  passwordWrapper: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: 'white',
    borderRadius: 16, borderWidth: 1, borderColor: '#e5e7eb', marginBottom: 24,
  },
  input: {
    flex: 1, padding: 16, fontSize: 16,
  },
  eyeBtn: { padding: 16 },
  deleteBtn: {
    backgroundColor: Colors.primary, padding: 18, borderRadius: 16, alignItems: 'center',
    shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4,
  },
  deleteBtnText: { color: 'white', fontSize: 16, fontWeight: '700' },
  cancelBtn: { marginTop: 24 },
  cancelBtnText: { color: '#6b7280', fontWeight: '600' },
  inputError: { borderColor: '#ef4444', borderWidth: 2 },
  errorText: { color: '#ef4444', fontSize: 12, fontWeight: '500', marginTop: -16, marginBottom: 16, marginLeft: 4 },
});
