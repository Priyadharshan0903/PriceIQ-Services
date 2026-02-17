import { Router } from 'express';
import { OrderController } from '../controllers/order.controller';
import { authenticate } from '@bestbuy/shared';

const router = Router();
const orderController = new OrderController();

router.post('/orders', authenticate, orderController.createOrder);
router.get('/orders', authenticate, orderController.getOrders);
router.get('/orders/:orderId', authenticate, orderController.getOrderById);
router.put('/orders/:orderId/status', authenticate, orderController.updateOrderStatus);

export default router;
