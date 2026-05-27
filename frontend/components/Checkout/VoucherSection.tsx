import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ticket } from 'lucide-react-native';
import { Colors, Radius } from '@/constants/theme';

// Thêm Props để truyền tín hiệu giảm giá lên component cha (checkout.tsx)
interface VoucherSectionProps {
  onApplyVoucher: (discountPercent: number) => void;
}

export const VoucherSection = ({ onApplyVoucher }: VoucherSectionProps) => {
  const [voucherCode, setVoucherCode] = useState('');

  const handleApply = () => {
    // Kéo về chữ thường và xóa khoảng trắng thừa để so sánh cho chuẩn
    const code = voucherCode.trim().toLowerCase();
    
    if (code === 'nhom8') {
      Alert.alert('Thành công', 'Đã áp dụng mã giảm giá 15%!');
      onApplyVoucher(15); // Báo lên cha là được giảm 15%
    } else if (code === '') {
      Alert.alert('Thông báo', 'Vui lòng nhập mã giảm giá.');
      onApplyVoucher(0);
    } else {
      Alert.alert('Lỗi', 'Mã giảm giá không hợp lệ hoặc đã hết hạn!');
      onApplyVoucher(0);
    }
  };

  return (
    <View style={styles.section}>
      <View style={styles.voucherRow}>
        <Ticket size={20} color={Colors.mutedForeground} />
        <Text style={styles.sectionTitle}>Voucher</Text>
        <TextInput 
          style={styles.voucherInput} 
          placeholder="Nhập mã giảm giá..." 
          value={voucherCode}
          onChangeText={setVoucherCode}
          autoCapitalize="none" // Tắt tự động viết hoa chữ cái đầu
        />
        <TouchableOpacity onPress={handleApply}>
          <Text style={styles.applyText}>Áp dụng</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    backgroundColor: Colors.white,
    borderBottomWidth: 1, borderBottomColor: Colors.borderLight,
    padding: 16,
  },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: Colors.foreground },
  voucherRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  voucherInput: { flex: 1, backgroundColor: Colors.inputBackground, borderRadius: Radius.sm, padding: 10, fontSize: 13, marginLeft: 8 },
  applyText: { fontSize: 14, color: Colors.primaryDark, fontWeight: '600', paddingHorizontal: 8 },
});