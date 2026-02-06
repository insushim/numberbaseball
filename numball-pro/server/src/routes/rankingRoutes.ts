import { Router } from 'express';
import * as rankingController from '../controllers/rankingController';
import { authenticate, optionalAuth } from '../middleware/auth';

const router = Router();

router.get('/global', optionalAuth, rankingController.getGlobalRanking);
router.get('/season', optionalAuth, rankingController.getSeasonRanking);
router.get('/my-rank', authenticate, rankingController.getMyRank);

export default router;
