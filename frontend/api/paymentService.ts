import api from '../utils/api';
import { ENDPOINTS } from '../constants/endpoints';

export const paymentService = {
  processPayment: async (orderId: number | string): Promise<any> => {
    const response = await api.post(ENDPOINTS.PAYMENT.PROCESS(orderId));
    // Dữ liệu trả về thường là một URL (ví dụ: MoMo payUrl)
    return response.data.data || response.data;
  },
  verifyPayment: async (orderId: number | string): Promise<any> => {
    const response = await api.get(ENDPOINTS.PAYMENT.VERIFY(orderId));
    return response.data.data || response.data;
  }
};
