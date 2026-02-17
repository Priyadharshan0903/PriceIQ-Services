import { Request, Response, NextFunction } from 'express';
import { OrderService } from '../services/order.service';
import { AuthRequest, validateRequiredFields } from '@bestbuy/shared';

const orderService = new OrderService();

export class OrderController {
  async createOrder(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
      }

      const { shippingAddress, paymentMethod } = req.body;
      validateRequiredFields(req.body, ['shippingAddress', 'paymentMethod']);

      const token = req.headers.authorization?.substring(7) || '';

      const order = await orderService.createOrder(userId, shippingAddress, paymentMethod, token);

      res.status(201).json({ success: true, data: order });
    } catch (error) {
      next(error);
    }
  }

  async getOrders(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
      }

      const orders = await orderService.getOrders(userId);

      res.json({ success: true, data: orders });
    } catch (error) {
      next(error);
    }
  }

  async getOrderById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
      }

      const { orderId } = req.params;
      const order = await orderService.getOrderById(orderId, userId);

      res.json({ success: true, data: order });
    } catch (error) {
      next(error);
    }
  }

  async updateOrderStatus(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { orderId } = req.params;
      const { status } = req.body;

      validateRequiredFields(req.body, ['status']);

      const order = await orderService.updateOrderStatus(orderId, status);

      res.json({ success: true, data: order });
    } catch (error) {
      next(error);
    }
  }
}
