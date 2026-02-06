import { Server, Socket } from 'socket.io';
import { PrismaClient } from '@prisma/client';
import { Redis } from 'ioredis';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../../utils/logger';
import { GAME_MODE_CONFIGS, GameMode } from '@numball/shared';
import type { RoomData, RoomSettings, PlayerData, CreateRoomData } from '@numball/shared';

interface AuthenticatedSocket extends Socket {
  userId: string;
  username: string;
}

interface RoomState {
  code: string;
  mode: string;
  hostId: string;
  players: Map<string, PlayerData>;
  settings: RoomSettings;
  status: 'WAITING' | 'STARTING' | 'IN_GAME';
  isPrivate: boolean;
  password?: string;
  createdAt: number;
}

export class RoomHandler {
  private io: Server;
  private prisma: PrismaClient;
  private redis: Redis;
  private rooms: Map<string, RoomState> = new Map();
  private playerRoomMap: Map<string, string> = new Map();

  constructor(io: Server, prisma: PrismaClient, redis: Redis) {
    this.io = io;
    this.prisma = prisma;
    this.redis = redis;
  }

  private generateRoomCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  async createRoom(socket: AuthenticatedSocket, data: CreateRoomData) {
    try {
      // Check if user is already in a room
      if (this.playerRoomMap.has(socket.userId)) {
        socket.emit('room:error', { message: '이미 다른 방에 참가 중입니다.' });
        return;
      }

      const user = await this.prisma.user.findUnique({
        where: { id: socket.userId },
        select: { id: true, username: true, avatarUrl: true, rating: true, tier: true, level: true },
      });

      if (!user) {
        socket.emit('room:error', { message: '사용자를 찾을 수 없습니다.' });
        return;
      }

      const config = GAME_MODE_CONFIGS[data.mode as GameMode] || GAME_MODE_CONFIGS.CLASSIC_4;

      let roomCode: string;
      do {
        roomCode = this.generateRoomCode();
      } while (this.rooms.has(roomCode));

      const hostPlayer: PlayerData = {
        userId: user.id,
        username: user.username,
        avatarUrl: user.avatarUrl || undefined,
        rating: user.rating,
        tier: user.tier,
        level: user.level,
        isReady: false,
        isHost: true,
        isOnline: true,
      };

      const settings: RoomSettings = {
        mode: data.mode,
        timeLimit: data.timeLimit ?? config.timeLimit,
        maxAttempts: data.maxAttempts ?? config.maxAttempts,
        hintsAllowed: data.hintsAllowed ?? config.hintsAllowed,
        itemsAllowed: data.itemsAllowed ?? config.itemsAllowed,
        isRanked: data.isRanked ?? true,
        isPrivate: data.isPrivate,
      };

      const roomState: RoomState = {
        code: roomCode,
        mode: data.mode,
        hostId: socket.userId,
        players: new Map([[socket.userId, hostPlayer]]),
        settings,
        status: 'WAITING',
        isPrivate: data.isPrivate,
        password: data.password,
        createdAt: Date.now(),
      };

      this.rooms.set(roomCode, roomState);
      this.playerRoomMap.set(socket.userId, roomCode);

      socket.join(`room:${roomCode}`);
      socket.leave('lobby');

      const roomData = this.getRoomData(roomState);

      socket.emit('room:created', { room: roomData });

      // Broadcast to lobby
      if (!data.isPrivate) {
        this.io.to('lobby').emit('lobby:roomCreated', roomData);
      }

      logger.info(`Room created: ${roomCode} by ${socket.username}`);
    } catch (error) {
      logger.error('Error creating room:', error);
      socket.emit('room:error', { message: '방 생성에 실패했습니다.' });
    }
  }

  async joinRoom(socket: AuthenticatedSocket, data: { roomCode: string; password?: string }) {
    try {
      const { roomCode, password } = data;

      if (this.playerRoomMap.has(socket.userId)) {
        socket.emit('room:error', { message: '이미 다른 방에 참가 중입니다.' });
        return;
      }

      const room = this.rooms.get(roomCode);
      if (!room) {
        socket.emit('room:error', { message: '방을 찾을 수 없습니다.' });
        return;
      }

      if (room.status !== 'WAITING') {
        socket.emit('room:error', { message: '게임이 이미 시작되었습니다.' });
        return;
      }

      if (room.players.size >= 2) {
        socket.emit('room:error', { message: '방이 가득 찼습니다.' });
        return;
      }

      if (room.isPrivate && room.password && room.password !== password) {
        socket.emit('room:error', { message: '비밀번호가 일치하지 않습니다.' });
        return;
      }

      const user = await this.prisma.user.findUnique({
        where: { id: socket.userId },
        select: { id: true, username: true, avatarUrl: true, rating: true, tier: true, level: true },
      });

      if (!user) {
        socket.emit('room:error', { message: '사용자를 찾을 수 없습니다.' });
        return;
      }

      const player: PlayerData = {
        userId: user.id,
        username: user.username,
        avatarUrl: user.avatarUrl || undefined,
        rating: user.rating,
        tier: user.tier,
        level: user.level,
        isReady: false,
        isHost: false,
        isOnline: true,
      };

      room.players.set(socket.userId, player);
      this.playerRoomMap.set(socket.userId, roomCode);

      socket.join(`room:${roomCode}`);
      socket.leave('lobby');

      const roomData = this.getRoomData(room);

      socket.emit('room:joined', { room: roomData, player });
      socket.to(`room:${roomCode}`).emit('room:playerJoined', { player });

      // Update lobby
      if (!room.isPrivate) {
        this.io.to('lobby').emit('lobby:roomUpdated', { code: roomCode, ...roomData });
      }

      logger.info(`${socket.username} joined room ${roomCode}`);
    } catch (error) {
      logger.error('Error joining room:', error);
      socket.emit('room:error', { message: '방 참가에 실패했습니다.' });
    }
  }

  async leaveRoom(socket: AuthenticatedSocket) {
    try {
      const roomCode = this.playerRoomMap.get(socket.userId);
      if (!roomCode) return;

      const room = this.rooms.get(roomCode);
      if (!room) return;

      room.players.delete(socket.userId);
      this.playerRoomMap.delete(socket.userId);

      socket.leave(`room:${roomCode}`);

      socket.to(`room:${roomCode}`).emit('room:playerLeft', {
        userId: socket.userId,
        reason: 'left',
      });

      // If host left, transfer or delete room
      if (room.hostId === socket.userId) {
        if (room.players.size > 0) {
          const newHostId = room.players.keys().next().value;
          room.hostId = newHostId;
          const newHost = room.players.get(newHostId);
          if (newHost) {
            newHost.isHost = true;
            this.io.to(`room:${roomCode}`).emit('room:hostChanged', { newHostId });
          }
        } else {
          this.rooms.delete(roomCode);
          this.io.to('lobby').emit('lobby:roomDeleted', { roomCode });
          logger.info(`Room deleted: ${roomCode}`);
          return;
        }
      }

      // Update lobby
      if (!room.isPrivate) {
        const roomData = this.getRoomData(room);
        this.io.to('lobby').emit('lobby:roomUpdated', { code: roomCode, ...roomData });
      }

      logger.info(`${socket.username} left room ${roomCode}`);
    } catch (error) {
      logger.error('Error leaving room:', error);
    }
  }

  async setReady(socket: AuthenticatedSocket, isReady: boolean) {
    try {
      const roomCode = this.playerRoomMap.get(socket.userId);
      if (!roomCode) return;

      const room = this.rooms.get(roomCode);
      if (!room) return;

      const player = room.players.get(socket.userId);
      if (!player) return;

      player.isReady = isReady;

      this.io.to(`room:${roomCode}`).emit('room:playerReady', {
        userId: socket.userId,
        isReady,
      });
    } catch (error) {
      logger.error('Error setting ready:', error);
    }
  }

  async kickPlayer(socket: AuthenticatedSocket, targetUserId: string) {
    try {
      const roomCode = this.playerRoomMap.get(socket.userId);
      if (!roomCode) return;

      const room = this.rooms.get(roomCode);
      if (!room) return;

      if (room.hostId !== socket.userId) {
        socket.emit('room:error', { message: '방장만 추방할 수 있습니다.' });
        return;
      }

      if (!room.players.has(targetUserId)) return;

      room.players.delete(targetUserId);
      this.playerRoomMap.delete(targetUserId);

      const targetSocketId = await this.redis.get(`socket:${targetUserId}`);
      if (targetSocketId) {
        this.io.to(targetSocketId).emit('room:kicked', { reason: '방장에 의해 추방되었습니다.' });
        const targetSocket = this.io.sockets.sockets.get(targetSocketId);
        if (targetSocket) {
          targetSocket.leave(`room:${roomCode}`);
        }
      }

      this.io.to(`room:${roomCode}`).emit('room:playerLeft', {
        userId: targetUserId,
        reason: 'kicked',
      });

      logger.info(`${targetUserId} was kicked from room ${roomCode}`);
    } catch (error) {
      logger.error('Error kicking player:', error);
    }
  }

  async updateSettings(socket: AuthenticatedSocket, settings: Partial<RoomSettings>) {
    try {
      const roomCode = this.playerRoomMap.get(socket.userId);
      if (!roomCode) return;

      const room = this.rooms.get(roomCode);
      if (!room) return;

      if (room.hostId !== socket.userId) {
        socket.emit('room:error', { message: '방장만 설정을 변경할 수 있습니다.' });
        return;
      }

      room.settings = { ...room.settings, ...settings };
      room.mode = settings.mode || room.mode;

      this.io.to(`room:${roomCode}`).emit('room:settingsUpdated', room.settings);

      // Update lobby
      if (!room.isPrivate) {
        const roomData = this.getRoomData(room);
        this.io.to('lobby').emit('lobby:roomUpdated', { code: roomCode, ...roomData });
      }
    } catch (error) {
      logger.error('Error updating settings:', error);
    }
  }

  async startGame(socket: AuthenticatedSocket) {
    try {
      const roomCode = this.playerRoomMap.get(socket.userId);
      if (!roomCode) return;

      const room = this.rooms.get(roomCode);
      if (!room) return;

      if (room.hostId !== socket.userId) {
        socket.emit('room:error', { message: '방장만 게임을 시작할 수 있습니다.' });
        return;
      }

      if (room.players.size < 2) {
        socket.emit('room:error', { message: '최소 2명이 필요합니다.' });
        return;
      }

      const allReady = Array.from(room.players.values()).every((p) => p.isHost || p.isReady);
      if (!allReady) {
        socket.emit('room:error', { message: '모든 플레이어가 준비해야 합니다.' });
        return;
      }

      room.status = 'STARTING';

      // Countdown
      this.io.to(`room:${roomCode}`).emit('room:gameStarting', { countdown: 3 });

      setTimeout(() => {
        room.status = 'IN_GAME';

        // Emit game start event
        this.io.to(`room:${roomCode}`).emit('room:gameStarting', { countdown: 0 });

        // Update lobby
        if (!room.isPrivate) {
          this.io.to('lobby').emit('lobby:roomDeleted', { roomCode });
        }

        logger.info(`Game starting in room ${roomCode}`);
      }, 3000);
    } catch (error) {
      logger.error('Error starting game:', error);
    }
  }

  async sendChat(socket: AuthenticatedSocket, message: string) {
    try {
      const roomCode = this.playerRoomMap.get(socket.userId);
      if (!roomCode) return;

      this.io.to(`room:${roomCode}`).emit('room:chat', {
        userId: socket.userId,
        username: socket.username,
        message,
        timestamp: Date.now(),
      });
    } catch (error) {
      logger.error('Error sending chat:', error);
    }
  }

  async handleDisconnect(socket: AuthenticatedSocket) {
    await this.leaveRoom(socket);
  }

  async getPublicRooms(mode?: string, page: number = 1, limit: number = 20): Promise<RoomData[]> {
    const rooms: RoomData[] = [];

    for (const room of this.rooms.values()) {
      if (room.isPrivate) continue;
      if (room.status !== 'WAITING') continue;
      if (mode && room.mode !== mode) continue;

      rooms.push(this.getRoomData(room));
    }

    // Sort by creation time
    rooms.sort((a, b) => b.createdAt - a.createdAt);

    // Pagination
    const start = (page - 1) * limit;
    return rooms.slice(start, start + limit);
  }

  async cleanupEmptyRooms() {
    const now = Date.now();
    const timeout = 10 * 60 * 1000; // 10 minutes

    for (const [code, room] of this.rooms.entries()) {
      if (room.players.size === 0 && now - room.createdAt > timeout) {
        this.rooms.delete(code);
        this.io.to('lobby').emit('lobby:roomDeleted', { roomCode: code });
        logger.info(`Cleaned up empty room: ${code}`);
      }
    }
  }

  private getRoomData(room: RoomState): RoomData {
    const players = Array.from(room.players.values());
    const host = players.find((p) => p.isHost) || players[0];

    return {
      code: room.code,
      mode: room.mode,
      host,
      players,
      maxPlayers: 2,
      settings: room.settings,
      status: room.status,
      isPrivate: room.isPrivate,
      createdAt: room.createdAt,
    };
  }

  getRoom(roomCode: string): RoomState | undefined {
    return this.rooms.get(roomCode);
  }

  getPlayerRoom(userId: string): string | undefined {
    return this.playerRoomMap.get(userId);
  }
}
