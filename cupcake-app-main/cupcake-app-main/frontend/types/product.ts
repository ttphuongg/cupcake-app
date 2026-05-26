import { Review } from './review';

export interface Product {
    id?: number;
    name: string;
    price: number;
    description?: string | null;
    stock?: number;
    is_active?: number; // 0 | 1
    is_custom?: number; // 0 | 1
    category_id?: number | null;
    image?: string | null;
    category_name?: string; // Kèm theo khi JOIN với Categories
    average_rating?: number | null;
    reviews?: Review[]; // Kèm theo khi JOIN với Reviews
    created_at?: string;
    updated_at?: string;
}
