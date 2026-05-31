import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { ChevronLeft, ArrowRight, ArrowLeft } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useDesignLogic } from "../hooks/useDesignLogic";
import { IngredientSelector } from "../components/Design/IngredientSelector";
import { CakePricePreview } from "../components/Design/CakePricePreview";
import { DesignStepHeader } from "../components/Design/DesignStepHeader";
import { DesignSummaryStep } from "../components/Design/DesignSummaryStep";
import { ExtraOptionsStep } from "../components/Design/ExtraOptionsStep";
import { Colors, Radius, Shadows } from "../constants/theme";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const PREVIEW_HEIGHT = SCREEN_HEIGHT * 0.57;

export default function CustomDesign() {
  const insets = useSafeAreaInsets();

  const {
    router,
    currentDesignStep,
    currentData,
    currentSelected,
    isNextDisabled,
    selectedBase,
    selectedFilling,
    selectedFrosting,
    selectedToppings,
    selectedSize,
    selectedSugar,
    quantity,
    selectIngredient,
    handleNext,
    prevStep,
  } = useDesignLogic();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* ── VÙNG PREVIEW ── */}
      <View
        style={[styles.previewSection, { height: PREVIEW_HEIGHT - insets.top }]}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backCircle}
            onPress={() => router.back()}
          >
            <ChevronLeft size={20} color={Colors.foreground} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Thiết kế bánh</Text>
          <View style={{ width: 40 }} />
        </View>

        <CakePricePreview />
      </View>

      {/* ── VÙNG EDITOR ── */}
      <View style={styles.editorSection}>
        <DesignStepHeader />

        <View style={{ flex: 1, overflow: "hidden" }}>
          {currentDesignStep === 6 ? (
            <DesignSummaryStep
              base={selectedBase}
              filling={selectedFilling}
              frosting={selectedFrosting}
              size={selectedSize}
              sugar={selectedSugar}
              toppings={selectedToppings}
              quantity={quantity}
            />
          ) : currentDesignStep === 5 ? (
            <ExtraOptionsStep />
          ) : (
            <IngredientSelector
              data={currentData}
              selected={currentSelected}
              onSelect={selectIngredient}
            />
          )}
        </View>

        <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
          {currentDesignStep > 1 ? (
            <TouchableOpacity style={styles.btnBack} onPress={prevStep}>
              <ArrowLeft size={18} color={Colors.primary} />
              <Text style={styles.btnBackText}>Quay lại</Text>
            </TouchableOpacity>
          ) : (
            <View style={{ width: 80 }} />
          )}

          <TouchableOpacity
            style={[styles.btnNext, isNextDisabled && styles.disabledBtn]}
            onPress={handleNext}
            disabled={isNextDisabled}
          >
            <Text style={styles.btnNextText}>
              {currentDesignStep < 6 ? "Tiếp" : "Thêm vào giỏ"}
            </Text>
            <ArrowRight size={18} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primaryAlpha10,
  },
  previewSection: {
    width: "100%",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 20,
    height: 56,
  },
  backCircle: {
    width: 40,
    height: 40,
    backgroundColor: Colors.white,
    borderRadius: Radius.full,
    alignItems: "center",
    justifyContent: "center",
    ...Shadows.sm,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: Colors.foreground,
  },
  editorSection: {
    flex: 1,
    backgroundColor: Colors.card,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    marginTop: -56,
    paddingTop: 8,
    ...Shadows.lg,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 8,
    backgroundColor: Colors.card,
  },
  btnBack: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  btnBackText: {
    color: Colors.primary,
    fontSize: 15,
    fontWeight: "600",
  },
  btnNext: {
    backgroundColor: Colors.primary,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 11,
    borderRadius: Radius.full,
    gap: 4,
    minWidth: 120,
    justifyContent: "center",
  },
  disabledBtn: {
    backgroundColor: Colors.borderLight,
    opacity: 0.6,
  },
  btnNextText: {
    color: Colors.white,
    fontWeight: "700",
    fontSize: 15,
  },
});
