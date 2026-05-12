/**
 * app/index.tsx — Entry point redirect
 * App thực tế bắt đầu từ (tabs)/index.tsx hoặc (auth)/login.tsx tùy trạng thái xác thực.
 * File này chỉ redirect về tabs khi mở app lần đầu.
 */
import { Redirect } from 'expo-router';

export default function IndexPage() {
  // Expo Router tự động navigate đến (tabs)/index khi user đã đăng nhập
  // hoặc (auth)/login khi chưa. File _layout.tsx xử lý logic này.
  return <Redirect href="/(tabs)" />;
}
