import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Clock } from 'lucide-react-native';
import { Colors, Radius } from '@/constants/theme';

export const DeliveryTimeSection = () => {
  // 1. Khai báo state để lưu trữ lựa chọn hiện tại
  const [selectedDay, setSelectedDay] = useState('Hôm nay');
  const [selectedTime, setSelectedTime] = useState('Giao ngay');

  // Danh sách các lựa chọn
  const days = ['Hôm nay', 'Ngày mai', 'Ngày kia'];
  const times = ['Giao ngay', '09:00', '11:00', '13:00'];

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Clock size={20} color={Colors.mutedForeground} />
        <Text style={styles.sectionTitle}>Thời gian nhận hàng</Text>
        <View style={styles.estDelivery}>
          <Text style={styles.estDeliveryText}>DỰ KIẾN GIAO: {selectedDay} - {selectedTime}</Text>
        </View>
      </View>

      {/* Dòng chọn Ngày */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillRow}>
        {days.map((day) => (
          <TouchableOpacity
            key={day}
            // Nếu day đang được chọn -> thêm style pillActive
            style={[styles.pill, selectedDay === day && styles.pillActive]}
            onPress={() => setSelectedDay(day)}
          >
            <Text style={[styles.pillText, selectedDay === day && styles.pillTextActive]}>
              {day}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Dòng chọn Giờ */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillRow}>
        {times.map((time) => (
          <TouchableOpacity
            key={time}
            // Nếu time đang được chọn -> thêm style pillOutlineActive
            style={[styles.pillOutline, selectedTime === time && styles.pillOutlineActive]}
            onPress={() => setSelectedTime(time)}
          >
            <Text style={[styles.pillText, selectedTime === time && styles.pillTextActiveOutline]}>
              {time}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

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