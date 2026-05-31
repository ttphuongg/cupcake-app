import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp, ZoomIn } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { AuthHeader } from '../components/Auth/AuthHeader';
import { useChangePasswordForm } from '../hooks/useChangePasswordForm';

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

            <AuthHeader icon="lock" title="Đổi mật khẩu" subtitle="Gửi yêu cầu đổi mật khẩu bảo mật" />

            <Animated.View entering={FadeInDown.delay(300).duration(600)} style={styles.card}>
              <Text style={{ textAlign: 'center', color: Colors.mutedForeground, fontSize: 15, marginBottom: 24, lineHeight: 22 }}>
                Để đảm bảo an toàn tuyệt đối, chúng tôi sẽ gửi một liên kết đổi mật khẩu vào email của bạn. Liên kết này chỉ có hiệu lực trong 15 phút.
              </Text>

              <TouchableOpacity
                style={[styles.submitBtn, form.isLoading && { opacity: 0.7 }]}
                onPress={form.handleRequestLink}
                disabled={form.isLoading}
              >
                <Text style={styles.submitBtnText}>
                  {form.isLoading ? 'Đang gửi...' : 'Gửi liên kết đổi mật khẩu'}
                </Text>
              </TouchableOpacity>
            </Animated.View>

            <Animated.View entering={FadeInUp.delay(500).duration(500)} style={styles.footer}>
              <Feather name="shield" size={14} color={Colors.mutedForeground} style={{ marginRight: 6 }} />
              <Text style={styles.footerText}>Bảo vệ thông tin của bạn</Text>
            </Animated.View>
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
  card: { backgroundColor: Colors.card, borderRadius: 32, padding: 28, elevation: 5, borderWidth: 1, borderColor: Colors.border },
  submitBtn: {
    backgroundColor: Colors.primary, padding: 16, borderRadius: 16, alignItems: 'center', marginTop: 10,
    shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4,
  },
  submitBtnText: { color: Colors.white, fontSize: 16, fontWeight: 'bold' },
  footer: { marginTop: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  footerText: { fontSize: 13, color: Colors.mutedForeground },
});
