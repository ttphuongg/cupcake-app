import { Request, Response } from 'express';
import { designService } from '../services/design.service.js';

export const designController = {
    getAvailableIngredients: async (req: Request, res: Response) => {
        try {
            const data = await designService.getAvailableIngredients();
            res.status(200).json({ success: true, message: 'Lấy danh sách nguyên liệu thành công', data });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    calculateCustomPrice: async (req: Request, res: Response) => {
        try {
            const { ingredientIds } = req.body;

            if (!ingredientIds || !Array.isArray(ingredientIds)) {
                throw new Error('Danh sách ID nguyên liệu không hợp lệ');
            }

            const data = await designService.calculateCustomPrice(ingredientIds);
            res.status(200).json({ success: true, message: 'Tính giá thành công', data });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    }
};
