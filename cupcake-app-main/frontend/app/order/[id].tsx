import React from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { Colors } from '@/constants/theme';
import { useOrderDetailLogic } from '../../hooks/useOrderDetailLogic';
import { OrderDetailHeader } from '../../components/Order/OrderDetailHeader';
import { OrderDetailAddress } from '../../components/Order/OrderDetailAddress';
import { OrderDetailItems } from '../../components/Order/OrderDetailItems';
import { OrderDetailSummary } from '../../components/Order/OrderDetailSummary';
import { OrderDetailFooter } from '../../components/Order/OrderDetailFooter';

export default function OrderDetailScreen() {
  const { router, currentOrderDetail, isLoading, handleCancelOrder, handleReorder } = useOrderDetailLogic();

  if (isLoading) {
    return <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 60 }} />;
  }

  if (!currentOrderDetail) {
    return <Text style={styles.errorText}>Không có dữ liệu</Text>;
  }

  return (
    <View style={styles.container}>
      <OrderDetailHeader order={currentOrderDetail} onBack={() => router.back()} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <OrderDetailAddress order={currentOrderDetail} />
        <OrderDetailItems order={currentOrderDetail} />
        <OrderDetailSummary order={currentOrderDetail} />
      </ScrollView>

      <OrderDetailFooter
        status={currentOrderDetail.status}
        onCancel={handleCancelOrder}
        onReorder={handleReorder}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { paddingBottom: 100 },
  errorText: { textAlign: 'center', marginTop: 60, fontSize: 16, color: Colors.mutedForeground },
});