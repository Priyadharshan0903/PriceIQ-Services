import { Router } from 'express';
import { ReviewController } from '../controllers/review.controller';
import { authenticate, optionalAuth } from '@bestbuy/shared';

const router = Router();
const reviewController = new ReviewController();

router.get('/reviews/product/:productId', reviewController.getReviewsByProduct);
router.post('/reviews', authenticate, reviewController.createReview);
router.put('/reviews/:id', authenticate, reviewController.updateReview);
router.delete('/reviews/:id', authenticate, reviewController.deleteReview);
router.get('/reviews/stats/:productId', reviewController.getReviewStats);
router.post('/reviews/:id/helpful', reviewController.markHelpful);

export default router;
