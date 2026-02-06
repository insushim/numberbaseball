import { Server, Socket } from 'socket.io';
import { PrismaClient } from '@prisma/client';
import { Redis } from 'ioredis';
import { logger } from '../../utils/logger';
import { GameHandler } from './gameHandler';
import { GAME_MODE_CONFIGS, GameMode } from '@numball/shared';

interface AuthenticatedSocket extends Socket {
  userId: string;
  username: string;
}

interface QueuePlayer {
  oderId: string;
  odername: string;
  avatarUrl?: string;
  rating: number;
  tier: string;
  level: number;
  mode: string;
  isRanked: boolean;
  joinedAt: number;
  socketId: string;
}

export class MatchmakingHandler {
  private io: Server;
  private prisma: PrismaClient;
  private redis: Redis;
  private gameHandler: GameHandler;
  private queue: Map<string, QueuePlayer> = new Map();
  private playerQueueMap: Map<string, string> = new Map();

  constructor(io: Server, prisma: PrismaClient, redis: Redis, gameHandler: GameHandler) {
    this.io = io;
    this.prisma = prisma;
    this.redis = redis;
    this.gameHandler = gameHandler;
  }

  async startMatchmaking(socket: AuthenticatedSocket, mode: string, isRanked: boolean = true) {
    try {
      // Check if already in queue
      if (this.playerQueueMap.has(socket.userId)) {
        socket.emit('matchmaking:error', { message: '이미 매칭 대기 중입니다.' });
        return;
      }

      const user = await this.prisma.user.findUnique({
        where: { id: socket.userId },
        select: { id: true, username: true, avatarUrl: true, rating: true, tier: true, level: true },
      });

      if (!user) {
        socket.emit('matchmaking:error', { message: '사용자를 찾을 수 없습니다.' });
        return;
      }

      // Check level requirement
      const config = GAME_MODE_CONFIGS[mode as GameMode];
      if (config && user.level < config.unlockLevel) {
        socket.emit('matchmaking:error', { message: `이 모드는 레벨 ${config.unlockLevel}에 해제됩니다.` });
        return;
      }

      const queueId = `${mode}_${socket.userId}`;

      const queuePlayer: QueuePlayer = {
        oderId: user.id,
        odername: user.username,
        avatarUrl: user.avatarUrl || undefined,
        rating: user.rating,
        tier: user.tier,
        level: user.level,
        mode,
        isRanked,
        joinedAt: Date.now(),
        socketId: socket.id,
      };

      this.queue.set(queueId, queuePlayer);
      this.playerQueueMap.set(socket.userId, queueId);

      socket.emit('matchmaking:searching', {
        estimatedTime: 30,
        playersInQueue: this.getQueueCount(mode),
        elapsedTime: 0,
      });

      logger.info(`${user.username} started matchmaking for ${mode}`);
    } catch (error) {
      logger.error('Error starting matchmaking:', error);
      socket.emit('matchmaking:error', { message: '매칭 시작에 실패했습니다.' });
    }
  }

  async cancelMatchmaking(socket: AuthenticatedSocket) {
    try {
      const queueId = this.playerQueueMap.get(socket.userId);
      if (!queueId) return;

      this.queue.delete(queueId);
      this.playerQueueMap.delete(socket.userId);

      socket.emit('matchmaking:cancelled');
      logger.info(`${socket.username} cancelled matchmaking`);
    } catch (error) {
      logger.error('Error cancelling matchmaking:', error);
    }
  }

  async handleDisconnect(socket: AuthenticatedSocket) {
    await this.cancelMatchmaking(socket);
  }

  async processQueue() {
    try {
      // Group by mode
      const modeGroups = new Map<string, QueuePlayer[]>();

      for (const player of this.queue.values()) {
        const key = `${player.mode}_${player.isRanked}`;
        if (!modeGroups.has(key)) {
          modeGroups.set(key, []);
        }
        modeGroups.get(key)!.push(player);
      }

      // Find matches
      for (const [key, players] of modeGroups.entries()) {
        if (players.length < 2) continue;

        // Sort by join time
        players.sort((a, b) => a.joinedAt - b.joinedAt);

        // Find matching pairs based on rating
        for (let i = 0; i < players.length - 1; i++) {
          const player1 = players[i];

          // Check if still in queue
          if (!this.queue.has(`${player1.mode}_${player1.oderId}`)) continue;

          const waitTime = Date.now() - player1.joinedAt;
          const ratingRange = Math.min(200 + Math.floor(waitTime / 10000) * 50, 500);

          for (let j = i + 1; j < players.length; j++) {
            const player2 = players[j];

            // Check if still in queue
            if (!this.queue.has(`${player2.mode}_${player2.oderId}`)) continue;

            const ratingDiff = Math.abs(player1.rating - player2.rating);

            if (ratingDiff <= ratingRange) {
              // Match found!
              await this.createMatch(player1, player2);
              break;
            }
          }
        }
      }

      // Update status for waiting players
      for (const player of this.queue.values()) {
        const waitTime = Math.floor((Date.now() - player.joinedAt) / 1000);
        const ratingRange = Math.min(200 + Math.floor(waitTime / 10) * 50, 500);

        const socket = this.io.sockets.sockets.get(player.socketId);
        if (socket) {
          socket.emit('matchmaking:searching', {
            estimatedTime: Math.max(0, 30 - waitTime),
            playersInQueue: this.getQueueCount(player.mode),
            elapsedTime: waitTime,
          });

          // Status update every 10 seconds
          if (waitTime % 10 === 0 && waitTime > 0) {
            socket.emit('matchmaking:statusUpdate', {
              status: 'EXPANDING_SEARCH',
              ratingRange,
            });
          }
        }
      }
    } catch (error) {
      logger.error('Error processing queue:', error);
    }
  }

  private async createMatch(player1: QueuePlayer, player2: QueuePlayer) {
    try {
      // Remove from queue
      this.queue.delete(`${player1.mode}_${player1.oderId}`);
      this.queue.delete(`${player2.mode}_${player2.oderId}`);
      this.playerQueueMap.delete(player1.oderId);
      this.playerQueueMap.delete(player2.oderId);

      const roomCode = this.generateRoomCode();
      const config = GAME_MODE_CONFIGS[player1.mode as GameMode] || GAME_MODE_CONFIGS.CLASSIC_4;

      // Create game
      const gameId = await this.gameHandler.startGame(
        roomCode,
        [
          {
            oderId: player1.oderId,
            username: player1.odername,
            avatarUrl: player1.avatarUrl,
            rating: player1.rating,
            tier: player1.tier,
            level: player1.level,
          },
          {
            oderId: player2.oderId,
            username: player2.odername,
            avatarUrl: player2.avatarUrl,
            rating: player2.rating,
            tier: player2.tier,
            level: player2.level,
          },
        ],
        player1.mode,
        {
          isRanked: player1.isRanked,
          timeLimit: config.timeLimit,
          maxAttempts: config.maxAttempts,
          hintsAllowed: config.hintsAllowed,
          itemsAllowed: config.itemsAllowed,
        }
      );

      // Notify players
      const socket1 = this.io.sockets.sockets.get(player1.socketId);
      const socket2 = this.io.sockets.sockets.get(player2.socketId);

      if (socket1) {
        socket1.emit('matchmaking:found', {
          opponent: {
            oderId: player2.oderId,
            username: player2.odername,
            avatarUrl: player2.avatarUrl,
            rating: player2.rating,
            tier: player2.tier,
            level: player2.level,
            isReady: false,
            isHost: false,
            isOnline: true,
          },
          roomCode,
        });
        socket1.join(`game:${gameId}`);
      }

      if (socket2) {
        socket2.emit('matchmaking:found', {
          opponent: {
            oderId: player1.oderId,
            username: player1.odername,
            avatarUrl: player1.avatarUrl,
            rating: player1.rating,
            tier: player1.tier,
            level: player1.level,
            isReady: false,
            isHost: false,
            isOnline: true,
          },
          roomCode,
        });
        socket2.join(`game:${gameId}`);
      }

      logger.info(`Match created: ${player1.odername} vs ${player2.odername} (${player1.mode})`);
    } catch (error) {
      logger.error('Error creating match:', error);
    }
  }

  private getQueueCount(mode: string): number {
    let count = 0;
    for (const player of this.queue.values()) {
      if (player.mode === mode) count++;
    }
    return count;
  }

  private generateRoomCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    return Array.from({ length: 6 }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
  }
}
