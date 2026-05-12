import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'cupcake_auth_token';
const USER_KEY = 'cupcake_user_info';

export const storage = {
  // --- Quản lý JWT Token ---
  saveToken: async (token: string): Promise<void> => {
    try {
      await AsyncStorage.setItem(TOKEN_KEY, token);
    } catch (error) {
      console.error('Lỗi khi lưu token:', error);
    }
  },

  getToken: async (): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(TOKEN_KEY);
    } catch (error) {
      console.error('Lỗi khi lấy token:', error);
      return null;
    }
  },

  removeToken: async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(TOKEN_KEY);
    } catch (error) {
      console.error('Lỗi khi xóa token:', error);
    }
  },

  // --- Quản lý thông tin User ---
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
      await AsyncStorage.removeItem(TOKEN_KEY);
      await AsyncStorage.removeItem(USER_KEY);
    } catch (error) {
      console.error('Lỗi khi xóa dữ liệu storage:', error);
    }
  }
};
