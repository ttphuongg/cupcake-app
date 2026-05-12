export interface OrderItem {
    id?: number;
    order_id: number;
    product_id?: number | null;
    product_name: string;
    quantity: number;
    price: number;
    custom_data?: any; // Dữ liệu mix bánh tuỳ chỉnh
}
