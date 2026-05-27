import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import { Colors } from '@/constants/theme';
import { useCheckoutForm } from '../hooks/useCheckoutForm';
import { 
  AddressSection, DeliveryTimeSection, OrderItemsSection, 
  VoucherSection, PaymentMethodSection, SummarySection, CheckoutFooter 
} from '../components/Checkout/CheckoutSections';

export default function CheckoutScreen() {
  const {
    router, user, cartItems, totalAmount,
    phone, setPhone,
    address, setAddress,
    errors, errorMessages,
    isLoading,
    handlePlaceOrder,
  } = useCheckoutForm();

  // 1. Thêm State để lưu phần trăm giảm giá (mặc định là 0)
  const [discountPercent, setDiscountPercent] = useState(0);

  // 2. Tính toán số tiền cuối cùng sau khi áp mã
  const finalAmount = totalAmount - (totalAmount * discountPercent) / 100;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ChevronLeft size={26} color={Colors.foreground} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Xác nhận đơn hàng</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <AddressSection 
          phone={phone} setPhone={setPhone} 
          address={address} setAddress={setAddress} 
          user={user} errors={errors} errorMessages={errorMessages} 
        />
        
        <DeliveryTimeSection />

        <OrderItemsSection cartItems={cartItems} />

        {/* 3. Truyền hàm setDiscountPercent vào VoucherSection để hứng tín hiệu giảm giá */}
        <VoucherSection onApplyVoucher={setDiscountPercent} />

        <PaymentMethodSection />

        {/* 4. Truyền finalAmount thay vì totalAmount cũ để cập nhật cả phần Tóm tắt */}
        <SummarySection totalAmount={finalAmount} />
      </ScrollView>

      {/* 5. Cập nhật con số hiển thị trên nút Đặt hàng */}
      <CheckoutFooter 
        totalAmount={finalAmount} 
        isLoading={isLoading} 
        onPlaceOrder={handlePlaceOrder} 
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12, backgroundColor: Colors.white,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
    paddingTop: Platform.OS === 'android' ? 44 : 12,
  },
  backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: Colors.foreground },
  scrollView: { flex: 1 },
});