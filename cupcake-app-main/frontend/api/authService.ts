import api from '../utils/api';
import { ENDPOINTS } from '../constants/endpoints';

export const authService = {
  login: async (credentials: { email?: string; phone?: string; password?: string; identifier?: string }) => {
    // Chuẩn hóa: backend nhận `identifier` (email HOẶC phone)
    const payload = {
      identifier: credentials.identifier ?? credentials.email ?? credentials.phone,
      password: credentials.password,
    };
    const response = await api.post(ENDPOINTS.AUTH.LOGIN, payload);
    // Backend trả về: { success: true, message: '...', data: { token, user } }
    return response.data.data || response.data;
  },

  register: async (data: {
    email: string;
    name: string;
    password?: string;
    phone?: string;
  }) => {
    const response = await api.post(ENDPOINTS.AUTH.REGISTER, data);
    return response.data.data || response.data;
  },

  forgotPassword: async (identifier: string) => {
    // Backend nhận `email` (có thể là email hoặc phone tùy thiết lập)
    const response = await api.post(ENDPOINTS.AUTH.FORGOT_PASSWORD, { email: identifier });
    return response.data.data || response.data;
  },

  verifyResetToken: async (token: string) => {
    const response = await api.post(ENDPOINTS.AUTH.VERIFY_RESET_TOKEN, { token });
    return response.data.data || response.data;
  },

  resetPassword: async (data: { token: string; newPassword: string }) => {
    const response = await api.post(ENDPOINTS.AUTH.RESET_PASSWORD, data);
    return response.data.data || response.data;
  },

  logout: async () => {
    const response = await api.post(ENDPOINTS.AUTH.LOGOUT);
    return response.data.data || response.data;
  },
};
