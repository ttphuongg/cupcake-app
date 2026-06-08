import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Trash2, Plus, Minus, ChevronDown, ChevronUp, ShoppingBag } from 'lucide-react-native';
import { formatCurrency } from '../../utils/formatters';
import { Colors } from '@/constants/theme';

const PRIMARY = Colors.primary;

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CustomCakeData {
  size?: { name?: string };
  base?: { name?: string };
  filling?: { name?: string };
  frosting?: { name?: string };
  sugar?: { name?: string };
  toppings?: { name?: string }[];
  unitPrice?: number;
  totalPrice?: number;
}

export type ProductListItemMode = 'cart' | 'checkout' | 'readonly';

export interface ProductListItemProps {
  // Bọc chung các thuộc tính cần thiết từ CartItem / OrderItem
  item: {
    id?: number;
    product_id?: number | null;
    quantity: number;
    price?: number;
    custom_data?: any;
    product?: { name: string; image?: string | null; price: number }; // Từ CartItem
    product_name?: string; // Từ OrderItem
    product_image?: string | null; // Từ OrderItem đã join
  };
  mode?: ProductListItemMode;
  onIncrease?: () => void;
  onDecrease?: () => void;
  onRemove?: () => void;
  showCustomDetails?: boolean; // Nếu true, cho phép xem thành phần custom
  showReviewButton?: boolean;
  onReview?: () => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

// ─── Helpers ──────────────────────────────────────────────────────────────────

const parseCustomData = (raw: string | null | undefined | object): CustomCakeData | null => {
  if (!raw) return null;
  if (typeof raw === 'object') return raw as CustomCakeData;
  try {
    return typeof raw === 'string' ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const getItemName = (item: ProductListItemProps['item'], custom: CustomCakeData | null): string => {
  if (item.product?.name) return item.product.name;
  
  // Xử lý an toàn: Nếu backend vô tình trả về Object vào biến product_name
  if (item.product_name) {
    if (typeof item.product_name === 'string') return item.product_name;
    if (typeof item.product_name === 'object' && (item.product_name as any).name) {
      return (item.product_name as any).name;
    }
  }

  if (custom) return 'Bánh tự thiết kế 🎂';
  if (item.product_id) return `Sản phẩm #${item.product_id}`;
  return 'Sản phẩm';
};

const getUnitPrice = (item: ProductListItemProps['item'], custom: CustomCakeData | null): number => {
  const parsedPrice = item.price !== undefined && item.price !== null ? Number(item.price) : NaN;
  if (!isNaN(parsedPrice) && parsedPrice > 0) return parsedPrice;
  if (item.product?.price) return item.product.price;
  
  // Xử lý an toàn lấy giá tiền nếu bị kẹt trong object
  if (item.product_name && typeof item.product_name === 'object' && (item.product_name as any).price) {
    return Number((item.product_name as any).price) || 0;
  }

  if (custom?.unitPrice) return custom.unitPrice;
  if (custom?.totalPrice) return custom.totalPrice;
  return 0;
};

// ─── Sub-component: Custom Cake Detail ────────────────────────────────────────

const CustomCakeDetail = ({ data }: { data: CustomCakeData }) => {
  const rows: { label: string; value: string }[] = [
    { label: 'Kích cỡ',  value: data.size?.name ?? '—' },
    { label: 'Cốt bánh', value: data.base?.name ?? '—' },
    { label: 'Nhân',     value: data.filling?.name ?? 'Không có' },
    { label: 'Kem phủ',  value: data.frosting?.name ?? '—' },
    {
      label: 'Topping',
      value: data.toppings?.length
        ? data.toppings.map((t) => t.name ?? '').filter(Boolean).join(', ')
        : 'Không có',
    },
    { label: 'Đường',    value: data.sugar?.name ?? '100%' },
  ].filter((r) => r.value !== '—');

  return (
    <View style={detailStyles.container}>
      {rows.map((row) => (
        <View key={row.label} style={detailStyles.row}>
          <Text style={detailStyles.label}>{row.label}:</Text>
          <Text style={detailStyles.value}>{row.value}</Text>
        </View>
      ))}
    </View>
  );
};

const detailStyles = StyleSheet.create({
  container: { backgroundColor: Colors.inputBackground, borderRadius: 10, padding: 10, marginTop: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3 },
  label: { fontSize: 12, color: Colors.mutedForeground },
  value: { fontSize: 12, fontWeight: '600', color: Colors.foreground, flex: 1, textAlign: 'right' },
});

// ─── Main Component ───────────────────────────────────────────────────────────

export const ProductListItem = ({
  item,
  mode = 'readonly',
  onIncrease,
  onDecrease,
  onRemove,
  showCustomDetails = true,
  showReviewButton = false,
  onReview,
}: ProductListItemProps) => {
  const [expanded, setExpanded] = useState(false);
  const customData = parseCustomData(item.custom_data);
  const isCustomCake = !!customData;

  const name = getItemName(item, customData);
  const unitPrice = getUnitPrice(item, customData);
  const imageUri = item.product?.image ?? item.product_image ?? null;

  const isCart = mode === 'cart';

  return (
    <View style={styles.container}>
      <View style={styles.mainRow}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} transition={200} contentFit="cover" />
        ) : (
          <View style={[styles.image, styles.imagePlaceholder]}>
            <ShoppingBag size={22} color={Colors.primary} />
          </View>
        )}

        <View style={styles.info}>
          <View style={styles.nameRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.name} numberOfLines={2}>{name}</Text>
              {showReviewButton && onReview && (
                <TouchableOpacity onPress={onReview} style={styles.reviewBtn}>
                  <Text style={styles.reviewBtnText}>Đánh giá</Text>
                </TouchableOpacity>
              )}
            </View>
            {isCart && onRemove && (
              <TouchableOpacity onPress={onRemove} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Trash2 size={16} color="#D1D1D1" />
              </TouchableOpacity>
            )}
          </View>

          {isCustomCake && showCustomDetails && (
            <TouchableOpacity style={styles.customTag} onPress={() => setExpanded((v) => !v)} activeOpacity={0.7}>
              <Text style={styles.customTagText}>Xem nguyên liệu</Text>
              {expanded ? <ChevronUp size={12} color={PRIMARY} /> : <ChevronDown size={12} color={PRIMARY} />}
            </TouchableOpacity>
          )}

          <View style={styles.priceRow}>
            {isCart ? (
              <>
                <Text style={styles.price}>{formatCurrency(unitPrice)}</Text>
                <View style={styles.qtyRow}>
                  <TouchableOpacity style={styles.qtyBtn} onPress={onDecrease}>
                    <Minus size={13} color={PRIMARY} />
                  </TouchableOpacity>
                  <Text style={styles.qty}>{item.quantity}</Text>
                  <TouchableOpacity style={styles.qtyBtn} onPress={onIncrease}>
                    <Plus size={13} color={PRIMARY} />
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <>
                <Text style={styles.qtyText}>x{item.quantity}</Text>
                <Text style={styles.price}>{formatCurrency(unitPrice * (mode === 'readonly' && !item.price ? item.quantity : 1))}</Text>
              </>
            )}
          </View>
        </View>
      </View>

      {isCustomCake && expanded && showCustomDetails && customData && (
        <CustomCakeDetail data={customData} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { paddingVertical: 8 },
  mainRow: { flexDirection: 'row', alignItems: 'flex-start' },
  image: { width: 60, height: 60, borderRadius: 10, backgroundColor: Colors.inputBackground },
  imagePlaceholder: { alignItems: 'center', justifyContent: 'center' },
  info: { flex: 1, marginLeft: 12, justifyContent: 'center' },
  nameRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 },
  name: { fontSize: 15, fontWeight: '500', color: Colors.foreground, lineHeight: 20 },
  reviewBtn: { marginTop: 4, backgroundColor: PRIMARY, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, alignSelf: 'flex-start' },
  reviewBtnText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
  customTag: { flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-start', marginTop: 6, backgroundColor: PRIMARY + '15', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, borderWidth: 1, borderColor: PRIMARY + '30' },
  customTagText: { fontSize: 11, color: PRIMARY, fontWeight: '600' },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  price: { fontSize: 15, fontWeight: 'bold', color: Colors.primaryDark },
  qtyRow: { flexDirection: 'row', alignItems: 'center', borderWidth: 0.5, borderColor: '#E8E8E8', borderRadius: 6 },
  qtyBtn: { paddingHorizontal: 8, paddingVertical: 6 },
  qty: { paddingHorizontal: 10, fontSize: 14, fontWeight: '600', color: Colors.foreground, minWidth: 24, textAlign: 'center' },
  qtyText: { fontSize: 13, color: Colors.mutedForeground },
});
