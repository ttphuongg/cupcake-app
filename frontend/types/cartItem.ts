export interface CartItem {
    id?: number;
    cart_id: number;
    product_id?: number | null;   // null với bánh custom hoàn toàn
    quantity: number;
    custom_data?: string | null;  // JSON string chứa cấu hình bánh custom

    // --- Fields từ backend JOIN (có khi fetch giỏ hàng) ---
    price?: number;               // Giá đơn vị (từ product hoặc custom_data)
    product?: {
        id: number;
        name: string;
        image?: string | null;
        price: number;
    };
}
