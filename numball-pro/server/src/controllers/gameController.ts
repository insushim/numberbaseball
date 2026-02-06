import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

export const getMyGames = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { page = 1, limit = 20, mode } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where = {
      OR: [{ player1Id: req.userId }, { player2Id: req.userId }],
      status: 'FINISHED',
      ...(mode && { mode: String(mode) }),
    };

    const [games, total] = await Promise.all([
      prisma.game.findMany({
        where,
        select: {
          id: true,
          mode: true,
          winnerId: true,
          isDraw: true,
          player1Id: true,
          player2Id: true,
          player1RatingChange: true,
          player2RatingChange: true,
          totalDuration: true,
          endedAt: true,
          player1: { select: { id: true, username: true, avatarUrl: true } },
          player2: { select: { id: true, username: true, avatarUrl: true } },
          _count: { select: { moves: true } },
        },
        orderBy: { endedAt: 'desc' },
        skip,
        take: Number(limit),
      }),
      prisma.game.count({ where }),
    ]);

    const formattedGames = games.map((game) => {
      const isPlayer1 = game.player1Id === req.userId;
      const opponent = isPlayer1 ? game.player2 : game.player1;
      const ratingChange = isPlayer1 ? game.player1RatingChange : game.player2RatingChange;

      let result: 'WIN' | 'LOSE' | 'DRAW' = 'DRAW';
      if (!game.isDraw) {
        result = game.winnerId === req.userId ? 'WIN' : 'LOSE';
      }

      return {
        id: game.id,
        mode: game.mode,
        opponentName: opponent?.username || 'Unknown',
        opponentAvatarUrl: opponent?.avatarUrl,
        result,
        attempts: game._count.moves,
        ratingChange: ratingChange || 0,
        duration: game.totalDuration,
        playedAt: game.endedAt,
      };
    });

    res.json({
      success: true,
      data: {
        games: formattedGames,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit)),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getGameDetails = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { gameId } = req.params;

    const game = await prisma.game.findUnique({
      where: { id: gameId },
      include: {
        player1: {
          select: { id: true, username: true, avatarUrl: true, rating: true, tier: true },
        },
        player2: {
          select: { id: true, username: true, avatarUrl: true, rating: true, tier: true },
        },
        moves: {
          orderBy: { turnNumber: 'asc' },
          select: {
            id: true,
            playerId: true,
            turnNumber: true,
            guess: true,
            strikes: true,
            balls: true,
            timeSpent: true,
            createdAt: true,
          },
        },
      },
    });

    if (!game) {
      throw new AppError('게임을 찾을 수 없습니다.', 404);
    }

    // Check if user is part of this game
    const isPlayer = game.player1Id === req.userId || game.player2Id === req.userId;

    // Hide secret numbers if game is still in progress
    const showSecrets = game.status === 'FINISHED' || isPlayer;

    res.json({
      success: true,
      data: {
        ...game,
        player1Secret: showSecrets ? game.player1Secret : null,
        player2Secret: showSecrets ? game.player2Secret : null,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getGameMoves = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { gameId } = req.params;

    const game = await prisma.game.findUnique({
      where: { id: gameId },
      select: { player1Id: true, player2Id: true },
    });

    if (!game) {
      throw new AppError('게임을 찾을 수 없습니다.', 404);
    }

    const moves = await prisma.gameMove.findMany({
      where: { gameId },
      orderBy: { turnNumber: 'asc' },
      select: {
        id: true,
        playerId: true,
        turnNumber: true,
        guess: true,
        strikes: true,
        balls: true,
        timeSpent: true,
        hintUsed: true,
        itemUsed: true,
        createdAt: true,
        player: {
          select: { username: true },
        },
      },
    });

    res.json({
      success: true,
      data: moves,
    });
  } catch (error) {
    next(error);
  }
};
