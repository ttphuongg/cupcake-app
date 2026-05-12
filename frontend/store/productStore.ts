import { create } from 'zustand';
import { Product, Category } from '../types';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';

interface ProductState {
  // --- Products ---
  products: Product[];
  currentProduct: Product | null;
  isLoading: boolean;
  error: string | null;

  // --- Categories ---
  categories: Category[];
  isCategoriesLoading: boolean;

  // --- Actions ---
  fetchProducts: (params?: {
    keyword?: string;
    categoryId?: number;
    minPrice?: number;
    maxPrice?: number;
  }) => Promise<void>;
  getProductById: (id: number | string) => Promise<Product | null>;
  clearCurrentProduct: () => void;
  fetchCategories: () => Promise<void>;
}

export const useProductStore = create<ProductState>((set) => ({
  // Initial State
  products: [],
  currentProduct: null,
  isLoading: false,
  error: null,

  categories: [],
  isCategoriesLoading: false,

  // ── Actions ──────────────────────────────────────────────────────────────

  fetchProducts: async (params) => {
    try {
      set({ isLoading: true, error: null });
      const data = await productService.searchProducts(params);
      set({ products: data, isLoading: false });
    } catch (error: unknown) {
      const msg =
        error instanceof Error ? error.message : 'Lỗi khi tải danh sách sản phẩm';
      set({ isLoading: false, error: msg });
    }
  },

  getProductById: async (id) => {
    try {
      set({ isLoading: true, error: null });
      const product = await productService.getProductDetails(id);
      set({ currentProduct: product, isLoading: false });
      return product;
    } catch (error: unknown) {
      const msg =
        error instanceof Error ? error.message : 'Lỗi khi tải chi tiết sản phẩm';
      set({ isLoading: false, error: msg });
      return null;
    }
  },

  clearCurrentProduct: () => set({ currentProduct: null }),

  fetchCategories: async () => {
    try {
      set({ isCategoriesLoading: true });
      const data = await categoryService.getCategories();
      set({ categories: data, isCategoriesLoading: false });
    } catch (error: unknown) {
      const msg =
        error instanceof Error ? error.message : 'Lỗi khi tải danh mục';
      console.error(msg);
      set({ isCategoriesLoading: false });
    }
  },
}));
