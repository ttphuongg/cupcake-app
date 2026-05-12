import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  FadeInDown,
  ZoomIn,
} from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useAuthStore } from '../store/authStore';

export default function LogoutScreen() {
  const router = useRouter();
  const { logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await logout();
      if (Platform.OS === 'web') {
        window.alert('Bạn đã đăng xuất thành công!');
      } else {
        Alert.alert('Thành công', 'Bạn đã đăng xuất thành công!');
      }
      router.replace('/login');
    } catch {
      if (Platform.OS === 'web') {
        window.alert('Lỗi: Không thể đăng xuất vào lúc này.');
      } else {
        Alert.alert('Lỗi', 'Không thể đăng xuất vào lúc này.');
      }
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <LinearGradient
        colors={[
          'rgba(232, 160, 191, 0.1)', // primary/10
          'rgba(186, 144, 198, 0.1)', // secondary/10
          'rgba(192, 219, 234, 0.2)', // accent/20
        ]}
        style={styles.container}
      >
        <Animated.View
          entering={ZoomIn.duration(500)}
          style={styles.contentContainer}
        >
          {/* Header Icon */}
          <Animated.View
            entering={ZoomIn.delay(200).springify()}
            style={styles.iconContainer}
          >
            <Feather name="log-out" size={40} color={Colors.primary} />
          </Animated.View>

          {/* Text Content */}
          <Animated.View
            entering={FadeInDown.delay(300).duration(500)}
            style={styles.textContainer}
          >
            <Text style={styles.title}>Đăng xuất</Text>
            <Text style={styles.subtitle}>
              Bạn có chắc chắn muốn rời khỏi ứng dụng không?
            </Text>
          </Animated.View>

          {/* Action Buttons */}
          <Animated.View
            entering={FadeInDown.delay(400).duration(500)}
            style={styles.buttonContainer}
          >
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
              activeOpacity={0.8}
            >
              <Text style={styles.logoutButtonText}>Đăng xuất</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancel}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelButtonText}>Quay lại</Text>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  contentContainer: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: Colors.card,
    borderRadius: 32,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 5,
    borderColor: 'rgba(0,0,0,0.05)',
    borderWidth: 1,
  },
  iconContainer: {
    width: 90,
    height: 90,
    backgroundColor: 'white',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: Colors.foreground,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.mutedForeground,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  logoutButton: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.border,
  },
  cancelButtonText: {
    color: Colors.mutedForeground,
    fontSize: 16,
    fontWeight: '600',
  },
});
