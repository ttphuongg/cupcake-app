import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useForgotPasswordForm } from '../../hooks/useForgotPasswordForm';
import { AuthHeader } from '../../components/Auth/AuthHeader';
import { AuthFooter } from '../../components/Auth/AuthFooter';
import { ForgotPasswordForm } from '../../components/Auth/ForgotPasswordForm';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const form = useForgotPasswordForm();

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

            <AuthHeader icon="help-circle" title="Quên mật khẩu" subtitle="Nhận liên kết khôi phục qua email" color={Colors.primary} />

            <Animated.View entering={FadeInDown.delay(300).duration(600)} style={styles.card}>
              <Animated.View style={styles.inputStack}>
                {!form.isSubmitted ? (
                  <ForgotPasswordForm form={form} />
                ) : (
                  <Animated.View entering={FadeInDown} style={styles.successContainer}>
                    <View style={styles.successIconWrapper}>
                      <Feather name="mail" size={48} color={Colors.primary} />
                    </View>
                    <Text style={styles.successTitle}>Đã gửi liên kết!</Text>
                    <Text style={styles.successText}>
                      Chúng tôi đã gửi một liên kết khôi phục mật khẩu đến email:
                    </Text>
                    <Text style={styles.successEmail}>{form.identifier}</Text>
                    <Text style={styles.successInstructions}>
                      Vui lòng kiểm tra hộp thư đến (và thư rác) của bạn, liên kết này sẽ có hiệu lực trong vòng 15 phút.
                    </Text>
                    <TouchableOpacity
                      style={styles.backToLoginBtn}
                      onPress={() => router.replace('/login')}
                    >
                      <Text style={styles.backToLoginBtnText}>Quay lại Đăng nhập</Text>
                    </TouchableOpacity>
                  </Animated.View>
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
  successContainer: { alignItems: 'center', paddingVertical: 10 },
  successIconWrapper: {
    width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(232, 160, 191, 0.2)',
    justifyContent: 'center', alignItems: 'center', marginBottom: 20
  },
  successTitle: { fontSize: 22, fontWeight: '700', color: Colors.foreground, marginBottom: 12 },
  successText: { fontSize: 14, color: Colors.mutedForeground, textAlign: 'center', lineHeight: 20 },
  successEmail: { fontSize: 15, fontWeight: '600', color: Colors.foreground, marginVertical: 8 },
  successInstructions: { fontSize: 13, color: Colors.mutedForeground, textAlign: 'center', lineHeight: 18, marginTop: 4 },
  backToLoginBtn: {
    backgroundColor: Colors.primary, borderRadius: 20, paddingVertical: 15, paddingHorizontal: 30,
    alignItems: 'center', marginTop: 24, width: '100%',
    shadowColor: Colors.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 6,
  },
  backToLoginBtnText: { color: 'white', fontSize: 15, fontWeight: '700' },
});
