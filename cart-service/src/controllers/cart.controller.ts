import { Request, Response, NextFunction } from 'express';
import { CartService } from '../services/cart.service';
import { AuthRequest, validateRequiredFields } from '@bestbuy/shared';

const cartService = new CartService();

export class CartController {
  async getCart(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
      }

      const cart = await cartService.getCart(userId);

      res.json({ success: true, data: cart });
    } catch (error) {
      next(error);
    }
  }

  async addItem(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
      }

      const { productId, quantity } = req.body;
      validateRequiredFields(req.body, ['productId', 'quantity']);

      const cart = await cartService.addItem(userId, productId, quantity);

      res.json({ success: true, data: cart });
    } catch (error) {
      next(error);
    }
  }

  async updateItem(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
      }

      const { productId, quantity } = req.body;
      validateRequiredFields(req.body, ['productId', 'quantity']);

      const cart = await cartService.updateItem(userId, productId, quantity);

      res.json({ success: true, data: cart });
    } catch (error) {
      next(error);
    }
  }

  async removeItem(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
      }

      const { productId } = req.params;

      const cart = await cartService.removeItem(userId, productId);

      res.json({ success: true, data: cart });
    } catch (error) {
      next(error);
    }
  }

  async clearCart(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
      }

      await cartService.clearCart(userId);

      res.json({ success: true, message: 'Cart cleared successfully' });
    } catch (error) {
      next(error);
    }
  }
}
