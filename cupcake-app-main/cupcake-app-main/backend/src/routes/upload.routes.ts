import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import fs from 'fs';

const router = Router();

// Cấu hình lưu trữ file
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = 'uploads/avatars';
        // Tạo thư mục nếu chưa tồn tại
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, 'avatar-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // Giới hạn 2MB
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Chỉ cho phép upload ảnh (jpg, jpeg, png)'));
    }
});

// Endpoint upload ảnh đại diện
router.post('/avatar', authMiddleware, upload.single('avatar'), (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return ApiResponse.error(res, 'Vui lòng chọn ảnh để upload', 400);
        }

        // Tạo URL cho ảnh (giả định server chạy ở địa chỉ này)
        // Lưu ý: Trong thực tế bạn cần cấu hình domain/IP tĩnh
        const avatarUrl = `/uploads/avatars/${req.file.filename}`;

        return ApiResponse.success(res, 'Upload ảnh thành công', { avatarUrl });
    } catch (error: any) {
        return ApiResponse.error(res, error.message, 500);
    }
});

export default router;
