/**
 * components/CartItemCard.tsx
 * Card hiển thị một mục trong giỏ hàng.
 *  - Sản phẩm thường: hiển thị ảnh + tên + giá
 *  - Bánh custom: parse custom_data JSON, hiển thị danh sách nguyên liệu đã chọn
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
} from 'react-native';
import { Trash2, Plus, Minus, ChevronDown, ChevronUp, ShoppingBag } from 'lucide-react-native';
import { CartItem } from '../types';
import { Colors } from '../constants/theme';

const PRIMARY = Colors.primary;

// ─── Types ────────────────────────────────────────────────────────────────────

interface CustomCakeData {
  size?: { name?: string };
  base?: { name?: string };
  filling?: { name?: string };
  frosting?: { name?: string };
  sugar?: { name?: string };
  toppings?: { name?: string }[];
  unitPrice?: number;
  totalPrice?: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const parseCustomData = (raw: string | null | undefined): CustomCakeData | null => {
  if (!raw) return null;
  try {
    return typeof raw === 'string' ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const getItemName = (item: CartItem, custom: CustomCakeData | null): string => {
  if (item.product?.name) return item.product.name;
  if (custom) return 'Bánh tự thiết kế 🎂';
  if (item.product_id) return `Sản phẩm #${item.product_id}`;
  return 'Sản phẩm';
};

const getUnitPrice = (item: CartItem, custom: CustomCakeData | null): number => {
  if (item.price) return item.price;
  if (item.product?.price) return item.product.price;
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
  ].filter((r) => r.value !== '—'); // Ẩn các field chưa chọn

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
  container: {
    backgroundColor: Colors.inputBackground,
    borderRadius: 10,
    padding: 10,
    marginTop: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
  },
  label: { fontSize: 12, color: Colors.mutedForeground },
  value: { fontSize: 12, fontWeight: '600', color: Colors.foreground, flex: 1, textAlign: 'right' },
});

// ─── Main Component ───────────────────────────────────────────────────────────

interface CartItemCardProps {
  item: CartItem;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
}

export const CartItemCard = ({
  item,
  onIncrease,
  onDecrease,
  onRemove,
}: CartItemCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const customData = parseCustomData(item.custom_data);
  const isCustomCake = !!customData;

  const name = getItemName(item, customData);
  const unitPrice = getUnitPrice(item, customData);
  const imageUri = item.product?.image ?? null;

  return (
    <View style={styles.container}>
      {/* ROW CHÍNH */}
      <View style={styles.mainRow}>
        {/* ẢNH */}
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} />
        ) : (
          <View style={[styles.image, styles.imagePlaceholder]}>
            <ShoppingBag size={22} color={Colors.primary} />
          </View>
        )}

        {/* THÔNG TIN */}
        <View style={styles.info}>
          <View style={styles.nameRow}>
            <Text style={styles.name} numberOfLines={2}>{name}</Text>
            <TouchableOpacity onPress={onRemove} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Trash2 size={16} color="#D1D1D1" />
            </TouchableOpacity>
          </View>

          {/* Tag "Tùy chỉnh" cho bánh custom */}
          {isCustomCake && (
            <TouchableOpacity
              style={styles.customTag}
              onPress={() => setExpanded((v) => !v)}
              activeOpacity={0.7}
            >
              <Text style={styles.customTagText}>Xem nguyên liệu</Text>
              {expanded
                ? <ChevronUp size={12} color={PRIMARY} />
                : <ChevronDown size={12} color={PRIMARY} />}
            </TouchableOpacity>
          )}

          {/* GIÁ + SỐ LƯỢNG */}
          <View style={styles.priceRow}>
            <Text style={styles.price}>{unitPrice.toLocaleString()}đ</Text>
            <View style={styles.qtyRow}>
              <TouchableOpacity style={styles.qtyBtn} onPress={onDecrease}>
                <Minus size={13} color={PRIMARY} />
              </TouchableOpacity>
              <Text style={styles.qty}>{item.quantity}</Text>
              <TouchableOpacity style={styles.qtyBtn} onPress={onIncrease}>
                <Plus size={13} color={PRIMARY} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {/* EXPANDABLE: Danh sách nguyên liệu bánh custom */}
      {isCustomCake && expanded && customData && (
        <CustomCakeDetail data={customData} />
      )}
    </View>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 12,
    marginVertical: 4,
    borderRadius: 0,
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: Colors.inputBackground,
  },
  imagePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  name: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1A1A1A',
    flex: 1,
    lineHeight: 20,
  },
  customTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    marginTop: 6,
    backgroundColor: PRIMARY + '15',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: PRIMARY + '30',
  },
  customTagText: {
    fontSize: 11,
    color: PRIMARY,
    fontWeight: '600',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: PRIMARY,
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: '#E8E8E8',
    borderRadius: 6,
  },
  qtyBtn: {
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  qty: {
    paddingHorizontal: 10,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.foreground,
    minWidth: 24,
    textAlign: 'center',
  },
});
