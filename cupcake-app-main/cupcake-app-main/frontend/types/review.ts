export interface Review {
    id?: number;
    user_id: number;
    product_id: number;
    rating: number; // 1 - 5
    comment?: string | null;
    image?: string | null;
    user_name?: string; // Tên user khi JOIN
    created_at?: string;
}
