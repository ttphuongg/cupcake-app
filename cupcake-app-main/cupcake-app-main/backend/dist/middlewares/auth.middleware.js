import jwt from 'jsonwebtoken';
import { ApiResponse } from '../utils/ApiResponse.js';
const JWT_SECRET = process.env.JWT_SECRET || 'secret';
export const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return ApiResponse.error(res, 'Vui lòng đăng nhập để tiếp tục', 401);
        }
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        return ApiResponse.error(res, 'Phiên đăng nhập không hợp lệ hoặc đã hết hạn', 401);
    }
};
//# sourceMappingURL=auth.middleware.js.map