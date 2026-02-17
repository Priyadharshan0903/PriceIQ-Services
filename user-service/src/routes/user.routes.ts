import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authenticate } from '@bestbuy/shared';

const router = Router();
const userController = new UserController();

router.get('/users/profile', authenticate, userController.getProfile);
router.put('/users/profile', authenticate, userController.updateProfile);
router.get('/users/preferences', authenticate, userController.getPreferences);
router.put('/users/preferences', authenticate, userController.updatePreferences);

export default router;
