import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';
import { Colors } from '@/constants/theme';
import { useLoginForm } from '../../hooks/useLoginForm';
import { AuthHeader } from '../../components/Auth/AuthHeader';
import { AuthFooter } from '../../components/Auth/AuthFooter';
import { LoginForm } from '../../components/Auth/LoginForm';

export default function LoginScreen() {
  const form = useLoginForm();
  const router = useRouter();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.mainContainer}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        bounces={false}
      >
        <LinearGradient
          colors={['rgba(232, 160, 191, 0.2)', 'rgba(186, 144, 198, 0.1)', 'rgba(192, 219, 234, 0.2)']}
          style={styles.gradientContainer}
        >
          <TouchableOpacity style={styles.backHomeBtn} onPress={() => router.replace('/')}>
            <Feather name="arrow-left" size={24} color={Colors.primary} />
            <Text style={styles.backHomeText}>Trang chủ</Text>
          </TouchableOpacity>

          <Animated.View
            entering={ZoomIn.duration(500).springify()}
            style={styles.contentWrapper}
          >
            <AuthHeader icon="log-in" title="Đăng nhập" subtitle="Chào mừng bạn trở lại!" />

            <Animated.View
              entering={FadeInDown.delay(300).duration(600)}
              style={styles.card}
            >
              <LoginForm form={form} />
            </Animated.View>

            <AuthFooter baseText="Chưa có tài khoản?" linkText="Đăng ký ngay" href="/register" />
          </Animated.View>
        </LinearGradient>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { flexGrow: 1 },
  gradientContainer: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
    paddingHorizontal: 24, paddingVertical: 40,
  },
  contentWrapper: { width: '100%', maxWidth: 400 },
  card: {
    backgroundColor: Colors.card, borderRadius: 32, padding: 32,
    shadowColor: '#000', shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.08, shadowRadius: 30, elevation: 5,
    borderWidth: 1, borderColor: Colors.border,
  },
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
