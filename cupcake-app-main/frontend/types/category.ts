export interface Category {
    id?: number;
    name: string;
    slug?: string | null;
    image?: string | null;
    is_active?: number; // 0 | 1
}
