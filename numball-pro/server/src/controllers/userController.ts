import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';
import { getTierByRating } from '@numball/shared';

export const getMyProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        email: true,
        username: true,
        avatarUrl: true,
        avatarFrameId: true,
        titleId: true,
        bio: true,
        country: true,
        rating: true,
        seasonRating: true,
        tier: true,
        peakRating: true,
        peakTier: true,
        level: true,
        experience: true,
        gamesPlayed: true,
        gamesWon: true,
        gamesLost: true,
        gamesDraw: true,
        winStreak: true,
        maxWinStreak: true,
        totalPlayTime: true,
        coins: true,
        gems: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new AppError('사용자를 찾을 수 없습니다.', 404);
    }

    const tierInfo = getTierByRating(user.rating);

    res.json({
      success: true,
      data: {
        ...user,
        tierInfo,
        winRate: user.gamesPlayed > 0 ? Math.round((user.gamesWon / user.gamesPlayed) * 100) : 0,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getUserProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        avatarUrl: true,
        avatarFrameId: true,
        titleId: true,
        bio: true,
        country: true,
        rating: true,
        tier: true,
        level: true,
        gamesPlayed: true,
        gamesWon: true,
        gamesLost: true,
        gamesDraw: true,
        maxWinStreak: true,
        totalPlayTime: true,
        isOnline: true,
        lastOnlineAt: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new AppError('사용자를 찾을 수 없습니다.', 404);
    }

    const tierInfo = getTierByRating(user.rating);

    res.json({
      success: true,
      data: {
        ...user,
        tierInfo,
        winRate: user.gamesPlayed > 0 ? Math.round((user.gamesWon / user.gamesPlayed) * 100) : 0,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { username, bio, avatarUrl, avatarFrameId, titleId } = req.body;

    // Check if username is taken
    if (username) {
      const existing = await prisma.user.findFirst({
        where: { username, id: { not: req.userId } },
      });
      if (existing) {
        throw new AppError('이미 사용 중인 닉네임입니다.', 400);
      }
    }

    const user = await prisma.user.update({
      where: { id: req.userId },
      data: {
        ...(username && { username }),
        ...(bio !== undefined && { bio }),
        ...(avatarUrl && { avatarUrl }),
        ...(avatarFrameId && { avatarFrameId }),
        ...(titleId && { titleId }),
      },
      select: {
        id: true,
        username: true,
        avatarUrl: true,
        avatarFrameId: true,
        titleId: true,
        bio: true,
      },
    });

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        gamesPlayed: true,
        gamesWon: true,
        gamesLost: true,
        gamesDraw: true,
        winStreak: true,
        maxWinStreak: true,
        totalPlayTime: true,
        totalGuesses: true,
        perfectGames: true,
      },
    });

    if (!user) {
      throw new AppError('사용자를 찾을 수 없습니다.', 404);
    }

    // Get mode stats
    const modeStats = await prisma.game.groupBy({
      by: ['mode'],
      where: {
        OR: [{ player1Id: userId }, { player2Id: userId }],
        status: 'FINISHED',
      },
      _count: true,
    });

    const favoriteMode = modeStats.length > 0
      ? modeStats.reduce((a, b) => (a._count > b._count ? a : b)).mode
      : 'CLASSIC_4';

    res.json({
      success: true,
      data: {
        ...user,
        winRate: user.gamesPlayed > 0 ? Math.round((user.gamesWon / user.gamesPlayed) * 100) : 0,
        averageAttempts: user.gamesPlayed > 0
          ? Math.round(user.totalGuesses / user.gamesPlayed)
          : 0,
        favoriteMode,
        modeStats,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getUserGames = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const [games, total] = await Promise.all([
      prisma.game.findMany({
        where: {
          OR: [{ player1Id: userId }, { player2Id: userId }],
          status: 'FINISHED',
        },
        select: {
          id: true,
          mode: true,
          winnerId: true,
          isDraw: true,
          player1Id: true,
          player2Id: true,
          player1RatingChange: true,
          player2RatingChange: true,
          endedAt: true,
          player1: { select: { id: true, username: true, avatarUrl: true } },
          player2: { select: { id: true, username: true, avatarUrl: true } },
          _count: { select: { moves: true } },
        },
        orderBy: { endedAt: 'desc' },
        skip,
        take: Number(limit),
      }),
      prisma.game.count({
        where: {
          OR: [{ player1Id: userId }, { player2Id: userId }],
          status: 'FINISHED',
        },
      }),
    ]);

    const formattedGames = games.map((game) => {
      const isPlayer1 = game.player1Id === userId;
      const opponent = isPlayer1 ? game.player2 : game.player1;
      const ratingChange = isPlayer1 ? game.player1RatingChange : game.player2RatingChange;

      let result: 'WIN' | 'LOSE' | 'DRAW' = 'DRAW';
      if (!game.isDraw) {
        result = game.winnerId === userId ? 'WIN' : 'LOSE';
      }

      return {
        id: game.id,
        mode: game.mode,
        opponentName: opponent?.username || 'Unknown',
        opponentAvatarUrl: opponent?.avatarUrl,
        result,
        attempts: game._count.moves,
        ratingChange: ratingChange || 0,
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
