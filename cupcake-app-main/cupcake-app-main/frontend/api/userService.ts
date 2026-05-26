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
  requestChangePasswordOtp: async () => {
    const response = await api.post(ENDPOINTS.USER.REQUEST_CHANGE_PASSWORD_OTP);
    return response.data.data || response.data;
  },
  changePassword: async (data: {
    oldPassword?: string;
    currentPassword?: string; // alias
    newPassword?: string;
    otp?: string;
  }) => {
    // Backend nhận: oldPassword, newPassword, otp
    const payload = {
      oldPassword: data.oldPassword ?? data.currentPassword,
      newPassword: data.newPassword,
      otp: data.otp,
    };
    const response = await api.post(ENDPOINTS.USER.CHANGE_PASSWORD, payload);
    return response.data.data || response.data;
  },
  requestDeleteAccountLink: async (password: string) => {
    // Backend cần password để xác minh trước khi gửi Link
    const response = await api.post(ENDPOINTS.USER.REQUEST_DELETE_ACCOUNT_LINK, { password });
    return response.data.data || response.data;
  },
  deleteAccount: async (token: string) => {
    const response = await api.post(ENDPOINTS.USER.DELETE_ACCOUNT, { token });
    return response.data.data || response.data;
  },
  uploadAvatar: async (imageUri: string, mimeType: string = 'image/jpeg', fileName: string = 'avatar.jpg') => {
    const formData = new FormData();
    formData.append('avatar', {
      uri: imageUri,
      type: mimeType,
      name: fileName,
    } as any);

    const response = await api.post(ENDPOINTS.UPLOAD.AVATAR, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data || response.data;
  }
};
