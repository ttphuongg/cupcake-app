import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useOtpTimer } from '../../hooks/useOtpTimer';
import { useForgotPasswordForm } from '../../hooks/useForgotPasswordForm';
import { AuthHeader } from '../../components/Auth/AuthHeader';
import { AuthFooter } from '../../components/Auth/AuthFooter';
import { ForgotPasswordForm } from '../../components/Auth/ForgotPasswordForm';
import { ForgotPasswordOtpStep } from '../../components/Auth/ForgotPasswordOtpStep';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { countdown, startCountdown } = useOtpTimer(0);
  const form = useForgotPasswordForm(startCountdown);

  const handleResendOtp = async () => {
    if (countdown > 0) return;
    startCountdown(60);
    await form.handleRequestOTP();
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.mainContainer}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" bounces={false}>
        <LinearGradient
          colors={['rgba(192, 219, 234, 0.2)', 'rgba(186, 144, 198, 0.1)', 'rgba(232, 160, 191, 0.2)']}
          style={styles.gradientContainer}
        >
          <Animated.View entering={ZoomIn.duration(500).springify()} style={styles.contentWrapper}>
            {/* Back Button */}
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <Feather name="arrow-left" size={24} color={Colors.mutedForeground} />
            </TouchableOpacity>

            <AuthHeader icon="help-circle" title="Quên mật khẩu" subtitle="Nhập email để nhận mã đặt lại" color={Colors.accent} />

            <Animated.View entering={FadeInDown.delay(300).duration(600)} style={styles.card}>
              <Animated.View style={styles.inputStack}>
                {!form.isOtpStep ? (
                  <ForgotPasswordForm form={form} />
                ) : (
                  <ForgotPasswordOtpStep form={form} countdown={countdown} handleResendOtp={handleResendOtp} />
                )}
              </Animated.View>
            </Animated.View>

            <AuthFooter baseText="Bạn đã nhớ lại mật khẩu?" linkText="Đăng nhập" href="/login" />
          </Animated.View>
        </LinearGradient>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { flexGrow: 1 },
  gradientContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 40 },
  contentWrapper: { width: '100%', maxWidth: 400, position: 'relative' },
  backButton: { position: 'absolute', top: -20, left: 0, width: 40, height: 40, justifyContent: 'center', alignItems: 'center', zIndex: 10 },
  card: { backgroundColor: Colors.card, borderRadius: 32, padding: 32, elevation: 5, borderWidth: 1, borderColor: Colors.border },
  inputStack: { gap: 20 },
});
