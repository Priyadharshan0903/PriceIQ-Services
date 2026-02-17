import { Router } from 'express';
import { CartController } from '../controllers/cart.controller';
import { authenticate } from '@bestbuy/shared';

const router = Router();
const cartController = new CartController();

router.get('/cart', authenticate, cartController.getCart);
router.post('/cart/add', authenticate, cartController.addItem);
router.put('/cart/update', authenticate, cartController.updateItem);
router.delete('/cart/remove/:productId', authenticate, cartController.removeItem);
router.delete('/cart/clear', authenticate, cartController.clearCart);

export default router;
