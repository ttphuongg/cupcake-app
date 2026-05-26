import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';
import { Colors } from '@/constants/theme';
import { useOtpTimer } from '../../hooks/useOtpTimer';
import { useRegisterForm } from '../../hooks/useRegisterForm';
import { AuthHeader } from '../../components/Auth/AuthHeader';
import { AuthFooter } from '../../components/Auth/AuthFooter';
import { RegisterForm } from '../../components/Auth/RegisterForm';
import { RegisterOtpStep } from '../../components/Auth/RegisterOtpStep';

export default function RegisterScreen() {
  const router = useRouter();
  const { countdown, startCountdown } = useOtpTimer(0);
  const form = useRegisterForm(startCountdown);

  const handleResendOtp = async () => {
    if (countdown > 0) return;
    startCountdown(60);
    await form.handleSubmit();
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.mainContainer}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={['rgba(232, 160, 191, 0.2)', 'rgba(247, 233, 237, 0.3)', 'rgba(186, 144, 198, 0.15)']}
          style={styles.gradientContainer}
        >
          <TouchableOpacity style={styles.backHomeBtn} onPress={() => router.replace('/')}>
            <Feather name="arrow-left" size={24} color={Colors.primary} />
            <Text style={styles.backHomeText}>Trang chủ</Text>
          </TouchableOpacity>

          <Animated.View entering={ZoomIn.duration(500).springify()} style={styles.contentWrapper}>
            <AuthHeader icon="user-plus" title="Đăng ký" subtitle="Tạo tài khoản mới" />

            <Animated.View entering={FadeInDown.delay(300).duration(600)} style={styles.card}>
              <Animated.View style={styles.inputStack}>
                {!form.isOtpStep ? (
                  <RegisterForm form={form} />
                ) : (
                  <RegisterOtpStep form={form} countdown={countdown} handleResendOtp={handleResendOtp} />
                )}
              </Animated.View>
            </Animated.View>

            <AuthFooter baseText="Đã có tài khoản?" linkText="Đăng nhập" href="/login" />
          </Animated.View>
        </LinearGradient>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { flexGrow: 1 },
  gradientContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 60 },
  contentWrapper: { width: '100%', maxWidth: 400 },
  card: { backgroundColor: Colors.card, borderRadius: 32, padding: 32, elevation: 5, borderWidth: 1, borderColor: Colors.border },
  inputStack: { gap: 16 },
  backHomeBtn: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    left: 24,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  backHomeText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
});
