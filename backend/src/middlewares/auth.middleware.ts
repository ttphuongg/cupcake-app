import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        
        // Kiểm tra xem header Authorization có tồn tại và bắt đầu bằng "Bearer " hay không
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ success: false, message: 'Vui lòng đăng nhập để tiếp tục' });
            return;
        }

        // Lấy token từ chuỗi "Bearer <token>"
        const token = authHeader.split(' ')[1];
        
        // Giải mã token
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Lưu thông tin user vào req để các controller phía sau sử dụng
        (req as any).user = decoded;
        
        next();
    } catch (error) {
        // Token sai hoặc đã hết hạn
        res.status(401).json({ success: false, message: 'Phiên đăng nhập không hợp lệ hoặc đã hết hạn' });
    }
};
