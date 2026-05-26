import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Clock } from 'lucide-react-native';
import { Colors, Radius } from '@/constants/theme';

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

const styles = StyleSheet.create({
  section: {
    backgroundColor: Colors.white,
    borderBottomWidth: 1, borderBottomColor: Colors.borderLight,
    padding: 16,
  },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: Colors.foreground },
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
});
