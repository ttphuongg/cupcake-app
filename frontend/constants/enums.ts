export enum IngredientType {
  SIZE = 'SIZE',
  SUGAR = 'SUGAR',
  BASE = 'BASE',
  FILLING = 'FILLING',
  FROSTING = 'FROSTING',
  TOPPING = 'TOPPING',
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PROCESSING = 'PROCESSING',
  SHIPPING = 'SHIPPING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum PaymentMethod {
  COD = 'COD',
  BANKING = 'BANKING',
  MOMO = 'MOMO',
}

export enum PaymentStatus {
  UNPAID = 'UNPAID',
  PAID = 'PAID',
  REFUNDED = 'REFUNDED',
}
