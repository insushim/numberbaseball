import { Router } from 'express';
import * as userController from '../controllers/userController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/profile', authenticate, userController.getMyProfile);
router.get('/:userId', userController.getUserProfile);
router.put('/profile', authenticate, userController.updateProfile);
router.get('/:userId/stats', userController.getUserStats);
router.get('/:userId/games', userController.getUserGames);

export default router;
