import { categoryModel } from '../models/categoryModel.js';
export const categoryService = {
    getAllCategories: async () => {
        // Chỉ lấy danh mục đang active cho user
        const categories = await categoryModel.findAllActive();
        return categories;
    }
};
//# sourceMappingURL=category.service.js.map