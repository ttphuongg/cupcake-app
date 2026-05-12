/**
 * app/modal.tsx — Modal mặc định (dùng để test hoặc xem thông tin app)
 */
import { Link } from 'expo-router';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Colors } from '@/constants/theme';

export default function ModalScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thông tin ứng dụng</Text>
      <Text style={styles.body}>Tiệm bánh Cupcake 88 — Phiên bản 1.0</Text>
      <Link href="/" asChild>
        <TouchableOpacity style={styles.link}>
          <Text style={styles.linkText}>Quay lại trang chủ</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20, backgroundColor: Colors.background },
  title: { fontSize: 22, fontWeight: '700', color: Colors.foreground, marginBottom: 12 },
  body: { fontSize: 15, color: Colors.mutedForeground, marginBottom: 24 },
  link: { paddingVertical: 14, paddingHorizontal: 28, backgroundColor: Colors.primary, borderRadius: 14 },
  linkText: { color: 'white', fontWeight: '700', fontSize: 15 },
});
