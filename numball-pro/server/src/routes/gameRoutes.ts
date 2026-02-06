import { Router } from 'express';
import * as gameController from '../controllers/gameController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, gameController.getMyGames);
router.get('/:gameId', authenticate, gameController.getGameDetails);
router.get('/:gameId/moves', authenticate, gameController.getGameMoves);

export default router;
