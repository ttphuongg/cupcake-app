import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useDesignStore } from '../store/designStore';
import { useUiStore } from '../store/uiStore';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { Ingredient } from '../types';

const STEP_TYPE: Record<number, Ingredient['type'] | null> = {
  1: 'BASE',
  2: 'FILLING',
  3: 'FROSTING',
  4: 'TOPPING',
  5: null,
};

export function useDesignLogic() {
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
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    fetchIngredients();
  }, []);

  const stepType = STEP_TYPE[currentDesignStep];
  const currentData = stepType
    ? ingredients.filter((i) => i.type === stepType && i.is_active === 1)
    : [];

  const currentSelected: Ingredient | Ingredient[] | null = (() => {
    switch (currentDesignStep) {
      case 1: return selectedBase;
      case 2: return selectedFilling;
      case 3: return selectedFrosting;
      case 4: return selectedToppings;
      default: return null;
    }
  })();

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
    if (!isAuthenticated) {
      showToast('Vui lòng đăng nhập để thêm vào giỏ hàng.', 'info');
      router.push('/(auth)/login');
      return;
    }

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
    } catch (error: any) {
      const msg = error.message || 'Không thể thêm vào giỏ. Vui lòng thử lại.';
      showToast(msg, 'error');
    }
  };

  return {
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
  };
}
