export interface Ingredient {
    id?: number;
    name: string;
    type: 'SIZE' | 'SUGAR' | 'BASE' | 'FILLING' | 'FROSTING' | 'TOPPING';
    price: number; 
    image_url?: string | null;
    is_active: boolean; 
    priority: number;  
}