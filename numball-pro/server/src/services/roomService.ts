import { redis } from '../config/redis';
import { GameMode } from '@numball/shared';

export interface RoomPlayer {
  id: string;
  username: string;
  socketId: string;
  isReady: boolean;
  isHost: boolean;
  rating: number;
  tier: string;
}

export interface Room {
  code: string;
  hostId: string;
  mode: GameMode;
  maxPlayers: number;
  isPrivate: boolean;
  players: RoomPlayer[];
  status: 'waiting' | 'starting' | 'in_game';
  createdAt: number;
}

export class RoomService {
  private static readonly ROOM_PREFIX = 'room:';
  private static readonly ROOM_LIST_KEY = 'rooms:public';

  static generateRoomCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  static async createRoom(
    hostPlayer: Omit<RoomPlayer, 'isReady' | 'isHost'>,
    settings: { mode: GameMode; maxPlayers: number; isPrivate: boolean }
  ): Promise<Room> {
    const code = this.generateRoomCode();

    const room: Room = {
      code,
      hostId: hostPlayer.id,
      mode: settings.mode,
      maxPlayers: settings.maxPlayers,
      isPrivate: settings.isPrivate,
      players: [
        {
          ...hostPlayer,
          isReady: false,
          isHost: true,
        },
      ],
      status: 'waiting',
      createdAt: Date.now(),
    };

    await redis.set(
      `${this.ROOM_PREFIX}${code}`,
      JSON.stringify(room),
      'EX',
      3600 // 1 hour expiry
    );

    if (!settings.isPrivate) {
      await redis.sadd(this.ROOM_LIST_KEY, code);
    }

    return room;
  }

  static async getRoom(code: string): Promise<Room | null> {
    const data = await redis.get(`${this.ROOM_PREFIX}${code}`);
    return data ? JSON.parse(data) : null;
  }

  static async updateRoom(room: Room): Promise<void> {
    await redis.set(
      `${this.ROOM_PREFIX}${room.code}`,
      JSON.stringify(room),
      'EX',
      3600
    );
  }

  static async deleteRoom(code: string): Promise<void> {
    await redis.del(`${this.ROOM_PREFIX}${code}`);
    await redis.srem(this.ROOM_LIST_KEY, code);
  }

  static async joinRoom(
    code: string,
    player: Omit<RoomPlayer, 'isReady' | 'isHost'>
  ): Promise<Room | null> {
    const room = await this.getRoom(code);
    if (!room) return null;
    if (room.players.length >= room.maxPlayers) return null;
    if (room.status !== 'waiting') return null;

    // Check if player already in room
    if (room.players.some((p) => p.id === player.id)) {
      return room;
    }

    room.players.push({
      ...player,
      isReady: false,
      isHost: false,
    });

    await this.updateRoom(room);
    return room;
  }

  static async leaveRoom(code: string, playerId: string): Promise<Room | null> {
    const room = await this.getRoom(code);
    if (!room) return null;

    room.players = room.players.filter((p) => p.id !== playerId);

    if (room.players.length === 0) {
      await this.deleteRoom(code);
      return null;
    }

    // Transfer host if host left
    if (room.hostId === playerId) {
      room.hostId = room.players[0].id;
      room.players[0].isHost = true;
    }

    await this.updateRoom(room);
    return room;
  }

  static async setPlayerReady(
    code: string,
    playerId: string,
    ready: boolean
  ): Promise<Room | null> {
    const room = await this.getRoom(code);
    if (!room) return null;

    const player = room.players.find((p) => p.id === playerId);
    if (!player) return null;

    player.isReady = ready;
    await this.updateRoom(room);
    return room;
  }

  static async updateRoomSettings(
    code: string,
    hostId: string,
    settings: Partial<{ mode: GameMode; maxPlayers: number; isPrivate: boolean }>
  ): Promise<Room | null> {
    const room = await this.getRoom(code);
    if (!room) return null;
    if (room.hostId !== hostId) return null;

    if (settings.mode !== undefined) room.mode = settings.mode;
    if (settings.maxPlayers !== undefined) room.maxPlayers = settings.maxPlayers;
    if (settings.isPrivate !== undefined) {
      room.isPrivate = settings.isPrivate;
      if (settings.isPrivate) {
        await redis.srem(this.ROOM_LIST_KEY, code);
      } else {
        await redis.sadd(this.ROOM_LIST_KEY, code);
      }
    }

    await this.updateRoom(room);
    return room;
  }

  static async getPublicRooms(): Promise<Room[]> {
    const codes = await redis.smembers(this.ROOM_LIST_KEY);
    const rooms: Room[] = [];

    for (const code of codes) {
      const room = await this.getRoom(code);
      if (room && room.status === 'waiting' && room.players.length < room.maxPlayers) {
        rooms.push(room);
      }
    }

    return rooms;
  }

  static async getRoomByPlayerId(playerId: string): Promise<Room | null> {
    // This is not efficient but works for now
    const codes = await redis.keys(`${this.ROOM_PREFIX}*`);

    for (const key of codes) {
      const data = await redis.get(key);
      if (data) {
        const room: Room = JSON.parse(data);
        if (room.players.some((p) => p.id === playerId)) {
          return room;
        }
      }
    }

    return null;
  }
}
