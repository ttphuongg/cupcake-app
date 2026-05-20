import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { Image } from "expo-image";
import { useDesignStore } from "../../store/designStore";
import { Colors, Radius } from "../../constants/theme";
import { Ingredient } from "../../types";
import { formatCurrency } from "../../utils/formatters";

const { width } = Dimensions.get("window");
// Kích thước bánh: tối đa 80% chiều rộng
const CAKE_SIZE = Math.min(width * 0.63, 300);

// Ảnh mặc định khi chưa chọn nguyên liệu nào
const DEFAULT_CAKE = require("../../assets/images/splash-icon.png");

export const CakePricePreview = () => {
  const {
    selectedBase,
    selectedFrosting,
    selectedToppings,
    selectedFilling,
    totalPrice,
  } = useDesignStore();

  // ── Thu thập và sắp xếp các lớp ảnh ──────────────────────────────────────
  const layers = (() => {
    const list: Ingredient[] = [];

    // Nạp các nguyên liệu đã chọn
    if (selectedBase?.image_url) list.push(selectedBase);
    if (selectedFilling?.image_url) list.push(selectedFilling);
    if (selectedFrosting?.image_url) list.push(selectedFrosting);
    selectedToppings.forEach((t) => {
      if (t.image_url) list.push(t);
    });

    // Trọng số tầng lớp mặc định (fallback nếu priority bằng nhau)
    const getLayerWeight = (type: string) => {
      switch (type) {
        case "BASE":
          return 1;
        case "FILLING":
          return 2;
        case "FROSTING":
          return 3;
        case "TOPPING":
          return 10;
        default:
          return 0;
      }
    };

    return [...list].sort((a, b) => {
      const weightA = getLayerWeight(a.type);
      const weightB = getLayerWeight(b.type);
      if (weightA !== weightB) return weightA - weightB;
      const priorityA = Number(a.priority) || 0;
      const priorityB = Number(b.priority) || 0;
      return priorityA - priorityB; //số lớn → index cao → trên cùng
    });
  })();

  return (
    <View style={styles.container}>
      {/* CANVAS ảnh bánh (Stack các lớp) */}
      <View style={styles.cakeCanvas}>
        {layers.length > 0 ? (
          layers.map((layer, index) => (
            <Image
              key={`${layer.id}-${index}`}
              source={{ uri: layer.image_url! }}
              style={[styles.cakeImage, index > 0 && styles.absoluteImage]}
              contentFit="contain"
              cachePolicy="memory-disk"
              transition={0}
              priority="high"
            />
          ))
        ) : (
          <Image
            source={DEFAULT_CAKE}
            style={styles.cakeImage}
            contentFit="contain"
            cachePolicy="memory-disk"
            transition={0}
          />
        )}
      </View>

      {/* BADGE tổng giá */}
      <View style={styles.priceBadge}>
        <Text style={styles.priceBadgeText}>
          {totalPrice > 0 ? formatCurrency(totalPrice) : "25.000đ"}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 70,
    gap: 10,
  },
  cakeCanvas: {
    width: CAKE_SIZE,
    height: CAKE_SIZE,
    justifyContent: "center",
    alignItems: "center",
  },
  cakeImage: {
    width: CAKE_SIZE,
    height: CAKE_SIZE,
  },
  absoluteImage: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  priceBadge: {
    backgroundColor: Colors.primaryAlpha10,
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.primaryAlpha20,
    alignSelf: "center",
  },
  priceBadgeText: {
    color: Colors.primaryDark,
    fontWeight: "700",
    fontSize: 17,
    textAlign: "center",
  },
});
