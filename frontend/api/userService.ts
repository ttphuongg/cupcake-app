import api from '../utils/api';
import { ENDPOINTS } from '../constants/endpoints';
import { User } from '../types';

export const userService = {
  getProfile: async (): Promise<User> => {
    const response = await api.get(ENDPOINTS.USER.PROFILE);
    return response.data.data || response.data.user;
  },
  updateProfile: async (data: Partial<User>) => {
    const response = await api.patch(ENDPOINTS.USER.PROFILE, data);
    return response.data.data || response.data;
  },
  uploadAvatar: async (base64Image: string) => {
    const response = await api.post('/upload', { image: base64Image });
    return response.data.data || response.data;
  },
  requestChangePasswordLink: async () => {
    const response = await api.post(ENDPOINTS.USER.REQUEST_CHANGE_PASSWORD_LINK);
    return response.data.data || response.data;
  },
  confirmChangePassword: async (data: {
    token: string;
    newPassword?: string;
  }) => {
    const response = await api.post(ENDPOINTS.USER.CONFIRM_CHANGE_PASSWORD, data);
    return response.data.data || response.data;
  },
  requestDeleteAccountLink: async (password: string) => {
    const response = await api.post(ENDPOINTS.USER.REQUEST_DELETE_ACCOUNT_LINK, { password });
    return response.data.data || response.data;
  },
  confirmDeleteAccount: async (token: string) => {
    const response = await api.post(ENDPOINTS.USER.CONFIRM_DELETE_ACCOUNT, { token });
    return response.data.data || response.data;
  }
};
