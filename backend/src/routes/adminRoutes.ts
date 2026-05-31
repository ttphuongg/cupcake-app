import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { adminOrderController } from '../controllers/adminOrder.controller.js';

const router = Router();

router.use(authMiddleware);
router.get('/orders', adminOrderController.getAllOrders);
router.put('/orders/:id/status', adminOrderController.updateOrderStatus);

export default router;
