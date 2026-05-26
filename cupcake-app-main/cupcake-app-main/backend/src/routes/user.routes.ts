import { Router } from 'express';
import { userController } from '../controllers/user.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

// Route xóa tài khoản bằng token từ email (không yêu cầu đăng nhập)
router.post('/delete-account', userController.deleteAccount);

// Tất cả các route quản lý tài khoản đều yêu cầu đăng nhập
router.use(authMiddleware);

router.get('/profile', userController.getProfile);
router.patch('/profile', userController.updateProfile);
router.post('/change-password-otp', userController.requestChangePasswordOtp);
router.post('/change-password', userController.changePassword);
router.post('/delete-account-link', userController.requestDeleteAccountLink);

export default router;
