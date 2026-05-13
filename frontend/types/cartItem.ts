export interface CartItem {
    id?: number;
    cart_id: number;
    product_id?: number | null;
    quantity: number;
    custom_data?: string | null;


    price?: number;
    product?: {
        id: number;
        name: string;
        image?: string | null;
        price: number;
    };
}
