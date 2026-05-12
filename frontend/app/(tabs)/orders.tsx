/**
 * app/(tabs)/orders.tsx
 *
 * THAY ĐỔI so với trước:
 * - File cũ là placeholder "Tính năng đang được phát triển"
 * - Bây giờ: redirect sang app/orders/index.tsx thật
 */
import { Redirect } from 'expo-router';

export default function OrdersTab() {
  return <Redirect href="/orders" />;
}