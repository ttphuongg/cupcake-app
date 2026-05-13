/**
 * app/(tabs)/orders.tsx — Lịch sử đơn hàng
 */
import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, ActivityIndicator, Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Radius, Shadows } from '../../constants/theme';
import { useOrderStore } from '../../store/orderStore';
import { OrderCard, OrderCardItem } from '../../components/Order/OrderCard';
import { ArrowLeft } from 'lucide-react-native';

const TABS: Array<{ key: string; label: string }> = [
  { key: 'ALL',       label: 'Tất cả' },
  { key: 'PENDING',   label: 'Chờ xác nhận' },
  { key: 'CONFIRMED', label: 'Đã xác nhận' },
  { key: 'SHIPPING',  label: 'Đang giao' },
  { key: 'COMPLETED', label: 'Hoàn thành' },
  { key: 'CANCELLED', label: 'Đã hủy' },
];

export default function OrdersTab() {
  const router = useRouter();
  const { orders, isLoading, fetchOrders } = useOrderStore();
  const [activeTab, setActiveTab] = useState('ALL');

  useEffect(() => {
    fetchOrders(activeTab === 'ALL' ? undefined : activeTab);
  }, [activeTab]);

  return (
    <View style={styles.container}>
      <View style={styles.pinkHeader}>
        <View style={styles.headerTop}>
          {/* Nút back này có thể quay về Home nếu tab này không phải là tab mặc định */}
          <TouchableOpacity onPress={() => router.replace('/(tabs)')} style={styles.backBtn}>
            <ArrowLeft size={24} color={Colors.foreground} />
          </TouchableOpacity>
          <View style={styles.headerTitleBox}>
            <Text style={styles.headerTitle}>Đơn hàng</Text>
          </View>
        </View>
      </View>

      <View style={styles.contentContainer}>
        {/* Tab bar */}
        <View style={styles.tabContainer}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={TABS}
            keyExtractor={(item) => item.key}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.tab, activeTab === item.key && styles.tabActive]}
                onPress={() => setActiveTab(item.key)}
              >
                <Text style={[styles.tabText, activeTab === item.key && styles.tabTextActive]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.tabListContent}
          />
        </View>

      {isLoading ? (
        <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 40 }} />
      ) : orders.length === 0 ? (
        <Text style={styles.emptyText}>Chưa có đơn hàng nào.</Text>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id?.toString() ?? ''}
          renderItem={({ item }) => (
            <OrderCard
              order={{
                id: item.id!,
                status: item.status,
                created_at: item.created_at ?? '',
                total_price: item.total_price,
                items: (item as any).items,
              } as OrderCardItem}
              onPress={(id) => router.push(`/order/${id}` as never)}
            />
          )}
          contentContainerStyle={{ paddingBottom: 100 }} // Thêm padding để không bị TabBar đè
        />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  pinkHeader: {
    backgroundColor: Colors.primaryAlpha10,
    paddingTop: Platform.OS === 'android' ? 44 : 54,
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  headerTop: { flexDirection: 'row', alignItems: 'center' },
  backBtn: { width: 40, height: 40, backgroundColor: Colors.white, borderRadius: Radius.full, justifyContent: 'center', alignItems: 'center', ...Shadows.sm },
  headerTitleBox: { flex: 1, marginLeft: 16 },
  headerTitle: { fontSize: 20, fontWeight: '800', color: Colors.foreground },
  contentContainer: { flex: 1, marginTop: -20 },
  tabContainer: {
    marginBottom: 16,
  },
  tabListContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  tab: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: Radius.full,
    backgroundColor: Colors.white,
    ...Shadows.sm,
  },
  tabActive: { backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.primary },
  tabText: { color: Colors.mutedForeground, fontWeight: '600', fontSize: 13 },
  tabTextActive: { color: Colors.primaryDark },
  emptyText: {
    textAlign: 'center',
    marginTop: 60,
    color: Colors.mutedForeground,
    fontSize: 16,
  },
});