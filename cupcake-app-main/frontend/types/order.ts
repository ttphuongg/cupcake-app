import { OrderItem } from './orderItem';

export interface Order {
    id?: number;
    user_id: number;
    subtotal: number;
    discount: number;
    total_price: number;
    status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPING' | 'COMPLETED' | 'CANCELLED';
    payment_method: 'COD' | 'BANKING' | 'MOMO';
    payment_status: 'UNPAID' | 'PAID' | 'REFUNDED';
    address: string;
    phone: string;
    note?: string;
    items?: OrderItem[]; // Trả về kèm chi tiết đơn hàng
    created_at?: string;
    updated_at?: string;
}

export interface OrderDetail {
  id: number;
  status: Order['status'];
  created_at: string;
  phone: string;
  address: string;
  subtotal: number;
  total_price: number;
  items: Array<{
    id?: number;
    product_id?: number | null;
    product_name: string;
    product_image?: string | null;
    quantity: number;
    price: number;
    custom_data?: any;
  }>;
}
