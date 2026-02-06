import { Router } from 'express';
import authRoutes from './authRoutes';
import userRoutes from './userRoutes';
import gameRoutes from './gameRoutes';
import rankingRoutes from './rankingRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/games', gameRoutes);
router.use('/rankings', rankingRoutes);

export default router;
