import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { Redis } from 'ioredis';
import { RoomHandler } from './handlers/roomHandler';
import { GameHandler } from './handlers/gameHandler';
import { MatchmakingHandler } from './handlers/matchmakingHandler';
import { logger } from '../utils/logger';
import type { ClientToServerEvents, ServerToClientEvents } from '@numball/shared';

interface AuthenticatedSocket extends Socket<ClientToServerEvents, ServerToClientEvents> {
  userId: string;
  username: string;
}

export class SocketManager {
  private io: Server<ClientToServerEvents, ServerToClientEvents>;
  private prisma: PrismaClient;
  private redis: Redis;
  private roomHandler: RoomHandler;
  private gameHandler: GameHandler;
  private matchmakingHandler: MatchmakingHandler;

  constructor(httpServer: HttpServer, prisma: PrismaClient, redis: Redis) {
    this.prisma = prisma;
    this.redis = redis;

    this.io = new Server(httpServer, {
      cors: {
        origin: [
          process.env.CLIENT_URL || 'http://localhost:3000',
          process.env.CORS_ORIGIN || '',
          'https://numball-pro.pages.dev',
        ].filter(Boolean),
        methods: ['GET', 'POST'],
        credentials: true,
      },
      pingTimeout: 60000,
      pingInterval: 25000,
      transports: ['websocket', 'polling'],
    });

    this.roomHandler = new RoomHandler(this.io, prisma, redis);
    this.gameHandler = new GameHandler(this.io, prisma, redis);
    this.matchmakingHandler = new MatchmakingHandler(this.io, prisma, redis, this.gameHandler);

    this.setupMiddleware();
    this.setupEventHandlers();
    this.startBackgroundTasks();
  }

  private setupMiddleware() {
    this.io.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.replace('Bearer ', '');

        if (!token) {
          return next(new Error('Authentication token required'));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };

        const user = await this.prisma.user.findUnique({
          where: { id: decoded.userId },
          select: { id: true, username: true, isBanned: true, banExpiresAt: true },
        });

        if (!user) {
          return next(new Error('User not found'));
        }

        if (user.isBanned) {
          if (!user.banExpiresAt || user.banExpiresAt > new Date()) {
            return next(new Error('Account suspended'));
          }
        }

        (socket as AuthenticatedSocket).userId = user.id;
        (socket as AuthenticatedSocket).username = user.username;

        next();
      } catch (error) {
        logger.error('Socket auth error:', error);
        next(new Error('Authentication failed'));
      }
    });
  }

  private setupEventHandlers() {
    this.io.on('connection', async (socket: AuthenticatedSocket) => {
      logger.info(`User connected: ${socket.userId} (${socket.username})`);

      await this.setUserOnline(socket.userId);
      await this.redis.set(`socket:${socket.userId}`, socket.id, 'EX', 86400);

      socket.join(`user:${socket.userId}`);

      socket.emit('connection:established', {
        socketId: socket.id,
        serverTime: Date.now(),
      });

      // Auth events
      this.setupAuthEvents(socket);

      // Lobby events
      this.setupLobbyEvents(socket);

      // Room events
      this.setupRoomEvents(socket);

      // Matchmaking events
      this.setupMatchmakingEvents(socket);

      // Game events
      this.setupGameEvents(socket);

      // Chat events
      this.setupChatEvents(socket);

      // Misc events
      this.setupMiscEvents(socket);

      // Disconnect
      socket.on('disconnect', async (reason) => {
        logger.info(`User disconnected: ${socket.userId} (${reason})`);

        await this.setUserOffline(socket.userId);
        await this.redis.del(`socket:${socket.userId}`);

        await this.gameHandler.handleDisconnect(socket);
        await this.matchmakingHandler.handleDisconnect(socket);
        await this.roomHandler.handleDisconnect(socket);
      });
    });
  }

  private setupAuthEvents(socket: AuthenticatedSocket) {
    socket.on('auth:authenticate', async ({ token }) => {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
        const user = await this.prisma.user.findUnique({
          where: { id: decoded.userId },
          select: {
            id: true,
            email: true,
            username: true,
            avatarUrl: true,
            rating: true,
            tier: true,
            level: true,
            coins: true,
            gems: true,
            gamesPlayed: true,
            gamesWon: true,
          },
        });

        if (user) {
          const winRate = user.gamesPlayed > 0 ? Math.round((user.gamesWon / user.gamesPlayed) * 100) : 0;
          socket.emit('auth:authenticated', {
            user: {
              ...user,
              oderId: user.id,
              userId: user.id,
              winRate,
              isReady: false,
              isHost: false,
              isOnline: true,
            } as any,
          });
        } else {
          socket.emit('auth:error', { message: 'User not found' });
        }
      } catch {
        socket.emit('auth:error', { message: 'Authentication failed' });
      }
    });
  }

  private setupLobbyEvents(socket: AuthenticatedSocket) {
    socket.on('lobby:join', async () => {
      socket.join('lobby');

      const rooms = await this.roomHandler.getPublicRooms();
      const onlineCount = await this.getOnlineStats();

      socket.emit('lobby:roomList', { rooms, total: rooms.length, page: 1 });
      socket.emit('lobby:onlineCount', onlineCount);
    });

    socket.on('lobby:leave', () => {
      socket.leave('lobby');
    });

    socket.on('lobby:getRooms', async ({ mode, page = 1, limit = 20 }) => {
      const rooms = await this.roomHandler.getPublicRooms(mode, page, limit);
      socket.emit('lobby:roomList', { rooms, total: rooms.length, page });
    });

    socket.on('lobby:refresh', async () => {
      const rooms = await this.roomHandler.getPublicRooms();
      const onlineCount = await this.getOnlineStats();

      socket.emit('lobby:roomList', { rooms, total: rooms.length, page: 1 });
      socket.emit('lobby:onlineCount', onlineCount);
    });
  }

  private setupRoomEvents(socket: AuthenticatedSocket) {
    socket.on('room:create', (data) => this.roomHandler.createRoom(socket, data));
    socket.on('room:join', (data) => this.roomHandler.joinRoom(socket, data));
    socket.on('room:leave', () => this.roomHandler.leaveRoom(socket));
    socket.on('room:ready', ({ isReady }) => this.roomHandler.setReady(socket, isReady));
    socket.on('room:kick', ({ userId }) => this.roomHandler.kickPlayer(socket, userId));
    socket.on('room:updateSettings', (settings) => this.roomHandler.updateSettings(socket, settings));
    socket.on('room:startGame', () => this.roomHandler.startGame(socket));
    socket.on('room:chat', ({ message }) => this.roomHandler.sendChat(socket, message));
  }

  private setupMatchmakingEvents(socket: AuthenticatedSocket) {
    socket.on('matchmaking:start', ({ mode, isRanked }) => this.matchmakingHandler.startMatchmaking(socket, mode, isRanked));
    socket.on('matchmaking:cancel', () => this.matchmakingHandler.cancelMatchmaking(socket));
  }

  private setupGameEvents(socket: AuthenticatedSocket) {
    socket.on('game:setSecret', ({ secret }) => this.gameHandler.setSecret(socket, secret));
    socket.on('game:guess', ({ guess }) => this.gameHandler.makeGuess(socket, guess));
    socket.on('game:useHint', ({ hintLevel }) => this.gameHandler.useHint(socket, hintLevel));
    socket.on('game:useItem', ({ itemId }) => this.gameHandler.useItem(socket, itemId));
    socket.on('game:surrender', () => this.gameHandler.surrender(socket));
    socket.on('game:rematch', () => this.gameHandler.requestRematch(socket));
    socket.on('game:declineRematch', () => this.gameHandler.declineRematch(socket));
  }

  private setupChatEvents(socket: AuthenticatedSocket) {
    socket.on('chat:sendMessage', ({ message, type }) => {
      // Get current room
      const rooms = Array.from(socket.rooms);
      const gameRoom = rooms.find((r) => r.startsWith('game:'));

      if (gameRoom) {
        this.io.to(gameRoom).emit('chat:message', {
          id: `msg_${Date.now()}`,
          senderId: socket.userId,
          senderName: socket.username,
          message,
          type: type || 'TEXT',
          timestamp: Date.now(),
        });
      }
    });

    socket.on('chat:typing', ({ isTyping }) => {
      const rooms = Array.from(socket.rooms);
      const gameRoom = rooms.find((r) => r.startsWith('game:'));

      if (gameRoom) {
        socket.to(gameRoom).emit('chat:typing', { userId: socket.userId, isTyping });
      }
    });
  }

  private setupMiscEvents(socket: AuthenticatedSocket) {
    socket.on('ping', () => {
      socket.emit('pong', { timestamp: Date.now(), latency: 0 });
    });

    socket.on('notification:markRead', async ({ notificationId }) => {
      await this.prisma.notification.update({
        where: { id: notificationId, userId: socket.userId },
        data: { isRead: true, readAt: new Date() },
      });
    });

    socket.on('notification:markAllRead', async () => {
      await this.prisma.notification.updateMany({
        where: { userId: socket.userId, isRead: false },
        data: { isRead: true, readAt: new Date() },
      });
    });
  }

  private async setUserOnline(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { isOnline: true, lastOnlineAt: new Date() },
    });
    await this.redis.sadd('online_users', userId);

    const stats = await this.getOnlineStats();
    this.io.to('lobby').emit('lobby:onlineCount', stats);
  }

  private async setUserOffline(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { isOnline: false, lastOnlineAt: new Date() },
    });
    await this.redis.srem('online_users', userId);

    const stats = await this.getOnlineStats();
    this.io.to('lobby').emit('lobby:onlineCount', stats);
  }

  private async getOnlineStats(): Promise<{ count: number; inGame: number; inLobby: number }> {
    const count = await this.redis.scard('online_users');
    const inGame = await this.redis.scard('in_game_users');
    const inLobby = count - inGame;
    return { count, inGame, inLobby: Math.max(0, inLobby) };
  }

  private startBackgroundTasks() {
    // Matchmaking queue processing
    setInterval(() => {
      this.matchmakingHandler.processQueue();
    }, 1000);

    // Game timer check
    setInterval(() => {
      this.gameHandler.checkTimers();
    }, 500);

    // Room cleanup
    setInterval(() => {
      this.roomHandler.cleanupEmptyRooms();
    }, 60000);

    // Online stats broadcast
    setInterval(async () => {
      const stats = await this.getOnlineStats();
      this.io.to('lobby').emit('lobby:onlineCount', stats);
    }, 30000);
  }
}
