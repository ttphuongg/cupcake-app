/**
 * app/(auth)/login.tsx — Màn hình Đăng nhập
 * Logic: useAuthStore.login() — không còn fetch/AsyncStorage trực tiếp.
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter, Link } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  FadeInDown,
  FadeInUp,
  ZoomIn,
} from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useAuthStore } from '../../store/authStore';

export default function LoginScreen() {
  const router = useRouter();
  const { login, isLoading } = useAuthStore();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [errorMessages, setErrorMessages] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async () => {
    // ── Validation ──────────────────────────────────────────────────────────
    const newErrors: Record<string, boolean> = {};
    const newMsgs: Record<string, string> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;

    if (!identifier) {
      newErrors.identifier = true;
      newMsgs.identifier = 'Vui lòng nhập email hoặc sdt';
    } else if (!emailRegex.test(identifier) && !phoneRegex.test(identifier)) {
      newErrors.identifier = true;
      newMsgs.identifier = 'Vui lòng nhập email hoặc sdt';
    }
    if (!password) {
      newErrors.password = true;
      newMsgs.password = 'Vui lòng nhập mật khẩu';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setErrorMessages(newMsgs);
      return;
    }

    setErrors({});
    setErrorMessages({});

    // ── Gọi store ────────────────────────────────────────────────────────────
    try {
      await login({ identifier, password });
      router.replace('/');
    } catch (error: unknown) {
      // Phân tích lỗi từ backend để hiển thị inline
      const msg: string =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        (error instanceof Error ? error.message : 'Lỗi đăng nhập');

      if (msg === 'Tài khoản không tồn tại') {
        setErrors({ identifier: true });
        setErrorMessages({ identifier: msg });
      } else if (msg.includes('Mật khẩu')) {
        setErrors({ password: true });
        setErrorMessages({ password: 'Mật khẩu không chính xác' });
      } else if (msg.includes('xác thực')) {
        setErrors({ identifier: true });
        setErrorMessages({ identifier: 'Tài khoản chưa xác thực' });
      } else {
        Alert.alert('Thông báo', msg);
      }
    }
  };

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
          colors={[
            'rgba(232, 160, 191, 0.2)',
            'rgba(186, 144, 198, 0.1)',
            'rgba(192, 219, 234, 0.2)',
          ]}
          style={styles.gradientContainer}
        >
          <Animated.View
            entering={ZoomIn.duration(500).springify()}
            style={styles.contentWrapper}
          >
            {/* Header Section */}
            <View style={styles.header}>
              <Animated.View
                entering={ZoomIn.delay(200).springify()}
                style={styles.logoContainer}
              >
                <Feather name="log-in" size={40} color="white" />
              </Animated.View>
              <Text style={styles.titleText}>Đăng nhập</Text>
              <Text style={styles.subtitleText}>Chào mừng bạn trở lại!</Text>
            </View>

            {/* Form Section */}
            <Animated.View
              entering={FadeInDown.delay(300).duration(600)}
              style={styles.card}
            >
              <View style={styles.inputStack}>
                {/* Email / SĐT */}
                <View style={styles.field}>
                  <Text style={styles.fieldLabel}>Email hoặc Số điện thoại</Text>
                  <TextInput
                    style={[
                      styles.textInput,
                      focusedInput === 'identifier' && styles.textInputActive,
                      errors.identifier && styles.textInputError,
                    ]}
                    value={identifier}
                    onChangeText={(text) => {
                      setIdentifier(text);
                      if (errors.identifier) setErrors((prev) => ({ ...prev, identifier: false }));
                    }}
                    placeholder="Email hoặc SĐT"
                    placeholderTextColor="#9ca3af"
                    keyboardType="default"
                    autoCapitalize="none"
                    textContentType="none"
                    autoComplete="off"
                    importantForAutofill="no"
                    autoCorrect={false}
                    spellCheck={false}
                    onFocus={() => setFocusedInput('identifier')}
                    onBlur={() => setFocusedInput(null)}
                  />
                  {errorMessages.identifier ? (
                    <Text style={styles.errorText}>{errorMessages.identifier}</Text>
                  ) : null}
                </View>

                {/* Mật khẩu */}
                <View style={styles.field}>
                  <Text style={styles.fieldLabel}>Mật khẩu</Text>
                  <View style={styles.passwordContainer}>
                    <TextInput
                      style={[
                        styles.textInput,
                        styles.passwordInput,
                        focusedInput === 'password' && styles.textInputActive,
                        errors.password && styles.textInputError,
                      ]}
                      value={password}
                      onChangeText={(text) => {
                        setPassword(text);
                        if (errors.password) setErrors((prev) => ({ ...prev, password: false }));
                      }}
                      placeholder="••••••••"
                      placeholderTextColor="#9ca3af"
                      secureTextEntry={!showPassword}
                      textContentType="none"
                      autoComplete="off"
                      importantForAutofill="no"
                      autoCorrect={false}
                      spellCheck={false}
                      onFocus={() => setFocusedInput('password')}
                      onBlur={() => setFocusedInput(null)}
                    />
                    <TouchableOpacity
                      style={styles.eyeIcon}
                      onPress={() => setShowPassword(!showPassword)}
                    >
                      <Feather
                        name={showPassword ? 'eye' : 'eye-off'}
                        size={20}
                        color={errors.password ? '#ef4444' : '#9ca3af'}
                      />
                    </TouchableOpacity>
                  </View>
                  {errorMessages.password ? (
                    <Text style={styles.errorText}>{errorMessages.password}</Text>
                  ) : null}
                  <Link href="/forgot-password" asChild>
                    <TouchableOpacity style={styles.forgotPasswordLink}>
                      <Text style={styles.forgotPasswordText}>Quên mật khẩu?</Text>
                    </TouchableOpacity>
                  </Link>
                </View>

                {/* Submit */}
                <TouchableOpacity
                  onPress={handleSubmit}
                  activeOpacity={0.8}
                  disabled={isLoading}
                >
                  <Animated.View style={styles.primaryButton} entering={FadeInUp.delay(400)}>
                    <Text style={styles.primaryButtonText}>
                      {isLoading ? 'Đang xử lý...' : 'Đăng nhập'}
                    </Text>
                  </Animated.View>
                </TouchableOpacity>
              </View>
            </Animated.View>

            {/* Footer Section */}
            <Animated.View entering={FadeInUp.delay(500).duration(500)} style={styles.footer}>
              <Text style={styles.footerBaseText}>
                Chưa có tài khoản?{' '}
                <Link href="/register" asChild>
                  <TouchableOpacity>
                    <Text style={styles.footerLinkText}>Đăng ký ngay</Text>
                  </TouchableOpacity>
                </Link>
              </Text>
            </Animated.View>
          </Animated.View>
        </LinearGradient>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  gradientContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  contentWrapper: {
    width: '100%',
    maxWidth: 400,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoContainer: {
    width: 80,
    height: 80,
    backgroundColor: Colors.primary,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  titleText: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.foreground,
    marginBottom: 8,
  },
  subtitleText: {
    fontSize: 16,
    color: Colors.mutedForeground,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 32,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.08,
    shadowRadius: 30,
    elevation: 5,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  inputStack: {
    gap: 20,
  },
  field: {
    gap: 8,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.foreground,
    marginLeft: 4,
  },
  textInput: {
    backgroundColor: Colors.inputBackground,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    borderWidth: 2,
    borderColor: 'transparent',
    color: Colors.foreground,
    // @ts-ignore — web-only property
    outlineStyle: 'none',
  },
  passwordContainer: {
    position: 'relative',
    justifyContent: 'center',
  },
  passwordInput: {
    paddingRight: 50,
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInputActive: {
    borderColor: 'rgba(232, 160, 191, 0.5)',
  },
  textInputError: {
    borderColor: '#ef4444',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
    marginLeft: 4,
  },
  forgotPasswordLink: {
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  forgotPasswordText: {
    color: Colors.mutedForeground,
    fontSize: 13,
    fontWeight: '600',
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 12,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: '700',
  },
  footer: {
    marginTop: 24,
    alignItems: 'center',
  },
  footerBaseText: {
    fontSize: 15,
    color: Colors.mutedForeground,
  },
  footerLinkText: {
    color: Colors.primary,
    fontWeight: '700',
  },
});
