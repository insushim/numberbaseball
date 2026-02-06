export interface Room {
  code: string;
  mode: string;
  host: RoomPlayer;
  players: RoomPlayer[];
  maxPlayers: number;
  settings: RoomSettings;
  status: RoomStatus;
  isPrivate: boolean;
  password?: string;
  createdAt: number;
}

export interface RoomPlayer {
  userId: string;
  username: string;
  avatarUrl?: string;
  rating: number;
  tier: string;
  level: number;
  isReady: boolean;
  isHost: boolean;
  isOnline: boolean;
  team?: number;
}

export interface RoomSettings {
  mode: string;
  timeLimit: number;
  maxAttempts: number;
  hintsAllowed: boolean;
  itemsAllowed: boolean;
  isRanked: boolean;
  isPrivate: boolean;
}

export enum RoomStatus {
  WAITING = 'WAITING',
  STARTING = 'STARTING',
  IN_GAME = 'IN_GAME',
  FINISHED = 'FINISHED',
}
