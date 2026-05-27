import { Router } from 'express';
import { userController } from '../controllers/user.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

// Các API xác nhận bằng token từ Email (Không yêu cầu đăng nhập Session)
router.post('/change-password-confirm', userController.confirmChangePassword);
router.post('/delete-account-confirm', userController.confirmDeleteAccount);

// Tất cả các route quản lý tài khoản bên dưới đều yêu cầu đăng nhập
router.use(authMiddleware);

router.get('/profile', userController.getProfile);
router.patch('/profile', userController.updateProfile);
router.post('/change-password-link', userController.requestChangePasswordLink);
router.post('/delete-account-link', userController.requestDeleteAccountLink);

export default router;
