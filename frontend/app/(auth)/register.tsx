import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useRegisterForm } from '../../hooks/useRegisterForm';
import { AuthHeader } from '../../components/Auth/AuthHeader';
import { AuthFooter } from '../../components/Auth/AuthFooter';
import { RegisterForm } from '../../components/Auth/RegisterForm';

export default function RegisterScreen() {
  const router = useRouter();
  const form = useRegisterForm();

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
          <Animated.View entering={ZoomIn.duration(500).springify()} style={styles.contentWrapper}>
            {/* Back to Home Button */}
            <TouchableOpacity style={styles.backButton} onPress={() => router.replace('/(tabs)')} activeOpacity={0.7}>
              <Feather name="home" size={22} color={Colors.mutedForeground} />
            </TouchableOpacity>
            <AuthHeader icon="user-plus" title="Đăng ký" subtitle="Tạo tài khoản mới" />

            <Animated.View entering={FadeInDown.delay(300).duration(600)} style={styles.card}>
              <Animated.View style={styles.inputStack}>
                <RegisterForm form={form} />
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
  contentWrapper: { width: '100%', maxWidth: 400, position: 'relative' },
  backButton: { position: 'absolute', top: -20, left: 0, width: 40, height: 40, justifyContent: 'center', alignItems: 'center', zIndex: 10 },
  card: { backgroundColor: Colors.card, borderRadius: 32, padding: 32, elevation: 5, borderWidth: 1, borderColor: Colors.border },
  inputStack: { gap: 16 },
});
