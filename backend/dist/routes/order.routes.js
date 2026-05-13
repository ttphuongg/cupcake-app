import { Router } from 'express';
import { orderController } from '../controllers/order.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
const router = Router();
// Đơn hàng luôn yêu cầu đăng nhập
router.use(authMiddleware);
// Checkout đơn hàng
router.post('/checkout', orderController.checkoutOrder);
// Quản lý lịch sử đơn hàng
router.get('/', orderController.getOrderHistory);
router.get('/:id', orderController.getOrderDetails);
router.post('/:id/cancel', orderController.cancelOrder);
router.post('/:id/reorder', orderController.reorder);
export default router;
//# sourceMappingURL=order.routes.js.map