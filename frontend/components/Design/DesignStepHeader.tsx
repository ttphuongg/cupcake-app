import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useUiStore } from "../../store/uiStore";
import { Colors } from "../../constants/theme";

const STEP_CONFIG: Record<number, { title: string }> = {
  1: { title: "Chọn Cốt bánh" },
  2: { title: "Chọn Nhân bánh" },
  3: { title: "Chọn Kem phủ" },
  4: { title: "Chọn Topping" },
  5: { title: "Tùy chọn khác" },
  6: { title: "Hoàn thiện" },
};

export const DesignStepHeader = () => {
  const { currentDesignStep } = useUiStore();
  const config = STEP_CONFIG[currentDesignStep] ?? STEP_CONFIG[1];

  return (
    <View style={styles.container}>
      <Text style={styles.stepTitle}>
        {currentDesignStep}. {config.title}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  stepTitle: {
    fontSize: 15,
    fontWeight: "500",
    color: Colors.mutedForeground,
    letterSpacing: 0.3,
  },
});
