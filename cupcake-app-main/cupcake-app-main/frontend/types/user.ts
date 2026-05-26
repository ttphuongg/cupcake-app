export interface User {
    id?: number;
    name: string;
    email: string;
    phone?: string | null;
    password?: string;
    address?: string | null;
    is_verified?: number; // 0 | 1
    created_at?: string;
    updated_at?: string;
}
