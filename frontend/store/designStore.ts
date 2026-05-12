import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ingredient } from '../types/ingredient';
import { designService } from '../services/designService';

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

export const useDesignStore = create<DesignState>()(
  persist(
    (set, get) => ({
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
      fetchIngredients: async () => {
        try {
          set({ isLoading: true });
          // Gọi API lấy toàn bộ nguyên liệu
          const data = await designService.getAvailableIngredients();
          
          const currentState = get();
          let newSelectedSize = currentState.selectedSize;
          
          // Mặc định ban đầu chọn Size S nếu chưa có Size nào được chọn (có thể từ cache lên)
          if (!newSelectedSize) {
            const sizeS = data.find(i => i.type === 'SIZE' && i.name.toUpperCase().includes('S'));
            if (sizeS) {
              newSelectedSize = sizeS;
            }
          }

          // Mặc định đường 100% nếu chưa chọn
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
          
          // Tính lại giá
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
            // Nếu bấm vào filling hiện tại thì bỏ chọn (optional), nếu không thì chọn mới
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
            return; // toggleTopping đã tự gọi calculatePrice bên trong
        }
        
        // Tính lại giá sau khi chọn
        get().calculatePrice();
      },

      toggleTopping: (item: Ingredient) => {
        const { selectedToppings } = get();
        const exists = selectedToppings.find((t) => t.id === item.id);
        
        let newToppings;
        if (exists) {
          // Bỏ chọn nếu đã có
          newToppings = selectedToppings.filter((t) => t.id !== item.id);
        } else {
          // Kiểm tra giới hạn 3 topping
          if (selectedToppings.length >= 3) {
            // Vượt quá -> không làm gì cả
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
        
        // Cộng dồn giá các thành phần (nếu đã chọn)
        if (selectedSize) total += Number(selectedSize.price) || 0;
        if (selectedBase) total += Number(selectedBase.price) || 0;
        if (selectedFilling) total += Number(selectedFilling.price) || 0;
        if (selectedFrosting) total += Number(selectedFrosting.price) || 0;
        if (selectedSugar) total += Number(selectedSugar.price) || 0;
        
        selectedToppings.forEach((topping) => {
          total += Number(topping.price) || 0;
        });

        // Nhân với số lượng
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
        // Gọi lại fetch để tự động set lại Size S mặc định
        get().fetchIngredients();
      },

      // --- Computed / Getters ---
      getScaleValue: () => {
        const { selectedSize } = get();
        
        // Mặc định nếu chưa load hoặc chưa có
        if (!selectedSize) return 0.8;
        
        const name = selectedSize.name.toUpperCase();
        if (name.includes('S')) return 0.8;
        if (name.includes('M')) return 1.0;
        if (name.includes('L')) return 1.2;
        
        return 0.8; // Fallback an toàn về S
      },

      canAddToCart: () => {
        const { selectedBase, selectedFrosting } = get();
        // Cả Base và Frosting đều bắt buộc
        return selectedBase !== null && selectedFrosting !== null;
      }
    }),
    {
      name: 'cupcake-design-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // partialize giúp CHỈ LƯU các trạng thái thiết kế của bánh,
      // Không lưu danh sách ingredients vì danh sách có thể thay đổi từ server.
      partialize: (state) => ({
        selectedSize: state.selectedSize,
        selectedBase: state.selectedBase,
        selectedFilling: state.selectedFilling,
        selectedFrosting: state.selectedFrosting,
        selectedSugar: state.selectedSugar,
        selectedToppings: state.selectedToppings,
        quantity: state.quantity,
        totalPrice: state.totalPrice,
      }),
    }
  )
);
