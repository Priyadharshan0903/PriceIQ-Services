import { Router } from 'express';
import { ProductController } from '../controllers/product.controller';

const router = Router();
const productController = new ProductController();

router.get('/products', productController.getProducts);
router.get('/products/:id', productController.getProductById);
router.post('/products/search', productController.searchProducts);
router.get('/categories', productController.getCategories);
router.get('/products/:id/specifications', productController.getProductSpecifications);
router.get('/brands', productController.getBrands);

export default router;
