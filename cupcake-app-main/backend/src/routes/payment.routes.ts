import { Router } from 'express';
import { paymentController } from '../controllers/payment.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

// Webhook không yêu cầu token đăng nhập vì do server của Ví điện tử gọi
router.post('/webhook', paymentController.handleWebhook);

// Các thao tác thanh toán từ app yêu cầu đăng nhập
router.use(authMiddleware);

router.post('/:orderId/process', paymentController.processPayment);
router.get('/:orderId/verify', paymentController.verifyPayment);

export default router;
