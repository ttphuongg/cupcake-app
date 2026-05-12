import { CartItem } from '../types/cartItem';

/**
 * Đếm tổng số lượng bánh đang có trong giỏ hàng (để hiển thị Badge trên icon Cart)
 */
export const calculateCartTotalItems = (items: CartItem[]): number => {
  return items.reduce((total, item) => total + item.quantity, 0);
};

/**
 * Tính tổng tiền (subtotal) của các sản phẩm trong giỏ hàng.
 * @param items Danh sách CartItem
 * @param getProductPrice Hàm callback để lấy ra giá của 1 product (do CartItem đôi khi chỉ chứa product_id)
 */
export const calculateCartSubtotal = (
  items: CartItem[], 
  getProductPrice: (productId: number) => number
): number => {
  return items.reduce((total, item) => {
    if (!item.product_id) return total; // Bỏ qua bánh custom không có product_id chuẩn
    const price = getProductPrice(item.product_id) || 0;
    return total + (price * item.quantity);
  }, 0);
};
