import { Router } from 'express';
import { ComparisonController } from '../controllers/comparison.controller';
import { authenticate, optionalAuth } from '@bestbuy/shared';

const router = Router();
const comparisonController = new ComparisonController();

router.post('/comparison/compare', optionalAuth, comparisonController.compareProducts);
router.get('/comparison/history', authenticate, comparisonController.getComparisonHistory);

export default router;
