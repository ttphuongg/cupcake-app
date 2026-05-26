import { Router } from 'express';
import { categoryController } from '../controllers/categoryController.js';
const router = Router();
// GET /api/v1/categories/
router.get('/', categoryController.getAllCategories);
export default router;
//# sourceMappingURL=categoryRoutes.js.map