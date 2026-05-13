import api from '../utils/api';
import { ENDPOINTS } from '../constants/endpoints';
import { Review } from '../types';

export const reviewService = {
  createReview: async (productId: number | string, data: { rating: number; comment?: string; image?: string }): Promise<any> => {
    const response = await api.post(ENDPOINTS.REVIEWS.CREATE(productId), data);
    return response.data.data || response.data;
  },
  updateReview: async (id: number | string, data: Partial<Review>): Promise<any> => {
    const response = await api.patch(ENDPOINTS.REVIEWS.UPDATE(id), data);
    return response.data.data || response.data;
  },
  deleteReview: async (id: number | string): Promise<any> => {
    const response = await api.delete(ENDPOINTS.REVIEWS.DELETE(id));
    return response.data.data || response.data;
  }
};
