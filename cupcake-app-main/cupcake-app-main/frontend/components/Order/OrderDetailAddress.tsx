import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MapPin } from 'lucide-react-native';
import { Colors, Radius, Shadows } from '@/constants/theme';
import { OrderDetail } from '../../types';

interface OrderDetailAddressProps {
  order: OrderDetail;
}

export const OrderDetailAddress: React.FC<OrderDetailAddressProps> = ({ order }) => {
  return (
    <View style={[styles.section, styles.overlappingCard]}>
      <View style={styles.sectionHeader}>
        <MapPin size={20} color={Colors.primaryDark} />
        <Text style={styles.sectionTitle}>Địa chỉ giao hàng</Text>
      </View>
      <Text style={styles.addressName}>{order.phone}</Text>
      <Text style={styles.addressText}>{order.address}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  overlappingCard: { marginTop: -40 },
  section: {
    backgroundColor: Colors.white, marginHorizontal: 16, marginBottom: 12,
    borderRadius: Radius.xl, padding: 16, ...Shadows.sm,
  },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: Colors.foreground },
  addressName: { fontSize: 14, fontWeight: '600', color: Colors.foreground, marginLeft: 28 },
  addressText: { fontSize: 14, color: Colors.mutedForeground, marginLeft: 28, marginTop: 4 },
});
