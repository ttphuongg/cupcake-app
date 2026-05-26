import { Router } from 'express';
import { reviewController } from '../controllers/review.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
const router = Router();
// Yêu cầu đăng nhập cho tất cả thao tác đánh giá
router.use(authMiddleware);
router.post('/:productId', reviewController.createReview);
router.patch('/:id', reviewController.updateReview);
router.delete('/:id', reviewController.deleteReview);
export default router;
//# sourceMappingURL=review.routes.js.map