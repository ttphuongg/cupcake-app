import { productModel, reviewModel } from '../models/index.js';

export const productService = {
    searchProducts: async (filters: { keyword?: string; categoryId?: number; minPrice?: number; maxPrice?: number }) => {
        // Truy vấn DB để lấy danh sách sản phẩm theo từ khóa tìm kiếm, bộ lọc (giá, danh mục)
        const products = await productModel.search(
            filters.keyword,
            filters.categoryId,
            filters.minPrice,
            filters.maxPrice
        );
        return products;
    },

    getProductDetails: async (productId: number) => {
        // Lấy đầy đủ thông tin (ảnh, mô tả, giá)
        const product = await productModel.findById(productId);

        if (!product) {
            const err = new Error('Sản phẩm không tồn tại hoặc đã ngừng kinh doanh');
            (err as any).statusCode = 404;
            throw err;
        }

        // Kiểm tra trạng thái tồn kho (Còn hàng/Tạm hết)
        const stockStatus = (product.stock && product.stock > 0) ? 'Còn hàng' : 'Tạm hết hàng';

        // Lấy danh sách đánh giá của sản phẩm
        const reviews = await reviewModel.findByProductId(productId);

        return {
            ...product,
            stockStatus,
            reviews
        };
    }
};
