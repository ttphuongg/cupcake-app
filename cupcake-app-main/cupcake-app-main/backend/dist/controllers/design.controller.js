import { designService } from '../services/design.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
export const designController = {
    getAvailableIngredients: async (req, res, next) => {
        try {
            const data = await designService.getAvailableIngredients();
            return ApiResponse.success(res, 'Lấy danh sách nguyên liệu thành công', data);
        }
        catch (error) {
            next(error);
        }
    },
    calculateCustomPrice: async (req, res, next) => {
        try {
            const { ingredientIds } = req.body;
            if (!ingredientIds || !Array.isArray(ingredientIds)) {
                return ApiResponse.error(res, 'Danh sách ID nguyên liệu không hợp lệ', 400);
            }
            const data = await designService.calculateCustomPrice(ingredientIds);
            return ApiResponse.success(res, 'Tính giá thành công', data);
        }
        catch (error) {
            next(error);
        }
    }
};
//# sourceMappingURL=design.controller.js.map