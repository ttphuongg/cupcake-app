import api from '../utils/api';
import { ENDPOINTS } from '../constants/endpoints';
import { Ingredient } from '../types';

export const designService = {
  getAvailableIngredients: async (): Promise<Ingredient[]> => {
    const response = await api.get(ENDPOINTS.DESIGN.INGREDIENTS);
    return response.data.data;
  },
  calculateCustomPrice: async (ingredientIds: number[]): Promise<{ totalPrice: number }> => {
    const response = await api.post(ENDPOINTS.DESIGN.CALCULATE_PRICE, { ingredientIds });
    return response.data.data || response.data;
  }
};