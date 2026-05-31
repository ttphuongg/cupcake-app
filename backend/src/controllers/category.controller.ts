import { Request, Response, NextFunction } from 'express';
import { categoryService } from '../services/category.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const categoryController = {
    getAllCategories: async (_req: Request, res: Response, next: NextFunction) => {
        try {
            const categories = await categoryService.getAllCategories();
            return ApiResponse.success(res, 'Lấy danh sách danh mục thành công', categories);
        } catch (error: unknown) {
            next(error);
        }
    }
};
