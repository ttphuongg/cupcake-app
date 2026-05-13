import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Colors } from '@/constants/theme';
import { ToastRenderer } from '../components/ToastRenderer';
import { initDB } from '../utils/database';
import { useDesignStore } from '../store/designStore';

export default function RootLayout() {
  const initDraftDesign = useDesignStore((state) => state.initDraftDesign);

  useEffect(() => {
    // Khởi tạo SQLite DB và load lại bản nháp thiết kế
    initDB();
    initDraftDesign();
  }, []);

  return (
    <SafeAreaProvider>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: Colors.primary },
          headerTintColor: Colors.white,
          headerTitleStyle: { fontWeight: '700' },
          contentStyle: { backgroundColor: Colors.background },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

        {/* Auth */}
        <Stack.Screen name="(auth)/login" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)/register" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)/forgot-password" options={{ headerShown: false }} />

        {/* Account */}
        <Stack.Screen name="profile" options={{ headerShown: false }} />
        <Stack.Screen name="change-password" options={{ headerShown: false }} />
        <Stack.Screen name="delete-account" options={{ headerShown: false }} />

        {/* Order & Product */}
        <Stack.Screen name="order/index" options={{ headerShown: false }} />
        <Stack.Screen name="order/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="cart" options={{ headerShown: false }} />
        <Stack.Screen name="checkout" options={{ headerShown: false }} />
        <Stack.Screen name="product/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="review" options={{ headerShown: false }} />
        <Stack.Screen name="design" options={{ headerShown: false }} />
      </Stack>

      {/* Toast: nằm trên cùng, hiển thị ở mọi màn hình */}
      <ToastRenderer />
    </SafeAreaProvider>
  );
}