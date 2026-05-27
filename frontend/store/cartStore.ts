import { create } from 'zustand';
import { cartService } from '../api/cartService';
import { CartItem } from '../types/cartItem';
import { AddToCartPayload } from '../types/cart';

interface CartState {
  cartItems: CartItem[];
  isLoading: boolean;
  totalAmount: number;
  fetchCart: () => Promise<void>;
  addItemToCart: (cakeData: AddToCartPayload) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  clearCart: () => void;
  cartCount: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  cartItems: [],
  isLoading: false,
  totalAmount: 0,

  fetchCart: async () => {
    try {
      set({ isLoading: true });
      // Lấy response từ Server (Đang là 1 Object chứa mảng items)
      const response: any = await cartService.getCart();

      // KHẮC PHỤC TRIỆT ĐỂ Ở ĐÂY: Trích xuất mảng 'items' từ bên trong object response
      const safeItems = response && Array.isArray(response.items)
        ? response.items
        : (Array.isArray(response) ? response : []);

      let total = 0;
      safeItems.forEach((item: CartItem) => {
        let price = item.price ?? item.product?.price ?? 0;

        if (!price && item.custom_data) {
          try {
            const parsed: any = typeof item.custom_data === 'string'
              ? JSON.parse(item.custom_data)
              : item.custom_data;
            if (typeof parsed.unitPrice === 'number') {
              price = parsed.unitPrice;
            } else if (typeof parsed.totalPrice === 'number') {
              price = parsed.totalPrice / (parsed.quantity || 1);
            }
          } catch (e) {
            console.error('Lỗi parse custom_data:', e);
          }
        }
        total += price * item.quantity;
      });

      // Lấy luôn total_price từ backend tính sẵn
      const finalTotal = response?.total_price || total;

      set({ cartItems: safeItems, totalAmount: finalTotal, isLoading: false });
    } catch (error) {
      console.error('Lỗi lấy giỏ hàng:', error);
      set({ cartItems: [], totalAmount: 0, isLoading: false });
    }
  },

  addItemToCart: async (cakeData: AddToCartPayload) => {
    try {
      set({ isLoading: true });
      let finalCustomData = cakeData.customData;

      if (cakeData.designData) {
        const ds: any = cakeData.designData;
        const unitPrice = ds.totalPrice / (ds.quantity || 1);
        finalCustomData = JSON.stringify({
          size: ds.selectedSize,
          base: ds.selectedBase,
          filling: ds.selectedFilling,
          frosting: ds.selectedFrosting,
          sugar: ds.selectedSugar,
          toppings: ds.selectedToppings,
          unitPrice,
          totalPrice: ds.totalPrice,
        });
      } else if (cakeData.customData && typeof cakeData.customData !== 'string') {
        finalCustomData = JSON.stringify(cakeData.customData);
      }

      if (cakeData.productId) {
        await cartService.addToCart({
          productId: cakeData.productId,
          quantity: cakeData.quantity || 1,
          customData: finalCustomData
        });
      } else {
        await cartService.addCustomToCart({
          quantity: cakeData.quantity || 1,
          customData: finalCustomData
        });
      }

      // Xong thì tự động cập nhật lại giỏ hàng
      await get().fetchCart();
    } catch (error) {
      console.error('Lỗi thêm món:', error);
      set({ isLoading: false });
    }
  },

  updateQuantity: async (itemId: number, quantity: number) => {
    try {
      const updatedItems = get().cartItems.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      );
      set({ cartItems: updatedItems });
      await cartService.updateQuantity(itemId, quantity);
      await get().fetchCart();
    } catch (error) {
      console.error('Lỗi cập nhật SL:', error);
      await get().fetchCart();
    }
  },

  removeItem: async (itemId: number) => {
    try {
      set({ isLoading: true });
      set({ cartItems: get().cartItems.filter(item => item.id !== itemId) });
      await cartService.removeFromCart(itemId);
      await get().fetchCart();
    } catch (error) {
      console.error('Lỗi xóa món:', error);
      await get().fetchCart();
    }
  },

  clearCart: () => set({ cartItems: [], totalAmount: 0 }),

  cartCount: () => {
    const { cartItems } = get();
    const safeItems = Array.isArray(cartItems) ? cartItems : [];
    return safeItems.reduce((total, item) => total + item.quantity, 0);
  }
}));