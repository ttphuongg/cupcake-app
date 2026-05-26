import { Router } from 'express';
import { categoryController } from '../controllers/category.controller.js';
const router = Router();
// GET /api/v1/categories/
router.get('/', categoryController.getAllCategories);
export default router;
//# sourceMappingURL=category.routes.js.map