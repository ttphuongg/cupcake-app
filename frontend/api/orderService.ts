import api from '../utils/api';
import { ENDPOINTS } from '../constants/endpoints';
import { Order } from '../types';

export const orderService = {
  checkout: async (data: { address: string; phone: string; paymentMethod: string; note?: string }): Promise<any> => {
    const response = await api.post(ENDPOINTS.ORDERS.CHECKOUT, data);
    return response.data.data || response.data;
  },
  getOrderHistory: async (params?: { status?: string }): Promise<Order[]> => {
    const response = await api.get(ENDPOINTS.ORDERS.HISTORY, { params });
    return response.data.data;
  },
  getOrderDetails: async (id: number | string): Promise<Order> => {
    const response = await api.get(ENDPOINTS.ORDERS.DETAILS(id));
    return response.data.data;
  },
  cancelOrder: async (id: number | string, reason: string): Promise<any> => {
    const response = await api.post(ENDPOINTS.ORDERS.CANCEL(id), { reason });
    return response.data.data || response.data;
  },
  reorder: async (id: number | string): Promise<any> => {
    const response = await api.post(ENDPOINTS.ORDERS.REORDER(id));
    return response.data.data || response.data;
  }
};
