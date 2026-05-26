import { reviewService } from '../services/review.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
export const reviewController = {
    createReview: async (req, res, next) => {
        try {
            const userId = req.user?.id;
            if (!userId)
                throw new Error('Không xác định được người dùng');
            const productId = Number(req.params.productId);
            const { rating, comment, image } = req.body;
            if (!productId) {
                return ApiResponse.error(res, 'ID sản phẩm không hợp lệ', 400);
            }
            const result = await reviewService.createReview(userId, productId, { rating, comment, image });
            return ApiResponse.success(res, result.message, { reviewId: result.reviewId }, 201);
        }
        catch (error) {
            next(error);
        }
    },
    updateReview: async (req, res, next) => {
        try {
            const userId = req.user?.id;
            if (!userId)
                throw new Error('Không xác định được người dùng');
            const reviewId = Number(req.params.id);
            const { rating, comment, image } = req.body;
            if (!reviewId) {
                return ApiResponse.error(res, 'ID đánh giá không hợp lệ', 400);
            }
            const result = await reviewService.updateReview(userId, reviewId, { rating, comment, image });
            return ApiResponse.success(res, result.message);
        }
        catch (error) {
            next(error);
        }
    },
    deleteReview: async (req, res, next) => {
        try {
            const userId = req.user?.id;
            if (!userId)
                throw new Error('Không xác định được người dùng');
            const reviewId = Number(req.params.id);
            if (!reviewId) {
                return ApiResponse.error(res, 'ID đánh giá không hợp lệ', 400);
            }
            const result = await reviewService.deleteReview(userId, reviewId);
            return ApiResponse.success(res, result.message);
        }
        catch (error) {
            next(error);
        }
    }
};
//# sourceMappingURL=review.controller.js.map