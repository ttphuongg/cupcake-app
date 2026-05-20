import { create } from 'zustand';
import { cartService } from '../api/cartService';
import { CartItem } from '../types/cartItem';
import { AddToCartPayload } from '../types/cart';

interface CartState {
  // --- State ---
  cartItems: CartItem[];
  isLoading: boolean;
  totalAmount: number;

  // --- Actions ---
  fetchCart: () => Promise<void>;
  addItemToCart: (cakeData: AddToCartPayload) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  clearCart: () => void;

  // --- Computed / Getters ---
  cartCount: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  // Initial State
  cartItems: [],
  isLoading: false,
  totalAmount: 0,

  fetchCart: async () => {
    try {
      set({ isLoading: true });
      // Gọi Server lấy giỏ hàng
      const items = await cartService.getCart();

      let total = 0;
      // Dựa vào dữ liệu trả về từ backend, tính tổng tiền.
      // (Bao gồm cả giá sản phẩm thường và giá bánh custom)
      items.forEach((item: CartItem) => {
        // Ưu tiên field price đã được backend tính sẵn
        let price = item.price ?? item.product?.price ?? 0;

        // Nếu là bánh custom, bóc tách từ custom_data JSON
        if (!price && item.custom_data) {
          try {
            const parsed: Record<string, unknown> =
              typeof item.custom_data === 'string'
                ? JSON.parse(item.custom_data)
                : (item.custom_data as Record<string, unknown>);

            if (typeof parsed.unitPrice === 'number') {
              price = parsed.unitPrice;
            } else if (typeof parsed.totalPrice === 'number') {
              price = parsed.totalPrice / (typeof parsed.quantity === 'number' ? parsed.quantity : 1);
            }
          } catch (e) {
            console.error('Lỗi khi parse custom_data:', e);
          }
        }
        total += price * item.quantity;
      });

      set({ cartItems: items, totalAmount: total, isLoading: false });
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu giỏ hàng:', error);
      set({ isLoading: false });
    }
  },

  addItemToCart: async (cakeData: AddToCartPayload) => {
    try {
      set({ isLoading: true });

      let finalCustomData = cakeData.customData;

      // Kiểm tra nếu có truyền object designData (từ designStore)
      // thì đóng gói toàn bộ cấu hình vào JSON
      if (cakeData.designData) {
        // Ép kiểu an toàn: designData là snapshot của DesignStore
        type DesignSnapshot = {
          totalPrice: number;
          quantity: number;
          selectedSize: unknown;
          selectedBase: unknown;
          selectedFilling: unknown;
          selectedFrosting: unknown;
          selectedSugar: unknown;
          selectedToppings: unknown[];
        };
        const ds = cakeData.designData as unknown as DesignSnapshot;
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
        // Nếu truyền sẵn object thì stringify
        finalCustomData = JSON.stringify(cakeData.customData);
      }

      // Gọi API thêm vào giỏ
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

      // Thành công -> fetch lại danh sách mới nhất
      await get().fetchCart();
    } catch (error) {
      console.error('Lỗi khi thêm món vào giỏ:', error);
      set({ isLoading: false });
    }
  },

  updateQuantity: async (itemId: number, quantity: number) => {
    try {
      // Cập nhật state cục bộ trước (Optimistic UI Update) cho UI phản hồi nhanh
      const currentItems = get().cartItems;
      const updatedItems = currentItems.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      );
      set({ cartItems: updatedItems });

      // Cập nhật dưới Server
      await cartService.updateQuantity(itemId, quantity);

      // Fetch lại để đồng bộ TotalAmount chuẩn xác nhất từ DB
      await get().fetchCart();
    } catch (error) {
      console.error('Lỗi cập nhật số lượng:', error);
      // Nếu lỗi, fetch lại bản chuẩn để rollback UI
      await get().fetchCart();
    }
  },

  removeItem: async (itemId: number) => {
    try {
      set({ isLoading: true });

      // Optimistic UI Update xóa món
      const currentItems = get().cartItems;
      set({ cartItems: currentItems.filter(item => item.id !== itemId) });

      // Xóa ở Server
      await cartService.removeFromCart(itemId);

      // Đồng bộ lại
      await get().fetchCart();
    } catch (error) {
      console.error('Lỗi khi xóa món khỏi giỏ:', error);
      await get().fetchCart();
    }
  },

  clearCart: () => {
    // Gọi sau khi thanh toán hoặc đăng xuất
    set({ cartItems: [], totalAmount: 0 });
  },

  // --- Computed / Getters ---
  cartCount: () => {
    const { cartItems } = get();
    // Trả về tổng số lượng (quantity) của các món, 
    // hoặc có thể trả về cartItems.length tuỳ nghiệp vụ. 
    // Thường giỏ hàng hiển thị tổng số lượng sản phẩm:
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }
}));
