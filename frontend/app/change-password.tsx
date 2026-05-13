import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp, ZoomIn } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { OtpModal } from '../components/Auth/OtpModal';
import { AuthHeader } from '../components/Auth/AuthHeader';
import { useChangePasswordForm } from '../hooks/useChangePasswordForm';
import { ChangePasswordForm } from '../components/Auth/ChangePasswordForm';

export default function ChangePasswordScreen() {
  const form = useChangePasswordForm();

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.mainContainer}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" bounces={false}>
        <LinearGradient
          colors={['rgba(232, 160, 191, 0.15)', 'rgba(186, 144, 198, 0.10)', 'rgba(192, 219, 234, 0.20)']}
          style={styles.gradientContainer}
        >
          <Animated.View entering={ZoomIn.duration(500).springify()} style={styles.contentWrapper}>
            <TouchableOpacity style={styles.backButton} onPress={() => form.router.back()}>
              <Feather name="arrow-left" size={24} color={Colors.mutedForeground} />
            </TouchableOpacity>

            <AuthHeader icon="lock" title="Đổi mật khẩu" subtitle="Cập nhật mật khẩu bảo mật của bạn" />

            <Animated.View entering={FadeInDown.delay(300).duration(600)} style={styles.card}>
              <ChangePasswordForm form={form} />
            </Animated.View>

            <Animated.View entering={FadeInUp.delay(500).duration(500)} style={styles.footer}>
              <Feather name="shield" size={14} color={Colors.mutedForeground} style={{ marginRight: 6 }} />
              <Text style={styles.footerText}>Mật khẩu được mã hóa an toàn</Text>
            </Animated.View>
          </Animated.View>
        </LinearGradient>
      </ScrollView>

      <OtpModal
        visible={form.otpModalVisible}
        targetIdentifier={form.targetIdentifier}
        isLoading={form.isLoading}
        countdown={form.countdown}
        onVerify={form.handleVerifyOtp}
        onResend={form.handleResendOtp}
        onClose={() => form.setOtpModalVisible(false)}
        title="Xác nhận đổi mật khẩu"
        verifyBtnLabel="Xác nhận thay đổi"
        variant="center"
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { flexGrow: 1 },
  gradientContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 60 },
  contentWrapper: { width: '100%', maxWidth: 400, position: 'relative' },
  backButton: { position: 'absolute', top: -20, left: 0, width: 40, height: 40, justifyContent: 'center', alignItems: 'center', zIndex: 10 },
  card: { backgroundColor: Colors.card, borderRadius: 32, padding: 28, elevation: 5, borderWidth: 1, borderColor: Colors.border },
  footer: { marginTop: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  footerText: { fontSize: 13, color: Colors.mutedForeground },
});
