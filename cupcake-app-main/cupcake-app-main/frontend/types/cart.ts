export interface Cart {
    id?: number;
    user_id: number;
}

export interface AddToCartPayload {
  productId?: number;
  quantity?: number;
  designData?: Record<string, unknown>;
  customData?: string | Record<string, unknown>;
}
