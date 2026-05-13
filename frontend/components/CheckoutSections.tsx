import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { MapPin, Clock, Store, Ticket, CreditCard } from 'lucide-react-native';
import { Colors, Radius, Shadows } from '@/constants/theme';
import { Image } from 'expo-image';
import { CartItem } from '../types/cartItem';

export const AddressSection = ({
  phone, setPhone, address, setAddress, user, errors, errorMessages
}: any) => (
  <View style={styles.section}>
    <View style={styles.sectionHeader}>
      <MapPin size={20} color={Colors.primaryDark} />
      <Text style={styles.sectionTitle}>Địa chỉ giao hàng</Text>
      <TouchableOpacity style={{ marginLeft: 'auto' }}>
        <Text style={styles.changeText}>Thay đổi</Text>
      </TouchableOpacity>
    </View>
    <Text style={styles.addressName}>{user?.name || 'Khách hàng'} | {phone || 'Chưa có SĐT'}</Text>
    <TextInput
      style={[styles.input, styles.inputMultiline, errors.address && styles.inputError]}
      value={address}
      onChangeText={(t) => {
        setAddress(t);
        if (errors.address) errors.address = false;
      }}
      placeholder="Nhập địa chỉ nhận hàng chi tiết..."
      multiline
    />
    {errorMessages.address ? <Text style={styles.errorText}>{errorMessages.address}</Text> : null}
  </View>
);

export const DeliveryTimeSection = () => (
  <View style={styles.section}>
    <View style={styles.sectionHeader}>
      <Clock size={20} color={Colors.mutedForeground} />
      <Text style={styles.sectionTitle}>Thời gian nhận hàng</Text>
      <View style={styles.estDelivery}>
        <Text style={styles.estDeliveryText}>DỰ KIẾN GIAO: 22:24</Text>
      </View>
    </View>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillRow}>
      <TouchableOpacity style={[styles.pill, styles.pillActive]}>
        <Text style={[styles.pillText, styles.pillTextActive]}>Hôm nay</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.pill}>
        <Text style={styles.pillText}>Ngày mai</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.pill}>
        <Text style={styles.pillText}>Ngày kia</Text>
      </TouchableOpacity>
    </ScrollView>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillRow}>
      <TouchableOpacity style={[styles.pillOutline, styles.pillOutlineActive]}>
        <Text style={[styles.pillText, styles.pillTextActiveOutline]}>Giao ngay</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.pillOutline}>
        <Text style={styles.pillText}>09:00</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.pillOutline}>
        <Text style={styles.pillText}>11:00</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.pillOutline}>
        <Text style={styles.pillText}>13:00</Text>
      </TouchableOpacity>
    </ScrollView>
  </View>
);

export const OrderItemsSection = ({ cartItems }: { cartItems: CartItem[] }) => (
  <View style={styles.section}>
    <View style={styles.sectionHeader}>
      <Store size={20} color={Colors.primary} />
      <Text style={styles.sectionTitle}>Tiệm Bánh Candy ✨</Text>
    </View>
    {cartItems.map((item) => (
      <View key={item.id} style={styles.cartItemRow}>
        <Image 
          source={{ uri: item.product?.image ?? undefined }} 
          style={styles.itemImage} 
          transition={200}
          contentFit="cover"
        />
        <View style={styles.itemInfo}>
          <Text style={styles.cartItemName} numberOfLines={1}>
            {item.product?.name ?? 'Bánh custom'}
          </Text>
          <Text style={styles.cartItemQty}>x{item.quantity}</Text>
        </View>
        <Text style={styles.cartItemPrice}>
          {Number((item.price ?? item.product?.price ?? 0)).toLocaleString('vi-VN')}đ
        </Text>
      </View>
    ))}
  </View>
);

export const VoucherSection = () => (
  <View style={styles.section}>
    <View style={styles.voucherRow}>
      <Ticket size={20} color={Colors.mutedForeground} />
      <Text style={styles.sectionTitle}>Voucher</Text>
      <TextInput style={styles.voucherInput} placeholder="Nhập mã giảm giá..." />
      <TouchableOpacity>
        <Text style={styles.applyText}>Áp dụng</Text>
      </TouchableOpacity>
    </View>
  </View>
);

export const PaymentMethodSection = () => (
  <View style={styles.section}>
    <View style={styles.paymentHeaderRow}>
      <CreditCard size={20} color={Colors.mutedForeground} />
      <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>
      <TouchableOpacity style={{ marginLeft: 'auto' }}>
        <Text style={styles.changeText}>Tiền mặt &gt;</Text>
      </TouchableOpacity>
    </View>
  </View>
);

export const SummarySection = ({ totalAmount }: { totalAmount: number }) => (
  <View style={styles.summarySection}>
    <View style={styles.summaryRow}>
      <Text style={styles.summaryLabel}>Tạm tính</Text>
      <Text style={styles.summaryValue}>{totalAmount.toLocaleString('vi-VN')}đ</Text>
    </View>
    <View style={styles.summaryRow}>
      <Text style={styles.summaryLabel}>Phí vận chuyển</Text>
      <Text style={styles.summaryFree}>Miễn phí</Text>
    </View>
    <View style={[styles.summaryRow, styles.summaryTotal]}>
      <Text style={styles.summaryTotalLabel}>Tổng cộng</Text>
      <Text style={styles.summaryTotalValue}>{totalAmount.toLocaleString('vi-VN')}đ</Text>
    </View>
  </View>
);

export const CheckoutFooter = ({
  totalAmount, isLoading, onPlaceOrder
}: any) => (
  <View style={styles.footer}>
    <View style={styles.footerInfo}>
      <Text style={styles.footerTotalLabel}>TỔNG THANH TOÁN</Text>
      <Text style={styles.footerTotalValue}>{(totalAmount + 15000).toLocaleString('vi-VN')}đ</Text>
    </View>
    <TouchableOpacity
      style={[styles.orderBtn, isLoading && { opacity: 0.7 }]}
      onPress={onPlaceOrder}
      disabled={isLoading}
    >
      {isLoading ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text style={styles.orderBtnText}>Đặt hàng ngay</Text>
      )}
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  section: {
    backgroundColor: Colors.white,
    borderBottomWidth: 1, borderBottomColor: Colors.borderLight,
    padding: 16,
  },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: Colors.foreground },
  changeText: { fontSize: 13, color: Colors.primaryDark },
  addressName: { fontSize: 14, fontWeight: '600', color: Colors.foreground, marginLeft: 28, marginBottom: 4 },
  input: {
    backgroundColor: Colors.inputBackground, borderRadius: Radius.sm, padding: 12,
    fontSize: 14, color: Colors.foreground, marginLeft: 28,
  },
  inputMultiline: { height: 60, textAlignVertical: 'top' },
  inputError: { borderColor: Colors.danger, borderWidth: 1 },
  errorText: { color: Colors.danger, fontSize: 12, marginTop: 4, marginLeft: 28 },
  estDelivery: { backgroundColor: Colors.primaryAlpha10, paddingHorizontal: 8, paddingVertical: 4, borderRadius: Radius.sm, marginLeft: 'auto' },
  estDeliveryText: { color: Colors.primaryDark, fontSize: 10, fontWeight: '700' },
  pillRow: { gap: 10, marginBottom: 12, paddingLeft: 28 },
  pill: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: Radius.xl, backgroundColor: Colors.inputBackground },
  pillActive: { backgroundColor: Colors.primaryDark },
  pillOutline: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: Radius.xl, borderWidth: 1, borderColor: Colors.border },
  pillOutlineActive: { borderColor: Colors.primaryDark, backgroundColor: Colors.primaryAlpha10 },
  pillText: { fontSize: 13, color: Colors.foreground },
  pillTextActive: { color: Colors.white, fontWeight: '600' },
  pillTextActiveOutline: { color: Colors.primaryDark, fontWeight: '600' },
  cartItemRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, marginLeft: 28 },
  itemImage: { width: 50, height: 50, borderRadius: Radius.sm, backgroundColor: Colors.inputBackground, marginRight: 12 },
  itemInfo: { flex: 1 },
  cartItemName: { fontSize: 14, fontWeight: '600', color: Colors.foreground },
  cartItemQty: { fontSize: 13, color: Colors.mutedForeground, marginTop: 4 },
  cartItemPrice: { fontSize: 14, fontWeight: '600', color: Colors.primaryDark },
  voucherRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  voucherInput: { flex: 1, backgroundColor: Colors.inputBackground, borderRadius: Radius.sm, padding: 10, fontSize: 13, marginLeft: 8 },
  applyText: { fontSize: 14, color: Colors.primaryDark, fontWeight: '600', paddingHorizontal: 8 },
  paymentHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  summarySection: {
    backgroundColor: Colors.white, padding: 16, marginBottom: 16,
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  summaryLabel: { fontSize: 14, color: Colors.textSecondary },
  summaryValue: { fontSize: 14, color: Colors.foreground, fontWeight: '500' },
  summaryFree: { fontSize: 14, color: Colors.foreground, fontWeight: '500' },
  summaryTotal: { borderTopWidth: 1, borderTopColor: Colors.borderLight, paddingTop: 16, marginBottom: 0 },
  summaryTotalLabel: { fontSize: 16, fontWeight: '700', color: Colors.foreground },
  summaryTotalValue: { fontSize: 18, fontWeight: '800', color: Colors.primaryDark },
  footer: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 14, backgroundColor: Colors.white,
    borderTopWidth: 1, borderTopColor: Colors.borderLight, ...Shadows.sm,
  },
  footerInfo: {},
  footerTotalLabel: { fontSize: 11, color: Colors.mutedForeground, textTransform: 'uppercase' },
  footerTotalValue: { fontSize: 20, fontWeight: '800', color: Colors.primaryDark },
  orderBtn: {
    backgroundColor: Colors.primaryDark, paddingHorizontal: 32, paddingVertical: 14,
    borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center', minWidth: 150,
  },
  orderBtnText: { color: 'white', fontSize: 16, fontWeight: '700' },
});
