import { productService } from '../services/product.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
export const productController = {
    searchProducts: async (req, res, next) => {
        try {
            const { keyword, categoryId, minPrice, maxPrice } = req.query;
            const filters = {
                keyword: keyword ? String(keyword) : undefined,
                categoryId: categoryId ? Number(categoryId) : undefined,
                minPrice: minPrice ? Number(minPrice) : undefined,
                maxPrice: maxPrice ? Number(maxPrice) : undefined
            };
            const data = await productService.searchProducts(filters);
            return ApiResponse.success(res, 'Lấy danh sách sản phẩm thành công', data);
        }
        catch (error) {
            next(error);
        }
    },
    getProductDetails: async (req, res, next) => {
        try {
            const productId = Number(req.params.id);
            if (!productId) {
                return ApiResponse.error(res, 'ID sản phẩm không hợp lệ', 400);
            }
            const data = await productService.getProductDetails(productId);
            return ApiResponse.success(res, 'Lấy chi tiết sản phẩm thành công', data);
        }
        catch (error) {
            next(error);
        }
    }
};
//# sourceMappingURL=product.controller.js.map