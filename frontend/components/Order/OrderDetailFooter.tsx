import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { RotateCcw } from 'lucide-react-native';
import { Colors, Radius } from '@/constants/theme';

interface OrderDetailFooterProps {
  status: string;
  onCancel: () => void;
  onReorder: () => void;
  onReview?: () => void;
}

export const OrderDetailFooter: React.FC<OrderDetailFooterProps> = ({ status, onCancel, onReorder, onReview }) => {
  return (
    <View style={styles.bottomBar}>
      {status === 'PENDING' && (
        <TouchableOpacity
          style={[styles.btnAction, styles.btnCancel]}
          onPress={onCancel}
        >
          <Text style={styles.btnCancelText}>Hủy đơn</Text>
        </TouchableOpacity>
      )}
      {(status === 'COMPLETED' || status === 'completed') && onReview && (
        <TouchableOpacity
          style={[styles.btnAction, styles.btnReview]}
          onPress={onReview}
        >
          <Text style={styles.btnReviewText}>Đánh giá</Text>
        </TouchableOpacity>
      )}
      {status !== 'PENDING' && (
        <TouchableOpacity
          style={[styles.btnAction, styles.btnReorder]}
          onPress={onReorder}
        >
          <RotateCcw size={18} color={Colors.white} style={{ marginRight: 6 }} />
          <Text style={styles.btnText}>Đặt lại</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  bottomBar: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 16, paddingVertical: 14, backgroundColor: Colors.background,
    borderTopWidth: 1, borderTopColor: Colors.borderLight,
  },
  btnAction: { flex: 1, flexDirection: 'row', paddingVertical: 14, borderRadius: Radius.md, justifyContent: 'center', alignItems: 'center' },
  btnCancel: { backgroundColor: Colors.danger },
  btnReorder: { backgroundColor: Colors.primaryDark },
  btnReview: { backgroundColor: Colors.primary },
  btnCancelText: { color: Colors.white, fontWeight: '700', fontSize: 15 },
  btnText: { color: Colors.white, fontWeight: '700', fontSize: 15 },
  btnReviewText: { color: Colors.white, fontWeight: '700', fontSize: 15 },
});
