import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { redis } from '../config/redis';
import { AuthRequest } from '../middleware/auth';
import { getTierByRating } from '@numball/shared';

export const getGlobalRanking = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    // Try cache first
    const cacheKey = `ranking:global:${page}:${limit}`;
    const cached = await redis.get(cacheKey);

    if (cached) {
      return res.json({
        success: true,
        data: JSON.parse(cached),
        cached: true,
      });
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where: { gamesPlayed: { gte: 10 } },
        select: {
          id: true,
          username: true,
          avatarUrl: true,
          rating: true,
          tier: true,
          level: true,
          gamesPlayed: true,
          gamesWon: true,
        },
        orderBy: { rating: 'desc' },
        skip,
        take: Number(limit),
      }),
      prisma.user.count({ where: { gamesPlayed: { gte: 10 } } }),
    ]);

    const rankedUsers = users.map((user, index) => ({
      ...user,
      rank: skip + index + 1,
      tierInfo: getTierByRating(user.rating),
      winRate: user.gamesPlayed > 0 ? Math.round((user.gamesWon / user.gamesPlayed) * 100) : 0,
    }));

    const data = {
      rankings: rankedUsers,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    };

    // Cache for 5 minutes
    await redis.setex(cacheKey, 300, JSON.stringify(data));

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getSeasonRanking = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    // Try cache first
    const cacheKey = `ranking:season:${page}:${limit}`;
    const cached = await redis.get(cacheKey);

    if (cached) {
      return res.json({
        success: true,
        data: JSON.parse(cached),
        cached: true,
      });
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where: { gamesPlayed: { gte: 10 } },
        select: {
          id: true,
          username: true,
          avatarUrl: true,
          seasonRating: true,
          tier: true,
          level: true,
          gamesPlayed: true,
          gamesWon: true,
        },
        orderBy: { seasonRating: 'desc' },
        skip,
        take: Number(limit),
      }),
      prisma.user.count({ where: { gamesPlayed: { gte: 10 } } }),
    ]);

    const rankedUsers = users.map((user, index) => ({
      ...user,
      rank: skip + index + 1,
      tierInfo: getTierByRating(user.seasonRating),
      winRate: user.gamesPlayed > 0 ? Math.round((user.gamesWon / user.gamesPlayed) * 100) : 0,
    }));

    const data = {
      rankings: rankedUsers,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    };

    // Cache for 5 minutes
    await redis.setex(cacheKey, 300, JSON.stringify(data));

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyRank = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        username: true,
        rating: true,
        seasonRating: true,
        gamesPlayed: true,
      },
    });

    if (!user) {
      return res.json({
        success: true,
        data: { globalRank: null, seasonRank: null },
      });
    }

    if (user.gamesPlayed < 10) {
      return res.json({
        success: true,
        data: {
          globalRank: null,
          seasonRank: null,
          message: '랭킹에 등록되려면 최소 10게임이 필요합니다.',
          gamesNeeded: 10 - user.gamesPlayed,
        },
      });
    }

    const [globalRank, seasonRank] = await Promise.all([
      prisma.user.count({
        where: {
          rating: { gt: user.rating },
          gamesPlayed: { gte: 10 },
        },
      }),
      prisma.user.count({
        where: {
          seasonRating: { gt: user.seasonRating },
          gamesPlayed: { gte: 10 },
        },
      }),
    ]);

    res.json({
      success: true,
      data: {
        globalRank: globalRank + 1,
        seasonRank: seasonRank + 1,
        rating: user.rating,
        seasonRating: user.seasonRating,
      },
    });
  } catch (error) {
    next(error);
  }
};
