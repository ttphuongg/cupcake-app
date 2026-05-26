import { Router } from 'express';
import { productController } from '../controllers/product.controller.js';
const router = Router();
// Lọc & Tra cứu sản phẩm (Public)
router.get('/search', productController.searchProducts);
// Lấy chi tiết sản phẩm (Public)
router.get('/:id', productController.getProductDetails);
export default router;
//# sourceMappingURL=product.routes.js.map