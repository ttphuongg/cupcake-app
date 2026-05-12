import { Router } from 'express';
import { userController } from '../controllers/user.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

// Tất cả các route quản lý tài khoản đều yêu cầu đăng nhập
router.use(authMiddleware);

router.get('/profile', userController.getProfile);
router.patch('/profile', userController.updateProfile);
router.post('/change-password-otp', userController.requestChangePasswordOtp);
router.post('/change-password', userController.changePassword);
router.post('/delete-account-otp', userController.requestDeleteAccountOtp);
router.post('/delete-account', userController.deleteAccount);

export default router;
