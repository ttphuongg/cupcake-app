import { BASE_URL } from './config';

export const ENDPOINTS = {
  // AUTH
  AUTH: {
    REGISTER: `${BASE_URL}/auth/register`,
    VERIFY_REGISTER: `${BASE_URL}/auth/verify-register`,
    LOGIN: `${BASE_URL}/auth/login`,
    FORGOT_PASSWORD: `${BASE_URL}/auth/forgot-password`,
    RESET_PASSWORD: `${BASE_URL}/auth/reset-password`,
    LOGOUT: `${BASE_URL}/auth/logout`,
  },

  // USER PROFILE
  USER: {
    PROFILE: `${BASE_URL}/user/profile`,
    REQUEST_CHANGE_PASSWORD_OTP: `${BASE_URL}/user/change-password-otp`,
    CHANGE_PASSWORD: `${BASE_URL}/user/change-password`,
    REQUEST_DELETE_ACCOUNT_OTP: `${BASE_URL}/user/delete-account-otp`,
    DELETE_ACCOUNT: `${BASE_URL}/user/delete-account`,
  },

  // PRODUCTS
  PRODUCTS: {
    SEARCH: `${BASE_URL}/products/search`,
    DETAILS: (id: number | string) => `${BASE_URL}/products/${id}`,
  },

  // CATEGORIES
  CATEGORIES: {
    LIST: `${BASE_URL}/categories`,
  },

  // CUSTOM DESIGN
  DESIGN: {
    INGREDIENTS: `${BASE_URL}/design/ingredients`,
    CALCULATE_PRICE: `${BASE_URL}/design/calculate-price`,
  },

  // CART
  CART: {
    GET_CART: `${BASE_URL}/cart`,
    ADD_TO_CART: `${BASE_URL}/cart`,
    UPDATE_QUANTITY: (id: number | string) => `${BASE_URL}/cart/${id}`,
    REMOVE_ITEM: (id: number | string) => `${BASE_URL}/cart/${id}`,
  },

  // ORDERS
  ORDERS: {
    HISTORY: `${BASE_URL}/orders`,
    CHECKOUT: `${BASE_URL}/orders/checkout`,
    DETAILS: (id: number | string) => `${BASE_URL}/orders/${id}`,
    CANCEL: (id: number | string) => `${BASE_URL}/orders/${id}/cancel`,
    REORDER: (id: number | string) => `${BASE_URL}/orders/${id}/reorder`,
  },

  // PAYMENT
  PAYMENT: {
    WEBHOOK: `${BASE_URL}/payment/webhook`,
    PROCESS: (orderId: number | string) => `${BASE_URL}/payment/${orderId}/process`,
    VERIFY: (orderId: number | string) => `${BASE_URL}/payment/${orderId}/verify`,
  },

  //REVIEWS 
  REVIEWS: {
    CREATE: (productId: number | string) => `${BASE_URL}/reviews/${productId}`,
    UPDATE: (id: number | string) => `${BASE_URL}/reviews/${id}`,
    DELETE: (id: number | string) => `${BASE_URL}/reviews/${id}`,
  }
} as const;