import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { MapPin } from 'lucide-react-native';
import { Colors, Radius } from '@/constants/theme';

interface AddressSectionProps {
  phone: string;
  setPhone: (v: string) => void;
  address: string;
  setAddress: (v: string) => void;
  user: any;
  errors: any;
  errorMessages: any;
}

export const AddressSection = ({
  phone, setPhone, address, setAddress, user, errors, errorMessages,
}: AddressSectionProps) => (
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
});
