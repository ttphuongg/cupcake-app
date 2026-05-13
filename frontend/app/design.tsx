import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ChevronLeft, ArrowRight, ArrowLeft } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useDesignLogic } from '../hooks/useDesignLogic';
import { IngredientSelector } from '../components/Design/IngredientSelector';
import { CakePricePreview } from '../components/Design/CakePricePreview';
import { DesignStepHeader } from '../components/Design/DesignStepHeader';
import { DesignSummaryStep } from '../components/Design/DesignSummaryStep';
import { Colors, Radius, Shadows } from '../constants/theme';

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
    selectIngredient,
    handleNext,
    prevStep,
  } = useDesignLogic();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.previewSection}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backCircle} onPress={() => router.back()}>
            <ChevronLeft size={20} color={Colors.foreground} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Thiết kế bánh</Text>
          <View style={{ width: 40 }} />
        </View>

        <CakePricePreview />
      </View>

      <View style={styles.editorSection}>
        <DesignStepHeader />

        <View style={{ flex: 1 }}>
          {currentDesignStep === 5 ? (
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.primaryAlpha10 },
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
