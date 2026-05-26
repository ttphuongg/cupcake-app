import { productModel } from '../models/index.js';

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
            throw new Error('Sản phẩm không tồn tại hoặc đã ngừng kinh doanh');
        }

        // Kiểm tra trạng thái tồn kho (Còn hàng/Tạm hết)
        const stockStatus = (product.stock && product.stock > 0) ? 'Còn hàng' : 'Tạm hết hàng';

        return {
            ...product,
            stockStatus
        };
    }
};
