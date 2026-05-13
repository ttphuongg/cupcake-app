import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ticket } from 'lucide-react-native';
import { Colors, Radius } from '@/constants/theme';

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
