import React from 'react';
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

        <VoucherSection />

        <PaymentMethodSection />

        <SummarySection totalAmount={totalAmount} />
      </ScrollView>

      <CheckoutFooter 
        totalAmount={totalAmount} 
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