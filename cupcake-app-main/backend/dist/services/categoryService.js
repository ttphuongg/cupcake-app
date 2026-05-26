import { categoryModel } from '../models/categoryModel.js';
export const categoryService = {
    getAllCategories: async () => {
        try {
            // Chỉ lấy danh mục đang active cho user
            const categories = await categoryModel.findAllActive();
            return categories;
        }
        catch (error) {
            throw error;
        }
    }
};
//# sourceMappingURL=categoryService.js.map