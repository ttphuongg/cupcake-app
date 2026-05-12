import { create } from 'zustand';
import { Order } from '../types';
import { orderService } from '../services/orderService';

// ─── Types ─────────────────────────────────────────────────────────────────

interface OrderDetail {
  id: number;
  status: Order['status'];
  created_at: string;
  phone: string;
  address: string;
  subtotal: number;
  total_price: number;
  items: Array<{
    product_name: string;
    quantity: number;
    price: number;
  }>;
}

interface CheckoutInfo {
  address: string;
  phone: string;
  paymentMethod: string;
  note?: string;
}

interface PlaceOrderResult {
  id: number;
  [key: string]: unknown;
}

interface ReorderResult {
  message: string;
  unavailableItems?: string[];
}

// ─── State Interface ────────────────────────────────────────────────────────

interface OrderState {
  orders: Order[];
  currentOrderDetail: OrderDetail | null;
  currentOrder: CheckoutInfo;
  isLoading: boolean;
  error: string | null;

  // ── Danh sách đơn ──
  fetchOrders: (status?: string) => Promise<void>;

  // ── Chi tiết đơn ──
  fetchOrderById: (id: string) => Promise<void>;

  // ── Hủy đơn / Đặt lại ──
  cancelOrder: (id: string, reason?: string) => Promise<void>;
  reorder: (id: string) => Promise<ReorderResult>;

  // ── Thanh toán / Đặt mới ──
  setShippingInfo: (info: Partial<CheckoutInfo>) => void;
  createOrder: () => Promise<PlaceOrderResult>;
  clearCurrentOrder: () => void;
}

// ─── Store ──────────────────────────────────────────────────────────────────

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: [],
  currentOrderDetail: null,
  currentOrder: {
    address: '',
    phone: '',
    paymentMethod: 'COD',
    note: '',
  },
  isLoading: false,
  error: null,

  // ── Danh sách đơn hàng ────────────────────────────────────────────────────

  fetchOrders: async (status?: string) => {
    try {
      set({ isLoading: true, error: null });
      const data = await orderService.getOrderHistory(status ? { status } : undefined);
      set({ orders: data, isLoading: false });
    } catch (error: unknown) {
      const msg =
        error instanceof Error
          ? error.message
          : 'Lỗi khi tải lịch sử đơn hàng';
      set({ isLoading: false, error: msg });
    }
  },

  // ── Chi tiết một đơn hàng ─────────────────────────────────────────────────

  fetchOrderById: async (id: string) => {
    try {
      set({ isLoading: true, error: null, currentOrderDetail: null });
      const data = await orderService.getOrderDetails(id);
      set({ currentOrderDetail: data as unknown as OrderDetail, isLoading: false });
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Lỗi khi tải chi tiết đơn hàng';
      set({ isLoading: false, error: msg });
    }
  },

  // ── Hủy đơn hàng ─────────────────────────────────────────────────────────

  cancelOrder: async (id: string, reason = '') => {
    try {
      set({ isLoading: true, error: null });
      await orderService.cancelOrder(id, reason);
      // Refresh chi tiết sau khi hủy
      await get().fetchOrderById(id);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Hủy đơn thất bại';
      set({ isLoading: false, error: msg });
      throw error;
    }
  },

  // ── Đặt lại đơn ──────────────────────────────────────────────────────────

  reorder: async (id: string): Promise<ReorderResult> => {
    try {
      set({ isLoading: true, error: null });
      const result = await orderService.reorder(id);
      set({ isLoading: false });
      return {
        message: (result as { message?: string }).message ?? 'Đặt lại thành công',
        unavailableItems: (result as { unavailableItems?: string[] }).unavailableItems,
      };
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Không thể đặt lại đơn hàng';
      set({ isLoading: false, error: msg });
      throw error;
    }
  },

  // ── Thanh toán ────────────────────────────────────────────────────────────

  setShippingInfo: (info: Partial<CheckoutInfo>) => {
    set((state) => ({ currentOrder: { ...state.currentOrder, ...info } }));
  },

  createOrder: async (): Promise<PlaceOrderResult> => {
    try {
      set({ isLoading: true, error: null });
      const { currentOrder } = get();

      if (!currentOrder.address || !currentOrder.phone) {
        throw new Error('Vui lòng nhập đầy đủ địa chỉ và số điện thoại giao hàng.');
      }

      const result = await orderService.checkout(currentOrder);
      set({ isLoading: false });
      return result as PlaceOrderResult;
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Lỗi khi đặt hàng';
      set({ isLoading: false, error: msg });
      throw error;
    }
  },

  clearCurrentOrder: () =>
    set({ currentOrder: { address: '', phone: '', paymentMethod: 'COD', note: '' } }),
}));
