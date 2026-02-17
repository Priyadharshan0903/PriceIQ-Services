import { Request, Response, NextFunction } from 'express';
import { ComparisonService } from '../services/comparison.service';
import { AuthRequest, validateRequiredFields } from '@bestbuy/shared';

const comparisonService = new ComparisonService();

export class ComparisonController {
  async compareProducts(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { productIds } = req.body;
      const userId = req.user?.userId;

      validateRequiredFields(req.body, ['productIds']);

      if (!Array.isArray(productIds)) {
        return res.status(400).json({ success: false, error: 'productIds must be an array' });
      }

      const result = await comparisonService.compareProducts(productIds, userId);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getComparisonHistory(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      const limit = parseInt(req.query.limit as string) || 10;

      if (!userId) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
      }

      const history = await comparisonService.getComparisonHistory(userId, limit);

      res.json({
        success: true,
        data: history,
      });
    } catch (error) {
      next(error);
    }
  }
}
