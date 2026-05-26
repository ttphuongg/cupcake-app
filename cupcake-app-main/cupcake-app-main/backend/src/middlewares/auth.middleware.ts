import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ApiResponse } from '../utils/ApiResponse.js';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return ApiResponse.error(res, 'Vui lòng đăng nhập để tiếp tục', 401);
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        
        req.user = decoded as any;
        
        next();
    } catch (error) {
        return ApiResponse.error(res, 'Phiên đăng nhập không hợp lệ hoặc đã hết hạn', 401);
    }
};
