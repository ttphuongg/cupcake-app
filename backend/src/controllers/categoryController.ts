import { Request, Response } from 'express';
import { categoryService } from '../services/categoryService.js';

export const categoryController = {
    getAllCategories: async (_req: Request, res: Response) => {
        try {
            const categories = await categoryService.getAllCategories();
            res.status(200).json({
                success: true,
                message: 'Lấy danh sách danh mục thành công',
                data: categories
            });
        } catch (error: any) {
            console.error('Error fetching categories:', error);
            res.status(500).json({
                success: false,
                message: 'Lỗi server khi lấy danh sách danh mục',
                error: error.message
            });
        }
    }
};
