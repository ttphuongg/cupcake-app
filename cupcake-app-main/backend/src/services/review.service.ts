import { reviewModel } from '../models/index.js';
import pool from '../config/db.js';

export const reviewService = {
    createReview: async (userId: number, productId: number, orderId: number, reviewData: { rating: number; comment?: string; image?: string }) => {
        if (!reviewData.rating || reviewData.rating < 1 || reviewData.rating > 5) {
            const err = new Error('Vui lòng chọn số sao hợp lệ từ 1 đến 5');
            (err as any).statusCode = 400;
            throw err;
        }

        // 1. Xác thực tài khoản này đã mua đơn hàng chứa sản phẩm hay chưa
        // Lấy danh sách tất cả sản phẩm trong đơn hàng
        const [rows] = await pool.query(`
            SELECT DISTINCT oi.product_id 
            FROM OrderItems oi
            JOIN Orders o ON oi.order_id = o.id
            WHERE o.id = ? AND o.user_id = ? AND o.status = 'COMPLETED'
        `, [orderId, userId]);

        const products = rows as any[];

        if (products.length === 0) {
            const err = new Error('Bạn cần mua và nhận hàng thành công để đánh giá');
            (err as any).statusCode = 400;
            throw err;
        }

        let createdCount = 0;
        let lastReviewId = 0;

        // 2. Tạo đánh giá cho TẤT CẢ sản phẩm trong đơn hàng
        for (const p of products) {
            const existingReview = await reviewModel.findByOrderAndProduct(orderId, p.product_id);
            if (!existingReview) {
                lastReviewId = await reviewModel.create({
                    user_id: userId,
                    product_id: p.product_id,
                    order_id: orderId,
                    rating: reviewData.rating,
                    comment: reviewData.comment,
                    image: reviewData.image
                });
                createdCount++;
            }
        }

        if (createdCount === 0) {
            const err = new Error('Bạn đã đánh giá đơn hàng này rồi');
            (err as any).statusCode = 400;
            throw err;
        }

        return { reviewId: lastReviewId, message: 'Đánh giá đơn hàng thành công' };
    }
};
