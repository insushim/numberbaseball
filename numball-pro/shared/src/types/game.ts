/**
 * Game Mode Enumeration
 */
export enum GameMode {
  CLASSIC_3 = 'CLASSIC_3',
  CLASSIC_4 = 'CLASSIC_4',
  CLASSIC_5 = 'CLASSIC_5',
  CLASSIC_6 = 'CLASSIC_6',
  DUPLICATE_3 = 'DUPLICATE_3',
  DUPLICATE_4 = 'DUPLICATE_4',
  SPEED_3 = 'SPEED_3',
  SPEED_4 = 'SPEED_4',
  BLITZ = 'BLITZ',
  MARATHON = 'MARATHON',
  REVERSE = 'REVERSE',
  TEAM = 'TEAM',
}

/**
 * Game Mode Configuration Interface
 */
export interface GameModeConfig {
  mode: GameMode;
  digitCount: number;
  allowDuplicates: boolean;
  timeLimit: number; // seconds, 0 = unlimited
  maxAttempts: number; // 0 = unlimited
  basePoints: number;
  eloMultiplier: number;
  hintsAllowed: boolean;
  itemsAllowed: boolean;
  description: string;
  descriptionEn: string;
  unlockLevel: number;
  iconEmoji: string;
}

/**
 * All Game Mode Configurations
 */
export const GAME_MODE_CONFIGS: Record<GameMode, GameModeConfig> = {
  [GameMode.CLASSIC_3]: {
    mode: GameMode.CLASSIC_3,
    digitCount: 3,
    allowDuplicates: false,
    timeLimit: 30,
    maxAttempts: 10,
    basePoints: 100,
    eloMultiplier: 1.0,
    hintsAllowed: true,
    itemsAllowed: true,
    description: '클래식 3자리 숫자야구',
    descriptionEn: 'Classic 3-digit Number Baseball',
    unlockLevel: 1,
    iconEmoji: '⚾',
  },
  [GameMode.CLASSIC_4]: {
    mode: GameMode.CLASSIC_4,
    digitCount: 4,
    allowDuplicates: false,
    timeLimit: 45,
    maxAttempts: 12,
    basePoints: 150,
    eloMultiplier: 1.2,
    hintsAllowed: true,
    itemsAllowed: true,
    description: '클래식 4자리 숫자야구',
    descriptionEn: 'Classic 4-digit Number Baseball',
    unlockLevel: 5,
    iconEmoji: '🎯',
  },
  [GameMode.CLASSIC_5]: {
    mode: GameMode.CLASSIC_5,
    digitCount: 5,
    allowDuplicates: false,
    timeLimit: 60,
    maxAttempts: 15,
    basePoints: 200,
    eloMultiplier: 1.5,
    hintsAllowed: true,
    itemsAllowed: true,
    description: '클래식 5자리 숫자야구',
    descriptionEn: 'Classic 5-digit Number Baseball',
    unlockLevel: 10,
    iconEmoji: '🏆',
  },
  [GameMode.CLASSIC_6]: {
    mode: GameMode.CLASSIC_6,
    digitCount: 6,
    allowDuplicates: false,
    timeLimit: 90,
    maxAttempts: 20,
    basePoints: 300,
    eloMultiplier: 2.0,
    hintsAllowed: true,
    itemsAllowed: true,
    description: '하드코어 6자리 숫자야구',
    descriptionEn: 'Hardcore 6-digit Number Baseball',
    unlockLevel: 20,
    iconEmoji: '💀',
  },
  [GameMode.DUPLICATE_3]: {
    mode: GameMode.DUPLICATE_3,
    digitCount: 3,
    allowDuplicates: true,
    timeLimit: 30,
    maxAttempts: 12,
    basePoints: 120,
    eloMultiplier: 1.1,
    hintsAllowed: true,
    itemsAllowed: true,
    description: '중복 허용 3자리',
    descriptionEn: '3-digit with Duplicates',
    unlockLevel: 3,
    iconEmoji: '🔢',
  },
  [GameMode.DUPLICATE_4]: {
    mode: GameMode.DUPLICATE_4,
    digitCount: 4,
    allowDuplicates: true,
    timeLimit: 45,
    maxAttempts: 15,
    basePoints: 170,
    eloMultiplier: 1.3,
    hintsAllowed: true,
    itemsAllowed: true,
    description: '중복 허용 4자리',
    descriptionEn: '4-digit with Duplicates',
    unlockLevel: 8,
    iconEmoji: '🔁',
  },
  [GameMode.SPEED_3]: {
    mode: GameMode.SPEED_3,
    digitCount: 3,
    allowDuplicates: false,
    timeLimit: 10,
    maxAttempts: 10,
    basePoints: 150,
    eloMultiplier: 1.3,
    hintsAllowed: false,
    itemsAllowed: false,
    description: '스피드 모드 - 10초',
    descriptionEn: 'Speed Mode - 10 seconds',
    unlockLevel: 7,
    iconEmoji: '⚡',
  },
  [GameMode.SPEED_4]: {
    mode: GameMode.SPEED_4,
    digitCount: 4,
    allowDuplicates: false,
    timeLimit: 15,
    maxAttempts: 12,
    basePoints: 200,
    eloMultiplier: 1.5,
    hintsAllowed: false,
    itemsAllowed: false,
    description: '스피드 모드 - 15초',
    descriptionEn: 'Speed Mode - 15 seconds',
    unlockLevel: 12,
    iconEmoji: '⚡',
  },
  [GameMode.BLITZ]: {
    mode: GameMode.BLITZ,
    digitCount: 3,
    allowDuplicates: false,
    timeLimit: 5,
    maxAttempts: 8,
    basePoints: 200,
    eloMultiplier: 1.8,
    hintsAllowed: false,
    itemsAllowed: false,
    description: '번개전 - 5초',
    descriptionEn: 'Blitz - 5 seconds',
    unlockLevel: 15,
    iconEmoji: '🔥',
  },
  [GameMode.MARATHON]: {
    mode: GameMode.MARATHON,
    digitCount: 4,
    allowDuplicates: false,
    timeLimit: 0,
    maxAttempts: 0,
    basePoints: 250,
    eloMultiplier: 1.0,
    hintsAllowed: true,
    itemsAllowed: false,
    description: '마라톤 - 최소 시도로 승리',
    descriptionEn: 'Marathon - Win with minimum attempts',
    unlockLevel: 10,
    iconEmoji: '🏃',
  },
  [GameMode.REVERSE]: {
    mode: GameMode.REVERSE,
    digitCount: 4,
    allowDuplicates: false,
    timeLimit: 45,
    maxAttempts: 12,
    basePoints: 180,
    eloMultiplier: 1.4,
    hintsAllowed: true,
    itemsAllowed: true,
    description: '역전 모드 - 상대가 숫자 설정',
    descriptionEn: 'Reverse - Opponent sets the number',
    unlockLevel: 18,
    iconEmoji: '🔄',
  },
  [GameMode.TEAM]: {
    mode: GameMode.TEAM,
    digitCount: 4,
    allowDuplicates: false,
    timeLimit: 60,
    maxAttempts: 16,
    basePoints: 200,
    eloMultiplier: 1.2,
    hintsAllowed: true,
    itemsAllowed: true,
    description: '팀전 2vs2',
    descriptionEn: 'Team Battle 2vs2',
    unlockLevel: 15,
    iconEmoji: '👥',
  },
};

/**
 * Game Status Enumeration
 */
export enum GameStatus {
  WAITING = 'WAITING',
  SETTING_NUMBERS = 'SETTING_NUMBERS',
  IN_PROGRESS = 'IN_PROGRESS',
  PAUSED = 'PAUSED',
  FINISHED = 'FINISHED',
  ABANDONED = 'ABANDONED',
}

/**
 * Guess Result Interface
 */
export interface GuessResult {
  guess: string;
  strikes: number;
  balls: number;
  timestamp: number;
  turnNumber: number;
  timeSpent: number;
}

/**
 * Player Game State
 */
export interface PlayerGameState {
  userId: string;
  username: string;
  avatarUrl?: string;
  secretNumber: string;
  guesses: GuessResult[];
  isReady: boolean;
  hasWon: boolean;
  remainingTime: number;
  hintsUsed: number;
  itemsUsed: string[];
  score: number;
  connected: boolean;
}

/**
 * Complete Game State
 */
export interface GameState {
  id: string;
  roomCode: string;
  mode: GameMode;
  config: GameModeConfig;
  players: PlayerGameState[];
  currentTurn: number;
  currentPlayerIndex: number;
  status: GameStatus;
  isRanked: boolean;
  startedAt: number;
  endedAt?: number;
  winner?: string;
  draw: boolean;
}

/**
 * Game End Result
 */
export interface GameEndResult {
  type: 'WIN' | 'LOSE' | 'DRAW';
  winnerId?: string;
  winnerName?: string;
  reason: string;
  myAttempts: number;
  mySecret: string;
  opponentSecret: string;
  ratingBefore: number;
  ratingAfter: number;
  ratingChange: number;
  coinsEarned: number;
  expEarned: number;
  levelUp: boolean;
  newLevel?: number;
  achievementsUnlocked: Achievement[];
  gameStats: GameStats;
}

/**
 * Game Statistics
 */
export interface GameStats {
  totalTime: number;
  averageGuessTime: number;
  hintsUsed: number;
  itemsUsed: number;
  perfectGuesses: number;
}

/**
 * Hint Types
 */
export interface Hint {
  type: 'POSSIBILITY_COUNT' | 'POSITION_HINT' | 'CONTAINS_DIGIT' | 'EXCLUDE_DIGIT';
  content: string;
  cost: number;
}

/**
 * Game Item Types
 */
export enum GameItemType {
  TIME_EXTEND = 'TIME_EXTEND',
  HINT_DIGIT = 'HINT_DIGIT',
  HINT_POSITION = 'HINT_POSITION',
  EXTRA_GUESS = 'EXTRA_GUESS',
  SHIELD = 'SHIELD',
}

/**
 * Achievement Interface
 */
export interface Achievement {
  id: string;
  code: string;
  name: string;
  description: string;
  iconUrl?: string;
  rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
}
