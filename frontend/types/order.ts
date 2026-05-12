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
