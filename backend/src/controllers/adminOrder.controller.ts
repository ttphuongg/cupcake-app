import { Request, Response, NextFunction } from 'express';
import pool from '../config/db.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { orderItemModel } from '../models/orderItemModel.js';

const normalizeStatus = (status: string) => {
  const value = status?.toString().trim().toUpperCase();
  switch (value) {
    case 'PENDING':
      return 'pending';
    case 'CONFIRMED':
      return 'confirmed';
    case 'CANCELLED':
    case 'REJECTED':
      return 'rejected';
    case 'PROCESSING':
      return 'processing';
    case 'SHIPPING':
      return 'shipping';
    case 'COMPLETED':
      return 'completed';
    default:
      return value?.toLowerCase() || 'unknown';
  }
};

const mapStatusToDb = (status: string) => {
  const value = status?.toString().trim().toLowerCase();
  if (value === 'pending') return 'PENDING';
  if (value === 'confirmed') return 'CONFIRMED';
  if (value === 'rejected' || value === 'cancelled' || value === 'cancel') return 'CANCELLED';
  if (value === 'processing') return 'PROCESSING';
  if (value === 'shipping') return 'SHIPPING';
  if (value === 'completed') return 'COMPLETED';
  return null;
};

export const adminOrderController = {
  getAllOrders: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const [ordersResult] = await pool.query(
        `SELECT o.id, o.user_id, o.total_price, o.status, o.created_at, u.name AS customer_name
         FROM Orders o
         LEFT JOIN Users u ON o.user_id = u.id
         ORDER BY (o.status = 'PENDING') DESC, o.created_at DESC`
      );

      const orders = ordersResult as any[];

      const ordersWithProducts = await Promise.all(
        orders.map(async (order) => {
          const products = await orderItemModel.findByOrderId(order.id);
          return {
            id: order.id,
            user_id: order.user_id,
            customer_name: order.customer_name || `Khách #${order.user_id}`,
            total_price: order.total_price,
            status: normalizeStatus(order.status),
            created_at: order.created_at,
            products: products.map((item) => ({
              name: item.product_name,
              quantity: item.quantity,
              price: item.price,
            })),
          };
        })
      );

      return ApiResponse.success(res, 'Lấy danh sách đơn hàng thành công', ordersWithProducts);
    } catch (error) {
      next(error);
    }
  },

  updateOrderStatus: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orderId = Number(req.params.id);
      const { status } = req.body;

      if (!orderId || !status) {
        return ApiResponse.error(res, 'ID đơn hàng và trạng thái mới là bắt buộc', 400);
      }

      const dbStatus = mapStatusToDb(status);
      if (!dbStatus) {
        return ApiResponse.error(res, 'Trạng thái đơn hàng không hợp lệ', 400);
      }

      const [result]: any = await pool.execute(
        'UPDATE Orders SET status = ? WHERE id = ?',
        [dbStatus, orderId]
      );

      if (result.affectedRows === 0) {
        return ApiResponse.error(res, 'Không tìm thấy đơn hàng để cập nhật', 404);
      }

      return ApiResponse.success(res, 'Cập nhật trạng thái đơn hàng thành công');
    } catch (error) {
      next(error);
    }
  },
};
