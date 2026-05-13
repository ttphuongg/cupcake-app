import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'cupcake_auth_token';
const USER_KEY = 'cupcake_user_info';

export const storage = {
  // --- Quản lý JWT Token (Secure Store) ---
  saveToken: async (token: string): Promise<void> => {
    try {
      await SecureStore.setItemAsync(TOKEN_KEY, token);
    } catch (error) {
      console.error('Lỗi khi lưu token vào SecureStore:', error);
    }
  },

  getToken: async (): Promise<string | null> => {
    try {
      // 1. Cố gắng lấy từ SecureStore trước
      let token = await SecureStore.getItemAsync(TOKEN_KEY);
      
      // 2. Migration logic: Nếu không có ở SecureStore, kiểm tra AsyncStorage
      if (!token) {
        token = await AsyncStorage.getItem(TOKEN_KEY);
        if (token) {
          // Di chuyển token sang SecureStore
          await SecureStore.setItemAsync(TOKEN_KEY, token);
          // Xóa khỏi AsyncStorage
          await AsyncStorage.removeItem(TOKEN_KEY);
          console.log('Đã migrate token sang SecureStore thành công.');
        }
      }
      return token;
    } catch (error) {
      console.error('Lỗi khi lấy token:', error);
      return null;
    }
  },

  removeToken: async (): Promise<void> => {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
    } catch (error) {
      console.error('Lỗi khi xóa token ở SecureStore:', error);
    }
  },

  // --- Quản lý thông tin User (Async Storage) ---
  saveUser: async (user: any): Promise<void> => {
    try {
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Lỗi khi lưu thông tin user:', error);
    }
  },

  getUser: async (): Promise<any | null> => {
    try {
      const userData = await AsyncStorage.getItem(USER_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Lỗi khi lấy thông tin user:', error);
      return null;
    }
  },

  removeUser: async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(USER_KEY);
    } catch (error) {
      console.error('Lỗi khi xóa thông tin user:', error);
    }
  },

  // --- Xóa tất cả khi Đăng xuất ---
  clearAll: async (): Promise<void> => {
    try {
      await Promise.all([
        SecureStore.deleteItemAsync(TOKEN_KEY),
        AsyncStorage.removeItem(USER_KEY),
      ]);
    } catch (error) {
      console.error('Lỗi khi xóa dữ liệu storage:', error);
    }
  }
};
