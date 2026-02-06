import { GameModeConfig, GuessResult, Achievement } from './game';

// ==================== Client -> Server ====================

export interface CreateRoomData {
  mode: string;
  isPrivate: boolean;
  password?: string;
  timeLimit?: number;
  maxAttempts?: number;
  hintsAllowed?: boolean;
  itemsAllowed?: boolean;
  isRanked?: boolean;
}

export interface ClientToServerEvents {
  // Auth
  'auth:authenticate': (data: { token: string }) => void;
  'auth:logout': () => void;

  // Lobby
  'lobby:join': () => void;
  'lobby:leave': () => void;
  'lobby:getRooms': (data: { mode?: string; page?: number; limit?: number }) => void;
  'lobby:refresh': () => void;

  // Room
  'room:create': (data: CreateRoomData) => void;
  'room:join': (data: { roomCode: string; password?: string }) => void;
  'room:leave': () => void;
  'room:ready': (data: { isReady: boolean }) => void;
  'room:kick': (data: { userId: string }) => void;
  'room:updateSettings': (data: Partial<RoomSettings>) => void;
  'room:startGame': () => void;
  'room:inviteFriend': (data: { friendId: string }) => void;
  'room:chat': (data: { message: string }) => void;

  // Matchmaking
  'matchmaking:start': (data: { mode: string; isRanked?: boolean }) => void;
  'matchmaking:cancel': () => void;

  // Game
  'game:setSecret': (data: { secret: string }) => void;
  'game:guess': (data: { guess: string }) => void;
  'game:useHint': (data: { hintLevel: number }) => void;
  'game:useItem': (data: { itemId: string }) => void;
  'game:surrender': () => void;
  'game:rematch': () => void;
  'game:declineRematch': () => void;

  // Chat
  'chat:sendMessage': (data: { message: string; type?: 'TEXT' | 'EMOJI' | 'QUICK' }) => void;
  'chat:sendEmoji': (data: { emojiId: string }) => void;
  'chat:typing': (data: { isTyping: boolean }) => void;

  // Friends
  'friend:sendRequest': (data: { userId: string }) => void;
  'friend:acceptRequest': (data: { requestId: string }) => void;
  'friend:rejectRequest': (data: { requestId: string }) => void;
  'friend:remove': (data: { friendId: string }) => void;
  'friend:block': (data: { userId: string }) => void;

  // Misc
  'ping': () => void;
  'notification:markRead': (data: { notificationId: string }) => void;
  'notification:markAllRead': () => void;
}

// ==================== Server -> Client ====================

export interface RoomData {
  code: string;
  mode: string;
  host: PlayerData;
  players: PlayerData[];
  maxPlayers: number;
  settings: RoomSettings;
  status: 'WAITING' | 'STARTING' | 'IN_GAME';
  isPrivate: boolean;
  createdAt: number;
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

export interface PlayerData {
  userId: string;
  username: string;
  avatarUrl?: string;
  avatarFrameId?: string;
  rating: number;
  tier: string;
  level: number;
  isReady: boolean;
  isHost: boolean;
  isOnline: boolean;
  team?: number;
}

export interface UserData extends PlayerData {
  email: string;
  coins: number;
  gems: number;
  gamesPlayed: number;
  gamesWon: number;
  winRate: number;
}

export interface GameStartData {
  gameId: string;
  roomCode: string;
  mode: string;
  config: GameModeConfig;
  players: PlayerData[];
  yourIndex: number;
  isRanked: boolean;
}

export interface GuessResultData {
  oderId: string;
  turnNumber: number;
  guess: string;
  strikes: number;
  balls: number;
  timeSpent: number;
  isCorrect: boolean;
  remainingAttempts: number;
}

export interface OpponentGuessData {
  oderId: string;
  turnNumber: number;
  strikes: number;
  balls: number;
  timeSpent: number;
  isCorrect: boolean;
}

export interface HintData {
  type: string;
  content: string;
  cost: number;
}

export interface ItemEffectData {
  itemId: string;
  itemName: string;
  effect: string;
  value: number;
  duration?: number;
}

export interface GameEndData {
  gameId: string;
  result: 'WIN' | 'LOSE' | 'DRAW';
  winnerId?: string;
  winnerName?: string;
  reason: string;

  myAttempts: number;
  mySecret: string;
  opponentSecret: string;
  opponentAttempts: number;

  ratingBefore: number;
  ratingAfter: number;
  ratingChange: number;

  tierBefore: string;
  tierAfter: string;
  tierChanged: boolean;

  coinsEarned: number;
  expEarned: number;
  levelUp: boolean;
  newLevel?: number;

  achievementsUnlocked: Achievement[];

  gameStats: {
    totalTime: number;
    averageGuessTime: number;
    hintsUsed: number;
    itemsUsed: number;
    perfectGuesses: number;
  };

  newRecords?: {
    type: string;
    value: number;
  }[];
}

export interface GameStateSync {
  gameId: string;
  status: string;
  currentTurn: number;
  currentPlayerIndex: number;
  players: {
    oderId: string;
    guesses: GuessResult[];
    hintsUsed: number;
    connected: boolean;
  }[];
  remainingTime?: number;
}

export interface ChatMessageData {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatarUrl?: string;
  message: string;
  type: 'TEXT' | 'EMOJI' | 'QUICK' | 'SYSTEM';
  timestamp: number;
}

export interface NotificationData {
  id: string;
  type: string;
  title: string;
  message: string;
  data?: unknown;
  timestamp: number;
  isRead: boolean;
}

export interface ServerToClientEvents {
  // Auth
  'auth:authenticated': (data: { user: UserData }) => void;
  'auth:error': (data: { message: string; code?: string }) => void;
  'connection:established': (data: { socketId: string; serverTime: number }) => void;

  // Lobby
  'lobby:roomList': (data: { rooms: RoomData[]; total: number; page: number }) => void;
  'lobby:roomCreated': (data: RoomData) => void;
  'lobby:roomUpdated': (data: Partial<RoomData> & { code: string }) => void;
  'lobby:roomDeleted': (data: { roomCode: string }) => void;
  'lobby:onlineCount': (data: { count: number; inGame: number; inLobby: number }) => void;

  // Room
  'room:created': (data: { room: RoomData }) => void;
  'room:joined': (data: { room: RoomData; player: PlayerData }) => void;
  'room:left': (data: { userId: string; username: string }) => void;
  'room:playerJoined': (data: { player: PlayerData }) => void;
  'room:playerLeft': (data: { userId: string; reason?: string }) => void;
  'room:playerReady': (data: { userId: string; isReady: boolean }) => void;
  'room:kicked': (data: { reason: string }) => void;
  'room:settingsUpdated': (data: RoomSettings) => void;
  'room:hostChanged': (data: { newHostId: string }) => void;
  'room:gameStarting': (data: { countdown: number }) => void;
  'room:error': (data: { message: string; code?: string }) => void;
  'room:invitation': (data: { from: PlayerData; roomCode: string; mode: string }) => void;
  'room:chat': (data: { userId: string; username: string; message: string; timestamp: number }) => void;

  // Matchmaking
  'matchmaking:searching': (data: { estimatedTime: number; playersInQueue: number; elapsedTime: number }) => void;
  'matchmaking:found': (data: { opponent: PlayerData; roomCode: string }) => void;
  'matchmaking:cancelled': () => void;
  'matchmaking:error': (data: { message: string }) => void;
  'matchmaking:statusUpdate': (data: { status: string; ratingRange: number }) => void;

  // Game
  'game:started': (data: GameStartData) => void;
  'game:setSecretPhase': (data: { timeLimit: number }) => void;
  'game:secretSet': (data: { userId: string }) => void;
  'game:allSecretsSet': () => void;
  'game:yourTurn': (data: { timeLimit: number; turnNumber: number; remainingAttempts: number }) => void;
  'game:opponentTurn': (data: { oderId: string; turnNumber: number }) => void;
  'game:guessResult': (data: GuessResultData) => void;
  'game:opponentGuessed': (data: OpponentGuessData) => void;
  'game:hintResult': (data: { oderId: string; hint: HintData }) => void;
  'game:itemUsed': (data: { oderId: string; item: ItemEffectData }) => void;
  'game:timeWarning': (data: { secondsLeft: number }) => void;
  'game:timeout': (data: { oderId: string }) => void;
  'game:ended': (data: GameEndData) => void;
  'game:rematchRequested': (data: { oderId: string }) => void;
  'game:rematchAccepted': (data: { newRoomCode: string }) => void;
  'game:rematchDeclined': (data: { oderId: string }) => void;
  'game:playerDisconnected': (data: { oderId: string; waitTime: number }) => void;
  'game:playerReconnected': (data: { oderId: string }) => void;
  'game:surrendered': (data: { oderId: string }) => void;
  'game:error': (data: { message: string; code?: string }) => void;
  'game:stateSync': (data: GameStateSync) => void;

  // Chat
  'chat:message': (data: ChatMessageData) => void;
  'chat:emoji': (data: { senderId: string; emojiId: string }) => void;
  'chat:systemMessage': (data: { message: string; type?: string }) => void;
  'chat:typing': (data: { userId: string; isTyping: boolean }) => void;

  // Friends
  'friend:requestReceived': (data: { from: PlayerData }) => void;
  'friend:requestAccepted': (data: { friend: PlayerData }) => void;
  'friend:requestRejected': (data: { userId: string }) => void;
  'friend:removed': (data: { friendId: string }) => void;
  'friend:online': (data: { friendId: string }) => void;
  'friend:offline': (data: { friendId: string }) => void;
  'friend:inGame': (data: { friendId: string; mode: string }) => void;

  // Notifications
  'notification:new': (data: NotificationData) => void;
  'notification:count': (data: { unread: number }) => void;

  // System
  'pong': (data: { timestamp: number; latency: number }) => void;
  'error': (data: { code: string; message: string }) => void;
  'maintenance:warning': (data: { startsIn: number; duration: number; message: string }) => void;
  'maintenance:start': (data: { message: string; estimatedEnd: number }) => void;
  'forceDisconnect': (data: { reason: string }) => void;
}
