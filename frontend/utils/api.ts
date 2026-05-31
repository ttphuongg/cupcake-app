  import axios from 'axios';
  import { BASE_URL, TIMEOUT } from '../constants/config';
  import { storage } from './storage';
  import { handleApiError } from './errorHandler';

  // Khởi tạo Axios instance
  const api = axios.create({
    baseURL: BASE_URL,
    timeout: TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request Interceptor: Tự động gắn Token vào header
  api.interceptors.request.use(
    async (config) => {
      // Lấy token thông qua util storage mà chúng ta đã viết
      const token = await storage.getToken();

      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response Interceptor: Xử lý lỗi tập trung
  api.interceptors.response.use(
    (response) => {
      // Trả về dữ liệu thành công
      return response;
    },
    async (error) => {
      // Xử lý lỗi 401 (Unauthorized) - Token hết hạn hoặc sai
      if (error.response && error.response.status === 401) {
        console.warn('Phiên đăng nhập hết hạn hoặc không hợp lệ.');

        // Xóa token và user info trong AsyncStorage
        await storage.clearAll();

        // Cập nhật lại Zustand store để React cập nhật giao diện ngay lập tức
        const { useAuthStore } = require('../store/authStore');
        useAuthStore.setState({ user: null, token: null, isAuthenticated: false });
      }

      // Sử dụng tiện ích errorHandler để lấy message thân thiện
      const friendlyMessage = handleApiError(error);

      // Gán thông báo lỗi đã được chuẩn hóa vào object error để Component dễ dàng truy cập
      if (error.response) {
        error.message = friendlyMessage;
      }

      // Ném lỗi để phía Component có thể bắt được bằng try...catch và hiển thị Toast/Alert
      return Promise.reject(error);
    }
  );

  export default api;
