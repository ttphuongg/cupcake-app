// Barrel export — import mọi model từ một chỗ duy nhất
// Ví dụ: import { userModel, productModel } from '../models/index.js';

export { userModel } from './userModel.js';
export type { User } from './userModel.js';

export { categoryModel } from './categoryModel.js';
export type { Category } from './categoryModel.js';

export { productModel } from './productModel.js';
export type { Product } from './productModel.js';

export { reviewModel } from './reviewModel.js';
export type { Review } from './reviewModel.js';

export { otpModel } from './otpModel.js';
export type { Otp, OtpType } from './otpModel.js';

export { cartModel } from './cartModel.js';
export type { Cart } from './cartModel.js';

export { cartItemModel } from './cartItemModel.js';
export type { CartItem } from './cartItemModel.js';

export { orderModel } from './orderModel.js';
export type { Order } from './orderModel.js';

export { orderItemModel } from './orderItemModel.js';
export type { OrderItem } from './orderItemModel.js';

export { ingredientModel } from './ingredientModel.js';
export type { Ingredient } from './ingredientModel.js';
