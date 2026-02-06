import { prisma } from '../config/database';
import { getTierByRating } from '@numball/shared';

export class UserService {
  static async getUserById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        username: true,
        avatarUrl: true,
        rating: true,
        tier: true,
        level: true,
        experience: true,
        coins: true,
        gems: true,
        gamesPlayed: true,
        gamesWon: true,
        winStreak: true,
        maxWinStreak: true,
        createdAt: true,
      },
    });
  }

  static async getUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  static async getUserByUsername(username: string) {
    return prisma.user.findUnique({
      where: { username },
    });
  }

  static async updateRating(userId: string, newRating: number) {
    const tierInfo = getTierByRating(newRating);

    return prisma.user.update({
      where: { id: userId },
      data: {
        rating: newRating,
        tier: tierInfo.tier,
      },
    });
  }

  static async addExp(userId: string, exp: number) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { level: true, experience: true },
    });

    if (!user) return null;

    let newExp = user.experience + exp;
    let newLevel = user.level;

    // Level up calculation (100 * level = exp needed)
    while (newExp >= newLevel * 100) {
      newExp -= newLevel * 100;
      newLevel++;
    }

    return prisma.user.update({
      where: { id: userId },
      data: {
        experience: newExp,
        level: newLevel,
      },
    });
  }

  static async addCoins(userId: string, coins: number) {
    return prisma.user.update({
      where: { id: userId },
      data: {
        coins: { increment: coins },
      },
    });
  }

  static async addGems(userId: string, gems: number) {
    return prisma.user.update({
      where: { id: userId },
      data: {
        gems: { increment: gems },
      },
    });
  }

  static async updateGameStats(
    userId: string,
    won: boolean,
    ratingChange: number,
    coinsEarned: number,
    _expEarned: number
  ) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { rating: true, winStreak: true, maxWinStreak: true },
    });

    if (!user) return null;

    const newRating = user.rating + ratingChange;
    const tierInfo = getTierByRating(newRating);
    const newWinStreak = won ? user.winStreak + 1 : 0;
    const newMaxWinStreak = Math.max(user.maxWinStreak, newWinStreak);

    return prisma.user.update({
      where: { id: userId },
      data: {
        rating: newRating,
        tier: tierInfo.tier,
        gamesPlayed: { increment: 1 },
        gamesWon: won ? { increment: 1 } : undefined,
        winStreak: newWinStreak,
        maxWinStreak: newMaxWinStreak,
        coins: { increment: coinsEarned },
      },
    });
  }

  static async getLeaderboard(limit = 100, offset = 0) {
    return prisma.user.findMany({
      take: limit,
      skip: offset,
      orderBy: { rating: 'desc' },
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
    });
  }

  static async getUserRank(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { rating: true },
    });

    if (!user) return null;

    const rank = await prisma.user.count({
      where: {
        rating: { gt: user.rating },
      },
    });

    return rank + 1;
  }

  static async getMatchHistory(userId: string, limit = 20, offset = 0) {
    return prisma.game.findMany({
      where: {
        OR: [
          { player1Id: userId },
          { player2Id: userId },
        ],
      },
      take: limit,
      skip: offset,
      orderBy: { endedAt: 'desc' },
      include: {
        player1: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
            rating: true,
            tier: true,
          },
        },
        player2: {
          select: {
            id: true,
            username: true,
            avatarUrl: true,
            rating: true,
            tier: true,
          },
        },
      },
    });
  }
}
