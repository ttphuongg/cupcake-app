import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const COLORS = {
  bg: '#FDF4F5',
  pink: '#E8A0BF',
  purple: '#BA90C6',
  blue: '#C0DBEA',
  white: '#FFFFFF',
  textGray: '#7f8c8d',
  textBlack: '#2d3436'
};

export default function CheckoutScreen() {
  const [address, setAddress] = useState('A | 090xxxxxxx');
  const [selectedDate, setSelectedDate] = useState('Hôm nay');
  const [selectedTime, setSelectedTime] = useState('Giao ngay');
  
  // STATE THANH TOÁN
  const [selectedPayment, setSelectedPayment] = useState('Tiền mặt');
  const [selectedBank, setSelectedBank] = useState('Vietcombank'); // Ngân hàng mặc định cho QR
  const [visaNumber, setVisaNumber] = useState(''); // Số thẻ Visa

  const dates = ['Hôm nay', 'Ngày mai', 'Ngày kia'];
  const times = ['Giao ngay', '09:00', '11:00', '13:00', '15:00', '17:00'];
  const banks = ['Vietcombank', 'MB Bank', 'Techcombank', 'Momo'];

  const handleOrder = () => {
    let paymentDetail = selectedPayment;
    if (selectedPayment === 'QR code') paymentDetail = `QR code (${selectedBank})`;
    if (selectedPayment === 'Visa card') paymentDetail = `Visa (${visaNumber || 'Chưa nhập số thẻ'})`;

    Alert.alert(
      "Xác nhận đơn hàng",
      `Thời gian: ${selectedTime} ${selectedDate}\nThanh toán: ${paymentDetail}\nTổng tiền: 65,000đ`,
      [{ text: "Hoàn tất" }]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity><Ionicons name="arrow-back" size={24} color="black" /></TouchableOpacity>
        <Text style={styles.headerTitle}>Thanh toán</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* SECTION: ĐỊA CHỈ */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="location-outline" size={20} color={COLORS.pink} />
            <Text style={styles.sectionTitle}>Địa chỉ giao hàng</Text>
          </View>
          <Text style={styles.addressName}>{address}</Text>
          <TextInput placeholder="Nhập địa chỉ chi tiết..." style={styles.inputField} multiline />
        </View>

        {/* SECTION: THỜI GIAN */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="time-outline" size={20} color={COLORS.pink} />
            <Text style={styles.sectionTitle}>Thời gian nhận hàng</Text>
          </View>
          <View style={styles.tabRow}>
            {dates.map((date) => (
              <TouchableOpacity key={date} style={[styles.tab, selectedDate === date && styles.tabActive]} onPress={() => setSelectedDate(date)}>
                <Text style={selectedDate === date ? styles.tabTextActive : styles.tabText}>{date}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {times.map((time) => (
              <TouchableOpacity key={time} style={[styles.timeBtn, selectedTime === time && styles.timeBtnActive]} onPress={() => setSelectedTime(time)}>
                <Text style={selectedTime === time ? styles.timeBtnTextActive : styles.timeBtnText}>{time}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* SECTION: PHƯƠNG THỨC THANH TOÁN */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="wallet-outline" size={20} color={COLORS.pink} />
            <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>
          </View>
          
          <View style={styles.paymentRow}>
            {['Tiền mặt', 'QR code', 'Visa card'].map((id) => (
              <TouchableOpacity 
                key={id} 
                style={[styles.paymentBtn, selectedPayment === id && styles.paymentBtnActive]}
                onPress={() => setSelectedPayment(id)}
              >
                <Text style={[styles.paymentBtnText, selectedPayment === id && styles.paymentBtnTextActive]}>{id}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* HIỂN THỊ TÙY CHỌN NGÂN HÀNG KHI CHỌN QR CODE */}
          {selectedPayment === 'QR code' && (
            <View style={styles.subSection}>
              <Text style={styles.subTitle}>Chọn ngân hàng quét mã:</Text>
              <View style={styles.bankGrid}>
                {banks.map((bank) => (
                  <TouchableOpacity 
                    key={bank} 
                    style={[styles.bankItem, selectedBank === bank && styles.bankItemActive]}
                    onPress={() => setSelectedBank(bank)}
                  >
                    <Text style={selectedBank === bank ? styles.bankTextActive : styles.bankText}>{bank}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* HIỂN THỊ Ô NHẬP THẺ KHI CHỌN VISA CARD */}
          {selectedPayment === 'Visa card' && (
            <View style={styles.subSection}>
              <Text style={styles.subTitle}>Thông tin thẻ Visa:</Text>
              <TextInput 
                placeholder="0000 0000 0000 0000" 
                style={styles.inputField}
                keyboardType="numeric"
                value={visaNumber}
                onChangeText={setVisaNumber}
                maxLength={16}
              />
              <View style={{flexDirection: 'row', gap: 10, marginTop: 10}}>
                <TextInput placeholder="MM/YY" style={[styles.inputField, {flex: 1}]} keyboardType="numeric" />
                <TextInput placeholder="CVC" style={[styles.inputField, {flex: 1}]} keyboardType="numeric" secureTextEntry />
              </View>
            </View>
          )}
        </View>

        {/* TỔNG CỘNG */}
        <View style={styles.priceContainer}>
          <View style={styles.priceRow}><Text style={styles.priceLabel}>Tổng cộng (1 món)</Text><Text style={styles.priceValue}>50,000đ</Text></View>
          <View style={styles.priceRow}><Text style={styles.priceLabel}>Phí giao hàng</Text><Text style={styles.priceValue}>15,000đ</Text></View>
          <View style={[styles.priceRow, {marginTop: 10}]}>
            <Text style={styles.totalLabel}>Tổng thanh toán</Text>
            <Text style={styles.totalValue}>65,000đ</Text>
          </View>
        </View>
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* FOOTER */}
      <View style={styles.footer}>
        <View>
          <Text style={styles.footerTotalLabel}>TỔNG THANH TOÁN</Text>
          <Text style={styles.footerTotalPrice}>65,000đ</Text>
        </View>
        <TouchableOpacity style={styles.orderBtn} onPress={handleOrder}>
          <Text style={styles.orderBtnText}>Đặt hàng</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.bg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, backgroundColor: COLORS.white },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  container: { flex: 1, padding: 10 },
  section: { backgroundColor: COLORS.white, borderRadius: 12, padding: 15, marginBottom: 10, elevation: 2 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { flex: 1, marginLeft: 8, fontWeight: 'bold', fontSize: 14 },
  addressName: { fontWeight: 'bold', marginBottom: 5 },
  inputField: { backgroundColor: '#f9f9f9', borderRadius: 8, padding: 12, fontSize: 13, borderWidth: 1, borderColor: '#eee' },
  tabRow: { flexDirection: 'row', marginBottom: 12 },
  tab: { paddingHorizontal: 15, paddingVertical: 6, borderRadius: 20, backgroundColor: '#f1f1f1', marginRight: 10 },
  tabActive: { backgroundColor: COLORS.pink },
  tabText: { fontSize: 12, color: COLORS.textGray },
  tabTextActive: { fontSize: 12, color: COLORS.white, fontWeight: 'bold' },
  timeBtn: { paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#eee', marginRight: 10 },
  timeBtnActive: { borderColor: COLORS.pink, backgroundColor: '#FFF0F5' },
  timeBtnText: { fontSize: 12, color: COLORS.textGray },
  timeBtnTextActive: { fontSize: 12, color: COLORS.pink, fontWeight: 'bold' },
  
  paymentRow: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  paymentBtn: { flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: 8, borderWidth: 1, borderColor: '#eee' },
  paymentBtnActive: { backgroundColor: COLORS.pink, borderColor: COLORS.pink },
  paymentBtnText: { fontSize: 12, color: COLORS.textGray },
  paymentBtnTextActive: { color: COLORS.white, fontWeight: 'bold' },

  subSection: { marginTop: 10, padding: 12, backgroundColor: '#fcfcfc', borderRadius: 8, borderLeftWidth: 4, borderLeftColor: COLORS.pink },
  subTitle: { fontSize: 12, fontWeight: 'bold', marginBottom: 10, color: COLORS.textGray },
  bankGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  bankItem: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, borderWidth: 1, borderColor: '#ddd' },
  bankItemActive: { borderColor: COLORS.pink, backgroundColor: '#FFF0F5' },
  bankText: { fontSize: 11, color: COLORS.textGray },
  bankTextActive: { color: COLORS.pink, fontWeight: 'bold' },

  priceContainer: { padding: 10 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  priceLabel: { color: COLORS.textGray, fontSize: 13 },
  priceValue: { fontSize: 13 },
  totalLabel: { fontWeight: 'bold', fontSize: 15 },
  totalValue: { fontWeight: 'bold', fontSize: 15, color: COLORS.pink },
  footer: { position: 'absolute', bottom: 0, width: '100%', backgroundColor: COLORS.white, padding: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#eee' },
  footerTotalLabel: { fontSize: 10, color: COLORS.textGray },
  footerTotalPrice: { fontSize: 18, fontWeight: 'bold', color: COLORS.pink },
  orderBtn: { backgroundColor: COLORS.pink, paddingHorizontal: 35, paddingVertical: 12, borderRadius: 25 },
  orderBtnText: { color: COLORS.white, fontWeight: 'bold', fontSize: 16 }
});