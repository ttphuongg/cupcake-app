import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ApiResponse } from '../utils/ApiResponse.js';
import { userModel } from '../models/index.js';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return ApiResponse.error(res, 'Vui lòng đăng nhập để tiếp tục', 401);
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET) as Express.JwtPayload;
        
        const user = await userModel.findById(decoded.id);
        if (!user) {
            return ApiResponse.error(res, 'Tài khoản không tồn tại hoặc đã bị khóa', 401);
        }

        req.user = decoded;
        
        next();
    } catch (error) {
        return ApiResponse.error(res, 'Phiên đăng nhập không hợp lệ hoặc đã hết hạn', 401);
    }
};
