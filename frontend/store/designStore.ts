import { create } from 'zustand';
import { Ingredient } from '../types/ingredient';
import { designService } from '../services/designService';
import { loadDesignDraft, saveDesignColumn, clearDesignDraft } from '../utils/database';

interface DesignState {
  // --- State ---
  ingredients: Ingredient[];
  selectedSize: Ingredient | null;
  selectedBase: Ingredient | null;
  selectedFilling: Ingredient | null;
  selectedFrosting: Ingredient | null;
  selectedSugar: Ingredient | null;
  selectedToppings: Ingredient[];
  quantity: number;
  totalPrice: number;
  isLoading: boolean;

  // --- Actions ---
  initDraftDesign: () => void;
  fetchIngredients: () => Promise<void>;
  selectIngredient: (item: Ingredient) => void;
  toggleTopping: (item: Ingredient) => void;
  setQuantity: (quantity: number) => void;
  calculatePrice: () => void;
  resetDesign: () => void;

  // --- Computed / Getters ---
  getScaleValue: () => number;
  canAddToCart: () => boolean;
}

export const useDesignStore = create<DesignState>((set, get) => ({
  // --- Initial State ---
  ingredients: [],
  selectedSize: null,
  selectedBase: null,
  selectedFilling: null,
  selectedFrosting: null,
  selectedSugar: null,
  selectedToppings: [],
  quantity: 1,
  totalPrice: 0,
  isLoading: false,

  // --- Actions ---
  initDraftDesign: () => {
    const draft = loadDesignDraft();
    if (draft) {
      set({
        selectedSize: draft.selectedSize,
        selectedBase: draft.selectedBase,
        selectedFilling: draft.selectedFilling,
        selectedFrosting: draft.selectedFrosting,
        selectedSugar: draft.selectedSugar,
        selectedToppings: draft.selectedToppings,
        quantity: draft.quantity,
        totalPrice: draft.totalPrice,
      });
    }
  },

  fetchIngredients: async () => {
    try {
      set({ isLoading: true });
      const data = await designService.getAvailableIngredients();
      
      const currentState = get();
      let newSelectedSize = currentState.selectedSize;
      
      if (!newSelectedSize) {
        const sizeS = data.find(i => i.type === 'SIZE' && i.name.toUpperCase().includes('S'));
        if (sizeS) {
          newSelectedSize = sizeS;
        }
      }

      let newSelectedSugar = currentState.selectedSugar;
      if (!newSelectedSugar) {
        const sugar100 = data.find(i => i.type === 'SUGAR' && i.name.includes('100'));
        if (sugar100) {
          newSelectedSugar = sugar100;
        } else {
          newSelectedSugar = data.find(i => i.type === 'SUGAR') || null;
        }
      }

      set({ 
        ingredients: data, 
        selectedSize: newSelectedSize,
        selectedSugar: newSelectedSugar,
        isLoading: false 
      });
      
      get().calculatePrice();
    } catch (error) {
      console.error('Lỗi khi fetch danh sách nguyên liệu thiết kế:', error);
      set({ isLoading: false });
    }
  },

  selectIngredient: (item: Ingredient) => {
    const { type } = item;
    
    switch (type) {
      case 'SIZE':
        set({ selectedSize: item });
        break;
      case 'BASE':
        set({ selectedBase: item });
        break;
      case 'FILLING':
        set({ selectedFilling: item.id === get().selectedFilling?.id ? null : item });
        break;
      case 'FROSTING':
        set({ selectedFrosting: item });
        break;
      case 'SUGAR':
        set({ selectedSugar: item });
        break;
      case 'TOPPING':
        get().toggleTopping(item);
        return;
    }
    
    get().calculatePrice();
  },

  toggleTopping: (item: Ingredient) => {
    const { selectedToppings } = get();
    const exists = selectedToppings.find((t) => t.id === item.id);
    
    let newToppings;
    if (exists) {
      newToppings = selectedToppings.filter((t) => t.id !== item.id);
    } else {
      if (selectedToppings.length >= 3) {
        return;
      }
      newToppings = [...selectedToppings, item];
    }
    
    set({ selectedToppings: newToppings });
    get().calculatePrice();
  },

  setQuantity: (quantity: number) => {
    if (quantity > 0) {
      set({ quantity });
      get().calculatePrice();
    }
  },

  calculatePrice: () => {
    const { 
      selectedSize, selectedBase, selectedFilling, 
      selectedFrosting, selectedSugar, selectedToppings, quantity 
    } = get();
    
    let total = 0;
    
    if (selectedSize) total += Number(selectedSize.price) || 0;
    if (selectedBase) total += Number(selectedBase.price) || 0;
    if (selectedFilling) total += Number(selectedFilling.price) || 0;
    if (selectedFrosting) total += Number(selectedFrosting.price) || 0;
    if (selectedSugar) total += Number(selectedSugar.price) || 0;
    
    selectedToppings.forEach((topping) => {
      total += Number(topping.price) || 0;
    });

    total = total * quantity;
    
    set({ totalPrice: total });
  },

  resetDesign: () => {
    set({
      selectedSize: null,
      selectedBase: null,
      selectedFilling: null,
      selectedFrosting: null,
      selectedSugar: null,
      selectedToppings: [],
      quantity: 1,
      totalPrice: 0,
    });
    clearDesignDraft();
    get().fetchIngredients();
  },

  // --- Computed / Getters ---
  getScaleValue: () => {
    const { selectedSize } = get();
    if (!selectedSize) return 0.8;
    
    const name = selectedSize.name.toUpperCase();
    if (name.includes('S')) return 0.8;
    if (name.includes('M')) return 1.0;
    if (name.includes('L')) return 1.2;
    
    return 0.8;
  },

  canAddToCart: () => {
    const { selectedBase, selectedFrosting } = get();
    return selectedBase !== null && selectedFrosting !== null;
  }
}));

// Lắng nghe sự thay đổi của Store để đồng bộ cột xuống SQLite (thay cho persist middleware)
useDesignStore.subscribe((state, prevState) => {
  if (state.selectedSize !== prevState.selectedSize) saveDesignColumn('selected_size', state.selectedSize);
  if (state.selectedBase !== prevState.selectedBase) saveDesignColumn('selected_base', state.selectedBase);
  if (state.selectedFilling !== prevState.selectedFilling) saveDesignColumn('selected_filling', state.selectedFilling);
  if (state.selectedFrosting !== prevState.selectedFrosting) saveDesignColumn('selected_frosting', state.selectedFrosting);
  if (state.selectedSugar !== prevState.selectedSugar) saveDesignColumn('selected_sugar', state.selectedSugar);
  if (state.selectedToppings !== prevState.selectedToppings) saveDesignColumn('selected_toppings', state.selectedToppings);
  if (state.quantity !== prevState.quantity) saveDesignColumn('quantity', state.quantity);
  if (state.totalPrice !== prevState.totalPrice) saveDesignColumn('total_price', state.totalPrice);
});
