import { Router } from 'express';
import { cartController } from '../controllers/cart.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
const router = Router();
// Quản lý giỏ hàng yêu cầu đăng nhập
router.use(authMiddleware);
router.get('/', cartController.getCart);
router.post('/', cartController.addToCart);
router.post('/custom', cartController.addCustomToCart);
router.patch('/:id', cartController.updateQuantity);
router.delete('/:id', cartController.removeFromCart);
export default router;
//# sourceMappingURL=cart.routes.js.map