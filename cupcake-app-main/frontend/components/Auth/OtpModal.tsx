import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Colors } from '@/constants/theme';

export interface OtpModalProps {
  visible: boolean;
  targetIdentifier: string;
  isLoading: boolean;
  countdown: number;
  onVerify: (otp: string) => void;
  onResend: () => void;
  onClose: () => void;
  title?: string;
  verifyBtnLabel?: string;
  variant?: 'center' | 'bottom-sheet';
}

export const OtpModal: React.FC<OtpModalProps> = ({
  visible,
  targetIdentifier,
  isLoading,
  countdown,
  onVerify,
  onResend,
  onClose,
  title = 'Xác thực OTP',
  verifyBtnLabel = 'Xác nhận',
  variant = 'center',
}) => {
  const [otpCode, setOtpCode] = useState('');

  const handleVerify = () => {
    onVerify(otpCode);
  };

  const isBottomSheet = variant === 'bottom-sheet';

  return (
    <Modal visible={visible} transparent animationType={isBottomSheet ? 'slide' : 'fade'}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View
          style={isBottomSheet ? styles.overlayBottom : styles.overlayCenter}
        >
          <Animated.View
            entering={FadeInUp}
            style={isBottomSheet ? styles.contentBottomSheet : styles.contentCenter}
          >
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>
              Nhập mã OTP đã được gửi đến:{' '}
              <Text style={styles.identifier}>{targetIdentifier}</Text>
            </Text>

            <TextInput
              style={styles.otpInput}
              value={otpCode}
              onChangeText={setOtpCode}
              placeholder="123456"
              keyboardType="number-pad"
              maxLength={6}
              autoFocus
            />

            <TouchableOpacity
              style={[styles.verifyBtn, isLoading && styles.verifyBtnDisabled]}
              onPress={handleVerify}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.verifyBtnText}>{verifyBtnLabel}</Text>
              )}
            </TouchableOpacity>

            {/* Gửi lại OTP */}
            <TouchableOpacity
              style={[styles.resendBtn, countdown > 0 && styles.resendBtnDisabled]}
              onPress={onResend}
              disabled={countdown > 0 || isLoading}
            >
              <Text style={[styles.resendBtnText, countdown > 0 && styles.resendBtnTextDisabled]}>
                {countdown > 0 ? `Gửi lại mã OTP sau ${countdown}s` : 'Gửi lại mã OTP'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={onClose} style={styles.cancelBtn}>
              <Text style={styles.cancelBtnText}>Quay lại</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlayCenter: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  overlayBottom: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  contentCenter: {
    backgroundColor: 'white',
    width: '100%',
    borderRadius: 30,
    padding: 30,
    alignItems: 'center',
  },
  contentBottomSheet: {
    backgroundColor: 'white',
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    padding: 35,
    paddingBottom: 50,
    alignItems: 'center',
  },
  title: { fontSize: 22, fontWeight: '800', marginBottom: 10, textAlign: 'center' },
  subtitle: { textAlign: 'center', color: '#6b7280', marginBottom: 20, lineHeight: 20 },
  identifier: { fontWeight: '700', color: Colors.primary },
  otpInput: {
    width: '100%',
    backgroundColor: '#f3f4f6',
    borderRadius: 15,
    padding: 15,
    fontSize: 24,
    textAlign: 'center',
    letterSpacing: 10,
    marginBottom: 20,
  },
  verifyBtn: { backgroundColor: Colors.primary, width: '100%', padding: 15, borderRadius: 15, alignItems: 'center' },
  verifyBtnDisabled: { opacity: 0.7 },
  verifyBtnText: { color: 'white', fontSize: 16, fontWeight: '700' },
  resendBtn: {
    width: '100%',
    paddingVertical: 13,
    alignItems: 'center',
    marginTop: 10,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: Colors.primary,
    backgroundColor: 'rgba(232, 160, 191, 0.1)',
  },
  resendBtnDisabled: { borderColor: '#e2e8f0', backgroundColor: '#f8fafc' },
  resendBtnText: { color: Colors.primary, fontSize: 14, fontWeight: '700' },
  resendBtnTextDisabled: { color: '#94a3b8', fontWeight: '600' },
  cancelBtn: { marginTop: 15 },
  cancelBtnText: { color: '#9ca3af' },
});
