import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Minus, Plus } from "lucide-react-native";
import { useDesignStore } from "../../store/designStore";
import { Colors, Radius, Shadows } from "../../constants/theme";
import { Ingredient } from "../../types";

const getPriceLabel = (price: number, allAreZero: boolean): string | null => {
  if (allAreZero || price === 0) return null;
  return `+${price / 1000}k`;
};

/** Trích xuất phần trăm từ tên nguyên liệu đường, ví dụ: "Ít đường (30%)" → "30%" */
const extractSugarLabel = (name: string): string => {
  const match = name.match(/(\d+%)/);
  return match ? match[1] : name;
};

// ── Sub-component: OptionCard ─────────────────────────────────────────────────

interface OptionCardProps {
  label: string;
  priceLabel: string | null;
  isSelected: boolean;
  onPress: () => void;
  horizontal?: boolean;
}

const OptionCard = ({
  label,
  priceLabel,
  isSelected,
  onPress,
  horizontal,
}: OptionCardProps) => (
  <TouchableOpacity
    style={[styles.optionCard, isSelected && styles.activeOptionCard]}
    onPress={onPress}
    activeOpacity={0.7}
  >
    {/* Nếu horizontal = true thì áp dụng style nằm ngang, ngược lại thì không làm gì */}
    <View style={horizontal ? styles.optionContentHorizontal : null}>
      <Text style={[styles.optionName, isSelected && styles.activeOptionText]}>
        {label}
      </Text>
      {priceLabel != null && (
        <Text
          style={[
            styles.optionPrice,
            isSelected && styles.activeOptionText,
            horizontal && { marginTop: 0 },
          ]}
        >
          {priceLabel}
        </Text>
      )}
    </View>
  </TouchableOpacity>
);

// ── Main Component ────────────────────────────────────────────────────────────

export const ExtraOptionsStep = () => {
  const {
    ingredients,
    selectedSize,
    selectedSugar,
    quantity,
    setQuantity,
    selectIngredient,
  } = useDesignStore();

  const sizes = ingredients
    .filter((i) => i.type === "SIZE" && i.is_active)
    .sort((a, b) => (a.id ?? 0) - (b.id ?? 0)); // S(39) < M(40) < L(41)
  const sugars = ingredients.filter((i) => i.type === "SUGAR" && i.is_active);

  // Nhãn hiển thị theo thứ tự (tối đa 3 size)
  const SIZE_LABELS = ["S", "M", "L"];

  // Kiểm tra xem toàn bộ nhóm có giá = 0 không
  const allSizesZero = sizes.every((s) => s.price === 0);
  const allSugarsZero = sugars.every((s) => s.price === 0);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* ── Kích thước ── */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Chọn size </Text>
        <View style={styles.grid}>
          {sizes.map((size, index) => (
            <OptionCard
              key={size.id}
              label={SIZE_LABELS[index] ?? size.name}
              priceLabel={getPriceLabel(size.price, allSizesZero)}
              isSelected={selectedSize?.id === size.id}
              onPress={() => selectIngredient(size)}
              horizontal={true}
            />
          ))}
        </View>
      </View>

      {/* ── Mức đường ── */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mức đường</Text>
        <View style={styles.grid}>
          {sugars.map((sugar) => (
            <OptionCard
              key={sugar.id}
              label={extractSugarLabel(sugar.name)}
              priceLabel={getPriceLabel(sugar.price, allSugarsZero)}
              isSelected={selectedSugar?.id === sugar.id}
              onPress={() => selectIngredient(sugar)}
            />
          ))}
        </View>
      </View>

      {/* ── Số lượng ── */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Số lượng</Text>
        <View style={styles.stepper}>
          <TouchableOpacity
            style={styles.stepBtn}
            onPress={() => setQuantity(quantity - 1)}
            disabled={quantity <= 1}
          >
            <Minus
              size={18}
              color={quantity <= 1 ? Colors.borderLight : Colors.primary}
            />
          </TouchableOpacity>

          <View style={styles.quantityDisplay}>
            <Text style={styles.quantityText}>{quantity}</Text>
          </View>

          <TouchableOpacity
            style={styles.stepBtn}
            onPress={() => setQuantity(quantity + 1)}
          >
            <Plus size={18} color={Colors.primary} />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20, paddingBottom: 20 },
  section: { marginTop: 5 },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.foreground,
    marginBottom: 12,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  optionContentHorizontal: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  optionCard: {
    flex: 1,
    minWidth: "28%",
    backgroundColor: Colors.inputBackground,
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  activeOptionCard: {
    backgroundColor: Colors.white,
    borderColor: Colors.primary,
    ...Shadows.sm,
  },
  optionName: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.foreground,
    textAlign: "center",
  },
  optionPrice: {
    fontSize: 13,
    color: Colors.mutedForeground,
    marginTop: 3,
  },
  activeOptionText: { color: Colors.primary },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.inputBackground,
    borderRadius: Radius.full,
    padding: 2,
    width: 120,
  },
  stepBtn: {
    width: 32,
    height: 32,
    borderRadius: Radius.full,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
    ...Shadows.sm,
  },
  quantityDisplay: { flex: 1, alignItems: "center" },
  quantityText: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.foreground,
  },
});
