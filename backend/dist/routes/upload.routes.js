import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ApiResponse } from '../utils/ApiResponse.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = Router();
// Hỗ trợ upload ảnh dạng Base64
router.post('/', authMiddleware, async (req, res, next) => {
    try {
        const { image } = req.body; // Chuỗi base64
        if (!image) {
            throw new Error('Vui lòng cung cấp dữ liệu hình ảnh (Base64)');
        }
        // Định dạng base64: data:image/jpeg;base64,...
        const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        if (!matches || matches.length !== 3) {
            throw new Error('Định dạng hình ảnh không hợp lệ. Vui lòng gửi định dạng Base64 chuẩn (data:image/...;base64,...)');
        }
        const type = matches[1];
        const buffer = Buffer.from(matches[2], 'base64');
        const ext = type.split('/')[1] || 'jpg';
        const fileName = `avatar_${req.user?.id || 'temp'}_${Date.now()}.${ext}`;
        const uploadsDir = path.join(__dirname, '../../uploads');
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }
        const filePath = path.join(uploadsDir, fileName);
        fs.writeFileSync(filePath, buffer);
        // Link ảnh trả về động theo host
        const host = req.get('host');
        const protocol = req.protocol; // http hoặc https
        const avatarUrl = `${protocol}://${host}/uploads/${fileName}`;
        return ApiResponse.success(res, 'Tải ảnh lên thành công', { url: avatarUrl });
    }
    catch (error) {
        next(error);
    }
});
export default router;
//# sourceMappingURL=upload.routes.js.map