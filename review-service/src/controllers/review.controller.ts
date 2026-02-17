import { Request, Response, NextFunction } from 'express';
import { ReviewService } from '../services/review.service';
import { AuthRequest, validateRequiredFields } from '@bestbuy/shared';

const reviewService = new ReviewService();

export class ReviewController {
  async getReviewsByProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const { productId } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await reviewService.getReviewsByProduct(productId, page, limit);

      res.json({
        success: true,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }

  async createReview(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { productId, rating, title, content } = req.body;
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
      }

      validateRequiredFields(req.body, ['productId', 'rating', 'title', 'content']);

      const review = await reviewService.createReview(productId, userId, rating, title, content);

      res.status(201).json({
        success: true,
        data: review,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateReview(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { rating, title, content } = req.body;
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
      }

      const review = await reviewService.updateReview(id, userId, rating, title, content);

      res.json({
        success: true,
        data: review,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteReview(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
      }

      await reviewService.deleteReview(id, userId);

      res.json({
        success: true,
        message: 'Review deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async getReviewStats(req: Request, res: Response, next: NextFunction) {
    try {
      const { productId } = req.params;
      const stats = await reviewService.getReviewStats(productId);

      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }

  async markHelpful(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const review = await reviewService.markHelpful(id);

      res.json({
        success: true,
        data: review,
      });
    } catch (error) {
      next(error);
    }
  }
}
