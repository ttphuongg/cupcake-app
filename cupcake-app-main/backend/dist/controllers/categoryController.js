import { categoryService } from '../services/categoryService.js';
import { ApiResponse } from '../utils/ApiResponse.js';
export const categoryController = {
    getAllCategories: async (_req, res, next) => {
        try {
            const categories = await categoryService.getAllCategories();
            return ApiResponse.success(res, 'Lấy danh sách danh mục thành công', categories);
        }
        catch (error) {
            next(error);
        }
    }
};
//# sourceMappingURL=categoryController.js.map