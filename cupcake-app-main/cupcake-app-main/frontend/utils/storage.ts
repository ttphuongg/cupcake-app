import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const TOKEN_KEY = 'cupcake_auth_token';
const USER_KEY = 'cupcake_user_info';

export const storage = {
  saveToken: async (token: string): Promise<void> => {
    try {
      if (Platform.OS === 'web') {
        await AsyncStorage.setItem(TOKEN_KEY, token);
      } else {
        await SecureStore.setItemAsync(TOKEN_KEY, token);
      }
    } catch (error) {
      console.error('Lỗi khi lưu token:', error);
    }
  },

  getToken: async (): Promise<string | null> => {
    try {
      if (Platform.OS === 'web') {
        return await AsyncStorage.getItem(TOKEN_KEY);
      }
      
      let token = await SecureStore.getItemAsync(TOKEN_KEY);
      
      if (!token) {
        token = await AsyncStorage.getItem(TOKEN_KEY);
        if (token) {
          await SecureStore.setItemAsync(TOKEN_KEY, token);
          await AsyncStorage.removeItem(TOKEN_KEY);
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
      if (Platform.OS === 'web') {
        await AsyncStorage.removeItem(TOKEN_KEY);
      } else {
        await SecureStore.deleteItemAsync(TOKEN_KEY);
      }
    } catch (error) {
      console.error('Lỗi khi xóa token:', error);
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
      if (Platform.OS === 'web') {
        await Promise.all([
          AsyncStorage.removeItem(TOKEN_KEY),
          AsyncStorage.removeItem(USER_KEY),
        ]);
      } else {
        await Promise.all([
          SecureStore.deleteItemAsync(TOKEN_KEY),
          AsyncStorage.removeItem(USER_KEY),
        ]);
      }
    } catch (error) {
      console.error('Lỗi khi xóa dữ liệu storage:', error);
    }
  }
};
