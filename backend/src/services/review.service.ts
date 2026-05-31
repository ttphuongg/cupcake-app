import { reviewModel } from '../models/index.js';
import pool from '../config/db.js';

export const reviewService = {
    createReview: async (userId: number, productId: number, orderId: number, reviewData: { rating: number; comment?: string; image?: string }) => {
        if (!reviewData.rating || reviewData.rating < 1 || reviewData.rating > 5) {
            throw new Error('Vui lòng chọn số sao hợp lệ từ 1 đến 5');
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
            throw new Error('Bạn cần mua và nhận hàng thành công để đánh giá');
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
            throw new Error('Bạn đã đánh giá đơn hàng này rồi');
        }

        return { reviewId: lastReviewId, message: 'Đánh giá đơn hàng thành công' };
    },

    updateReview: async (userId: number, reviewId: number, newData: { rating?: number; comment?: string; image?: string }) => {
        if (newData.rating && (newData.rating < 1 || newData.rating > 5)) {
            throw new Error('Vui lòng chọn số sao hợp lệ từ 1 đến 5');
        }

        // Lấy lại dữ liệu đánh giá cũ
        const review = await reviewModel.findById(reviewId);

        if (!review) {
            throw new Error('Đánh giá không tồn tại');
        }

        // Xác thực quyền sở hữu
        if (review.user_id !== userId) {
            throw new Error('Bạn không có quyền sửa đánh giá này');
        }

        // Lưu đè các thông số mới được sửa
        await reviewModel.update(reviewId, newData);

        return { message: 'Cập nhật đánh giá thành công' };
    },

    deleteReview: async (userId: number, reviewId: number) => {
        const review = await reviewModel.findById(reviewId);

        if (!review) {
            throw new Error('Đánh giá không tồn tại');
        }

        // Kiểm tra quyền sở hữu bài đánh giá của user
        if (review.user_id !== userId) {
            throw new Error('Bạn không có quyền xóa đánh giá này');
        }

        // Thực hiện xóa khỏi DB
        await reviewModel.delete(reviewId);

        return { message: 'Xóa đánh giá thành công' };
    }
};
