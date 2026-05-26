import { Router } from 'express';
import { designController } from '../controllers/design.controller.js';

const router = Router();

// Lấy danh sách nguyên liệu để thiết kế (Public)
router.get('/ingredients', designController.getAvailableIngredients);

// Tính tổng tiền dựa trên các nguyên liệu đã chọn (Public)
router.post('/calculate-price', designController.calculateCustomPrice);



export default router;
