import api from '../utils/api';
import { ENDPOINTS } from '../constants/endpoints';
import { Category } from '../types';

export const categoryService = {
  getCategories: async (): Promise<Category[]> => {
    const response = await api.get(ENDPOINTS.CATEGORIES.LIST);
    return response.data.data || response.data;
  },
};
