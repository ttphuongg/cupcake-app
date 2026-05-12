import { Request, Response } from 'express';
import { reviewService } from '../services/review.service.js';

export const reviewController = {
    createReview: async (req: Request, res: Response) => {
        try {
            const userId = (req as any).user.id;
            const productId = Number(req.params.productId);
            const { rating, comment, image } = req.body;

            if (!productId) throw new Error('ID sản phẩm không hợp lệ');

            const result = await reviewService.createReview(userId, productId, { rating, comment, image });
            res.status(201).json({ success: true, message: result.message, data: { reviewId: result.reviewId } });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    },

    updateReview: async (req: Request, res: Response) => {
        try {
            const userId = (req as any).user.id;
            const reviewId = Number(req.params.id);
            const { rating, comment, image } = req.body;

            if (!reviewId) throw new Error('ID đánh giá không hợp lệ');

            const result = await reviewService.updateReview(userId, reviewId, { rating, comment, image });
            res.status(200).json({ success: true, message: result.message });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    },

    deleteReview: async (req: Request, res: Response) => {
        try {
            const userId = (req as any).user.id;
            const reviewId = Number(req.params.id);

            if (!reviewId) throw new Error('ID đánh giá không hợp lệ');

            const result = await reviewService.deleteReview(userId, reviewId);
            res.status(200).json({ success: true, message: result.message });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    }
};
