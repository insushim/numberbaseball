import { redis } from '../config/redis';
import { GameMode } from '@numball/shared';

interface QueuedPlayer {
  id: string;
  username: string;
  socketId: string;
  rating: number;
  tier: string;
  mode: GameMode;
  joinedAt: number;
}

export class MatchmakingService {
  private static readonly QUEUE_PREFIX = 'matchmaking:queue:';
  private static readonly PLAYER_QUEUE = 'matchmaking:players';

  static async joinQueue(player: Omit<QueuedPlayer, 'joinedAt'>): Promise<void> {
    const queuedPlayer: QueuedPlayer = {
      ...player,
      joinedAt: Date.now(),
    };

    // Add to mode-specific sorted set (score = rating)
    await redis.zadd(
      `${this.QUEUE_PREFIX}${player.mode}`,
      player.rating,
      JSON.stringify(queuedPlayer)
    );

    // Track player in queue
    await redis.hset(this.PLAYER_QUEUE, player.id, player.mode);
  }

  static async leaveQueue(playerId: string): Promise<void> {
    const mode = await redis.hget(this.PLAYER_QUEUE, playerId);
    if (!mode) return;

    // Get all players in queue and remove the one with matching id
    const players = await redis.zrange(`${this.QUEUE_PREFIX}${mode}`, 0, -1);
    for (const playerData of players) {
      const player: QueuedPlayer = JSON.parse(playerData);
      if (player.id === playerId) {
        await redis.zrem(`${this.QUEUE_PREFIX}${mode}`, playerData);
        break;
      }
    }

    await redis.hdel(this.PLAYER_QUEUE, playerId);
  }

  static async isInQueue(playerId: string): Promise<boolean> {
    return (await redis.hexists(this.PLAYER_QUEUE, playerId)) === 1;
  }

  static async findMatch(
    player: QueuedPlayer,
    ratingRange: number = 100
  ): Promise<QueuedPlayer | null> {
    const minRating = player.rating - ratingRange;
    const maxRating = player.rating + ratingRange;

    // Get players within rating range
    const players = await redis.zrangebyscore(
      `${this.QUEUE_PREFIX}${player.mode}`,
      minRating,
      maxRating
    );

    for (const playerData of players) {
      const candidate: QueuedPlayer = JSON.parse(playerData);

      // Skip self
      if (candidate.id === player.id) continue;

      // Found a match!
      return candidate;
    }

    return null;
  }

  static async removeFromQueue(player: QueuedPlayer): Promise<void> {
    await redis.zrem(
      `${this.QUEUE_PREFIX}${player.mode}`,
      JSON.stringify(player)
    );
    await redis.hdel(this.PLAYER_QUEUE, player.id);
  }

  static async getQueueSize(mode: GameMode): Promise<number> {
    return redis.zcard(`${this.QUEUE_PREFIX}${mode}`);
  }

  static async getQueueStats(): Promise<Record<GameMode, number>> {
    const modes: GameMode[] = [
      'CLASSIC_3',
      'CLASSIC_4',
      'CLASSIC_5',
      'CLASSIC_6',
      'SPEED',
      'BLITZ',
      'MARATHON',
      'DUPLICATE',
      'REVERSE',
      'TEAM_2V2',
    ];

    const stats: Record<string, number> = {};

    for (const mode of modes) {
      stats[mode] = await this.getQueueSize(mode);
    }

    return stats as Record<GameMode, number>;
  }

  static async cleanupStaleEntries(maxAgeMs: number = 300000): Promise<number> {
    const modes: GameMode[] = [
      'CLASSIC_3',
      'CLASSIC_4',
      'CLASSIC_5',
      'CLASSIC_6',
      'SPEED',
      'BLITZ',
      'MARATHON',
      'DUPLICATE',
      'REVERSE',
      'TEAM_2V2',
    ];

    let removed = 0;
    const now = Date.now();

    for (const mode of modes) {
      const players = await redis.zrange(`${this.QUEUE_PREFIX}${mode}`, 0, -1);

      for (const playerData of players) {
        const player: QueuedPlayer = JSON.parse(playerData);
        if (now - player.joinedAt > maxAgeMs) {
          await redis.zrem(`${this.QUEUE_PREFIX}${mode}`, playerData);
          await redis.hdel(this.PLAYER_QUEUE, player.id);
          removed++;
        }
      }
    }

    return removed;
  }
}
