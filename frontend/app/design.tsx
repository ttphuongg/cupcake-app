/**
 * app/design.tsx — Màn hình Thiết kế bánh
 * Chỉ lắp ghép component và điều hướng.
 * Logic: useDesignStore | useUiStore
 */
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, ArrowRight, ArrowLeft } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useDesignStore } from '../store/designStore';
import { useUiStore } from '../store/uiStore';
import { useCartStore } from '../store/cartStore';
import { IngredientSelector } from '../components/IngredientSelector';
import { CakePricePreview } from '../components/CakePricePreview';
import { DesignStepHeader } from '../components/DesignStepHeader';
import { DesignSummaryStep } from '../components/DesignSummaryStep';
import { Ingredient } from '../types';
import { Colors, Radius, Shadows } from '../constants/theme';

// Tiêu đề của từng bước
const STEP_TITLES: Record<number, string> = {
  1: '1. Chọn cốt bánh',
  2: '2. Chọn nhân (Tùy chọn)',
  3: '3. Chọn kem phủ',
  4: '4. Topping (Tối đa 3)',
  5: '5. Hoàn thiện',
};

// Loại nguyên liệu tương ứng mỗi bước
const STEP_TYPE: Record<number, Ingredient['type'] | null> = {
  1: 'BASE',
  2: 'FILLING',
  3: 'FROSTING',
  4: 'TOPPING',
  5: null,
};

export default function CustomDesign() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const {
    ingredients,
    selectedBase,
    selectedFilling,
    selectedFrosting,
    selectedToppings,
    selectedSize,
    fetchIngredients,
    selectIngredient,
    canAddToCart,
    resetDesign,
  } = useDesignStore();

  const { currentDesignStep, nextStep, prevStep, showToast } = useUiStore();
  const { addItemToCart } = useCartStore();

  useEffect(() => {
    fetchIngredients();
  }, []);

  // Data nguyên liệu cho bước hiện tại
  const stepType = STEP_TYPE[currentDesignStep];
  const currentData = stepType
    ? ingredients.filter((i) => i.type === stepType && i.is_active === 1)
    : [];

  // Giá trị đang được chọn cho bước hiện tại
  const currentSelected: Ingredient | Ingredient[] | null = (() => {
    switch (currentDesignStep) {
      case 1: return selectedBase;
      case 2: return selectedFilling;
      case 3: return selectedFrosting;
      case 4: return selectedToppings;
      default: return null;
    }
  })();

  // Nút "Tiếp" bị disable khi bước bắt buộc chưa chọn
  const isNextDisabled =
    (currentDesignStep === 1 && !selectedBase) ||
    (currentDesignStep === 3 && !selectedFrosting);

  const handleNext = () => {
    if (currentDesignStep < 5) {
      nextStep();
    } else {
      handleAddToCart();
    }
  };

  const handleAddToCart = async () => {
    if (!canAddToCart()) {
      showToast('Vui lòng chọn cốt bánh và kem phủ trước khi thêm vào giỏ.', 'error');
      return;
    }
    try {
      const state = useDesignStore.getState();
      await addItemToCart({ designData: state as unknown as Record<string, unknown> });
      showToast('Bánh đã được thêm vào giỏ hàng! 🎉', 'success');
      resetDesign();
      router.back();
    } catch {
      showToast('Không thể thêm vào giỏ. Vui lòng thử lại.', 'error');
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>

      {/* PHẦN PREVIEW */}
      <View style={styles.previewSection}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backCircle} onPress={() => router.back()}>
            <ChevronLeft size={20} color={Colors.foreground} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Thiết kế bánh</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Preview ảnh bánh + badge giá — tự kết nối designStore */}
        <CakePricePreview />
      </View>

      {/* PHẦN EDITOR */}
      <View style={styles.editorSection}>
        {/* Header bước + Progress Bar */}
        <DesignStepHeader />

        <View style={{ flex: 1 }}>
          {currentDesignStep === 5 ? (
            // Bước cuối: hiển thị tóm tắt
            <DesignSummaryStep
              base={selectedBase}
              filling={selectedFilling}
              frosting={selectedFrosting}
              size={selectedSize}
              toppings={selectedToppings}
            />
          ) : (
            <IngredientSelector
              data={currentData}
              selected={currentSelected}
              onSelect={selectIngredient}
            />
          )}
        </View>

        {/* FOOTER */}
        <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
          <TouchableOpacity
            style={styles.btnBack}
            onPress={() => currentDesignStep > 1 && prevStep()}
          >
            <ArrowLeft size={20} color="#F06292" />
            <Text style={styles.btnBackText}>Quay lại</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btnNext, isNextDisabled && styles.disabledBtn]}
            onPress={handleNext}
            disabled={isNextDisabled}
          >
            <Text style={styles.btnNextText}>
              {currentDesignStep < 5 ? 'Tiếp' : 'Thêm vào giỏ'}
            </Text>
            <ArrowRight size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.primaryAlpha10 }, // Hoặc Colors.primary nếu nền ảnh thật sự đậm
  previewSection: { flex: 1, alignItems: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingHorizontal: 20, height: 60 },
  backCircle: { width: 40, height: 40, backgroundColor: Colors.white, borderRadius: Radius.full, alignItems: 'center', justifyContent: 'center', ...Shadows.sm },
  headerTitle: { fontSize: 18, fontWeight: '700', color: Colors.foreground },
  editorSection: { flex: 1.3, backgroundColor: Colors.card, borderTopLeftRadius: Radius.xxl, borderTopRightRadius: Radius.xxl, marginTop: -40, paddingTop: 10, ...Shadows.md },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 25, paddingTop: 10 },
  btnBack: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  btnBackText: { color: Colors.primary, fontSize: 16, fontWeight: '600' },
  btnNext: { backgroundColor: Colors.primary, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 12, borderRadius: Radius.xl, gap: 8, minWidth: 120, justifyContent: 'center' },
  disabledBtn: { backgroundColor: Colors.borderLight },
  btnNextText: { color: Colors.white, fontWeight: '700', fontSize: 16 },
});
