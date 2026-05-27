import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CreditCard, Wallet, Landmark, Banknote, ChevronDown, ChevronRight } from 'lucide-react-native';
import { Colors, Radius } from '@/constants/theme';

// Danh sách các phương thức thanh toán xịn sò
const PAYMENT_METHODS = [
  { id: 'cash', label: 'Thanh toán tiền mặt', icon: Banknote },
  { id: 'momo', label: 'Ví MoMo', icon: Wallet },
  { id: 'zalo', label: 'Ví ZaloPay', icon: Wallet },
  { id: 'banking', label: 'Thẻ ATM / Internet Banking', icon: Landmark },
];

export const PaymentMethodSection = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(PAYMENT_METHODS[0]);

  return (
    <View style={styles.section}>
      {/* Nút bấm để mở rộng/thu gọn */}
      <TouchableOpacity 
        style={styles.paymentHeaderRow} 
        activeOpacity={0.7}
        onPress={() => setIsExpanded(!isExpanded)}
      >
        <CreditCard size={20} color={Colors.mutedForeground} />
        <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>
        <View style={{ marginLeft: 'auto', flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Text style={styles.changeText}>{selectedMethod.label}</Text>
          {isExpanded ? (
            <ChevronDown size={16} color={Colors.primaryDark} />
          ) : (
            <ChevronRight size={16} color={Colors.primaryDark} />
          )}
        </View>
      </TouchableOpacity>

      {/* Danh sách xổ xuống khi bấm vào */}
      {isExpanded && (
        <View style={styles.methodsContainer}>
          {PAYMENT_METHODS.map((method) => {
            const Icon = method.icon;
            const isSelected = selectedMethod.id === method.id;

            return (
              <TouchableOpacity 
                key={method.id} 
                style={[styles.methodRow, isSelected && styles.methodRowActive]}
                onPress={() => {
                  setSelectedMethod(method);
                  setIsExpanded(false); // Chọn xong tự động đóng lại cho gọn
                }}
              >
                <Icon size={20} color={isSelected ? Colors.primaryDark : Colors.mutedForeground} />
                <Text style={[styles.methodLabel, isSelected && styles.methodLabelActive]}>
                  {method.label}
                </Text>
                
                {/* Nút Radio (Hình tròn tích chọn) */}
                <View style={[styles.radioOuter, isSelected && styles.radioOuterActive]}>
                  {isSelected && <View style={styles.radioInner} />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
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
  changeText: { fontSize: 13, color: Colors.primaryDark },
  paymentHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  
  // Styles mới cho phần danh sách thanh toán
  methodsContainer: { marginTop: 16, gap: 10 },
  methodRow: { 
    flexDirection: 'row', alignItems: 'center', gap: 12, 
    paddingVertical: 12, paddingHorizontal: 16, 
    borderRadius: Radius.md, 
    backgroundColor: Colors.inputBackground,
    borderWidth: 1, borderColor: 'transparent'
  },
  methodRowActive: { 
    backgroundColor: Colors.primaryAlpha10, 
    borderColor: Colors.primaryDark 
  },
  methodLabel: { fontSize: 14, color: Colors.foreground, flex: 1 },
  methodLabelActive: { fontWeight: '700', color: Colors.primaryDark },
  
  // Vòng tròn nút Radio
  radioOuter: { 
    width: 20, height: 20, borderRadius: 10, 
    borderWidth: 2, borderColor: Colors.mutedForeground, 
    justifyContent: 'center', alignItems: 'center' 
  },
  radioOuterActive: { borderColor: Colors.primaryDark },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.primaryDark },
});

// ─── SummarySection ───────────────────────────────────────────────────────────
import { formatCurrency } from '../../utils/formatters';

export const SummarySection = ({ totalAmount }: { totalAmount: number }) => (
  <View style={summaryStyles.summarySection}>
    <View style={summaryStyles.summaryRow}>
      <Text style={summaryStyles.summaryLabel}>Tạm tính</Text>
      <Text style={summaryStyles.summaryValue}>{formatCurrency(totalAmount)}</Text>
    </View>
    <View style={summaryStyles.summaryRow}>
      <Text style={summaryStyles.summaryLabel}>Phí vận chuyển</Text>
      <Text style={summaryStyles.summaryFree}>Miễn phí</Text>
    </View>
    <View style={[summaryStyles.summaryRow, summaryStyles.summaryTotal]}>
      <Text style={summaryStyles.summaryTotalLabel}>Tổng cộng</Text>
      <Text style={summaryStyles.summaryTotalValue}>{formatCurrency(totalAmount)}</Text>
    </View>
  </View>
);

const summaryStyles = StyleSheet.create({
  summarySection: { backgroundColor: Colors.white, padding: 16, marginBottom: 16 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  summaryLabel: { fontSize: 14, color: Colors.textSecondary },
  summaryValue: { fontSize: 14, color: Colors.foreground, fontWeight: '500' },
  summaryFree: { fontSize: 14, color: Colors.foreground, fontWeight: '500' },
  summaryTotal: { borderTopWidth: 1, borderTopColor: Colors.borderLight, paddingTop: 16, marginBottom: 0 },
  summaryTotalLabel: { fontSize: 16, fontWeight: '700', color: Colors.foreground },
  summaryTotalValue: { fontSize: 18, fontWeight: '800', color: Colors.primaryDark },
});