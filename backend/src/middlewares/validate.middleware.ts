import { Request, Response, NextFunction } from 'express';
import { AnyZodObject } from 'zod';

export const validateMiddleware = (schema: AnyZodObject) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Sử dụng schema để validate req.body
            await schema.parseAsync(req.body);
            next();
        } catch (error: any) {
            // Nếu dữ liệu sai, trả về lỗi 400 kèm chi tiết các trường bị lỗi
            res.status(400).json({
                success: false,
                message: 'Dữ liệu đầu vào không hợp lệ',
                errors: error.errors
            });
        }
    };
};
