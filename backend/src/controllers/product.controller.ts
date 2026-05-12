import { Request, Response } from 'express';
import { productService } from '../services/product.service.js';

export const productController = {
    searchProducts: async (req: Request, res: Response) => {
        try {
            const { keyword, categoryId, minPrice, maxPrice } = req.query;
            
            const filters = {
                keyword: keyword ? String(keyword) : undefined,
                categoryId: categoryId ? Number(categoryId) : undefined,
                minPrice: minPrice ? Number(minPrice) : undefined,
                maxPrice: maxPrice ? Number(maxPrice) : undefined
            };

            const data = await productService.searchProducts(filters);
            res.status(200).json({ success: true, message: 'Lấy danh sách sản phẩm thành công', data });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    getProductDetails: async (req: Request, res: Response) => {
        try {
            const productId = Number(req.params.id);
            if (!productId) throw new Error('ID sản phẩm không hợp lệ');

            const data = await productService.getProductDetails(productId);
            res.status(200).json({ success: true, message: 'Lấy chi tiết sản phẩm thành công', data });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    }
};
