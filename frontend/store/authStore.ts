import { create } from 'zustand';
import { User } from '../types';
import { storage } from '../utils/storage';
import { authService } from '../api/authService';
import { userService } from '../api/userService';
import { EditProfileData } from '../types/profile';

// ─── Types ─────────────────────────────────────────────────────────────────

interface LoginCredentials {
  identifier: string; // email hoặc số điện thoại
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  phone?: string;
  password: string;
  otpMethod?: 'email' | 'phone';
}

interface RegisterOtpResult {
  targetIdentifier: string;
}



interface UpdateProfileResult {
  requiresOtp: boolean;
  targetIdentifier?: string;
  tempData?: unknown;
  user?: User;
}

// ─── State Interface ────────────────────────────────────────────────────────

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;

  // ── Khởi tạo ──
  initializeAuth: () => Promise<void>;
  setLoading: (isLoading: boolean) => void;

  // ── Đăng nhập / Đăng xuất ──
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;

  // ── Đăng ký ──
  register: (data: RegisterData) => Promise<RegisterOtpResult>;
  verifyRegisterOtp: (params: {
    email: string;
    phone?: string;
    otp: string;
    targetIdentifier: string;
  }) => Promise<void>;

  // ── Quên mật khẩu ──
  forgotPassword: (email: string) => Promise<void>;
  verifyResetToken: (token: string) => Promise<{ email: string }>;
  resetPassword: (data: { token: string; newPassword: string }) => Promise<void>;

  // ── Đổi mật khẩu (Reset Link) ──
  requestChangePasswordLink: () => Promise<void>;
  confirmChangePassword: (data: { token: string; newPassword: string }) => Promise<void>;

  // ── Cập nhật profile (có thể yêu cầu OTP) ──
  fetchProfile: () => Promise<void>;
  updateProfile: (data: EditProfileData) => Promise<UpdateProfileResult>;
  verifyProfileOtp: (params: {
    otp: string;
    targetIdentifier: string;
    tempData: unknown;
  }) => Promise<void>;

  // ── Xóa tài khoản (Reset Link) ──
  requestDeleteAccountLink: (password: string) => Promise<void>;
  confirmDeleteAccount: (token: string) => Promise<void>;

  // ── Internal helpers ──
  setAuth: (user: User, token: string) => Promise<void>;
  updateUser: (user: Partial<User>) => Promise<void>;
}

// ─── Store ──────────────────────────────────────────────────────────────────

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,

  // ── Helpers ──────────────────────────────────────────────────────────────

  setAuth: async (user: User, token: string) => {
    await storage.saveToken(token);
    await storage.saveUser(user);
    set({ user, token, isAuthenticated: true });
  },

  updateUser: async (updatedFields: Partial<User>) => {
    const currentUser = get().user;
    if (currentUser) {
      const newUser = { ...currentUser, ...updatedFields };
      await storage.saveUser(newUser);
      set({ user: newUser });
    }
  },

  setLoading: (isLoading: boolean) => set({ isLoading }),

  // ── Khởi tạo ─────────────────────────────────────────────────────────────

  initializeAuth: async () => {
    try {
      set({ isLoading: true });
      const token = await storage.getToken();
      const user = await storage.getUser();
      if (token && user) {
        set({ token, user, isAuthenticated: true, isInitialized: true });
      } else {
        set({ isInitialized: true, isAuthenticated: false });
      }
    } catch (error) {
      console.error('Lỗi khi khởi tạo trạng thái xác thực:', error);
      set({ isInitialized: true, isAuthenticated: false });
    } finally {
      set({ isLoading: false });
    }
  },

  // ── Đăng nhập ────────────────────────────────────────────────────────────

  login: async ({ identifier, password }: LoginCredentials) => {
    set({ isLoading: true });
    try {
      // authService.login cần credentials dạng { email?, phone?, password }
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
      const credentials = isEmail
        ? { email: identifier, password }
        : { phone: identifier, password };

      const data = await authService.login(credentials);
      // Backend trả về { token, user } hoặc { data: { token, user } }
      const token: string = data.token;
      const user: User = data.user;
      await get().setAuth(user, token);
    } finally {
      set({ isLoading: false });
    }
  },

  // ── Đăng xuất ────────────────────────────────────────────────────────────

  logout: async () => {
    try {
      // Thử gọi backend logout (không throw nếu thất bại — luôn clear local)
      await authService.logout().catch(() => { });
    } finally {
      await storage.clearAll();
      set({ user: null, token: null, isAuthenticated: false });
    }
  },

  // ── Đăng ký ──────────────────────────────────────────────────────────────

  register: async (data: RegisterData): Promise<RegisterOtpResult> => {
    set({ isLoading: true });
    try {
      const result = await authService.register(data);
      return { targetIdentifier: result.targetIdentifier };
    } finally {
      set({ isLoading: false });
    }
  },

  verifyRegisterOtp: async ({ email, phone: _phone, otp, targetIdentifier }) => {
    set({ isLoading: true });
    try {
      await authService.verifyRegister({ email, otp, targetIdentifier });
    } finally {
      set({ isLoading: false });
    }
  },

  // ── Quên / Đặt lại mật khẩu ──────────────────────────────────────────────

  forgotPassword: async (email: string) => {
    set({ isLoading: true });
    try {
      await authService.forgotPassword(email);
    } finally {
      set({ isLoading: false });
    }
  },

  verifyResetToken: async (token: string) => {
    set({ isLoading: true });
    try {
      const result = await authService.verifyResetToken(token);
      return result;
    } finally {
      set({ isLoading: false });
    }
  },

  resetPassword: async (data: { token: string; newPassword: string }) => {
    set({ isLoading: true });
    try {
      await authService.resetPassword(data);
    } finally {
      set({ isLoading: false });
    }
  },

  // ── Đổi mật khẩu ─────────────────────────────────────────────────────────

  requestChangePasswordLink: async () => {
    set({ isLoading: true });
    try {
      await userService.requestChangePasswordLink();
    } finally {
      set({ isLoading: false });
    }
  },

  confirmChangePassword: async ({ token, newPassword }) => {
    set({ isLoading: true });
    try {
      await userService.confirmChangePassword({ token, newPassword });
    } finally {
      set({ isLoading: false });
    }
  },

  // ── Cập nhật profile ──────────────────────────────────────────────────────

  fetchProfile: async () => {
    set({ isLoading: true });
    try {
      const user = await userService.getProfile();
      await get().updateUser(user);
    } catch (error) {
      console.warn('Không thể lấy thông tin profile:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  updateProfile: async (data: EditProfileData): Promise<UpdateProfileResult> => {
    set({ isLoading: true });
    try {
      const result = await userService.updateProfile(data);
      const requiresOtp = !!result.requiresOtp;
      if (!requiresOtp) {
        const updatedUser = result.user || (result.id ? result : null);
        if (updatedUser) {
          await get().updateUser(updatedUser);
        }
      }
      return result as UpdateProfileResult;
    } finally {
      set({ isLoading: false });
    }
  },

  verifyProfileOtp: async ({ otp, targetIdentifier, tempData }) => {
    set({ isLoading: true });
    try {
      const api = (await import('../utils/api')).default;
      const { ENDPOINTS } = await import('../constants/endpoints');
      const response = await api.post(ENDPOINTS.USER.PROFILE + '/verify-otp', {
        otp,
        targetIdentifier,
        tempData,
      });
      const updatedUser: User = response.data.data?.user ?? response.data.user;
      if (updatedUser) await get().updateUser(updatedUser);
    } finally {
      set({ isLoading: false });
    }
  },

  // ── Xóa tài khoản ────────────────────────────────────────────────────────

  requestDeleteAccountLink: async (password: string) => {
    set({ isLoading: true });
    try {
      await userService.requestDeleteAccountLink(password);
    } finally {
      set({ isLoading: false });
    }
  },

  confirmDeleteAccount: async (token: string) => {
    set({ isLoading: true });
    try {
      await userService.confirmDeleteAccount(token);
      await storage.clearAll();
      set({ user: null, token: null, isAuthenticated: false });
    } finally {
      set({ isLoading: false });
    }
  },
}));
