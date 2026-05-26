import api from '../utils/api';
import { ENDPOINTS } from '../constants/endpoints';
import { CartItem } from '../types';

export const cartService = {
  getCart: async (): Promise<CartItem[]> => {
    const response = await api.get(ENDPOINTS.CART.GET_CART);
    return response.data.data || response.data;
  },
  addToCart: async (data: { productId?: number; quantity: number; customData?: any }): Promise<any> => {
    const response = await api.post(ENDPOINTS.CART.ADD_TO_CART, data);
    return response.data.data || response.data;
  },
  updateQuantity: async (id: number | string, quantity: number): Promise<any> => {
    const response = await api.patch(ENDPOINTS.CART.UPDATE_QUANTITY(id), { quantity });
    return response.data.data || response.data;
  },
  removeFromCart: async (id: number | string): Promise<any> => {
    const response = await api.delete(ENDPOINTS.CART.REMOVE_ITEM(id));
    return response.data.data || response.data;
  }
};
