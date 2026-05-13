import api from '../utils/api';
import { ENDPOINTS } from '../constants/endpoints';
import { Product } from '../types';

export const productService = {
  searchProducts: async (params?: { keyword?: string; categoryId?: number; minPrice?: number; maxPrice?: number }): Promise<Product[]> => {
    const response = await api.get(ENDPOINTS.PRODUCTS.SEARCH, { params });
    // Dữ liệu mảng products nằm ở response.data.data
    return response.data.data;
  },
  getProductDetails: async (id: number | string): Promise<Product> => {
    const response = await api.get(ENDPOINTS.PRODUCTS.DETAILS(id));
    return response.data.data;
  }
};