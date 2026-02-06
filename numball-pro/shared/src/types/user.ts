import { Achievement } from './game';

export interface User {
  id: string;
  email: string;
  username: string;
  avatarUrl?: string;
  avatarFrameId?: string;
  titleId?: string;
  bio?: string;
  country: string;

  // Game stats
  rating: number;
  seasonRating: number;
  tier: string;
  level: number;
  experience: number;
  gamesPlayed: number;
  gamesWon: number;
  gamesLost: number;
  gamesDraw: number;
  winStreak: number;
  maxWinStreak: number;
  totalPlayTime: number;

  // Currency
  coins: number;
  gems: number;

  // Status
  isOnline: boolean;
  lastOnlineAt?: Date;

  createdAt: Date;
}

export interface UserStats {
  gamesPlayed: number;
  gamesWon: number;
  gamesLost: number;
  gamesDraw: number;
  winRate: number;
  winStreak: number;
  maxWinStreak: number;
  averageAttempts: number;
  fastestWin: number;
  totalPlayTime: number;
  favoriteMode: string;
}

export interface UserProfile extends User {
  stats: UserStats;
  recentGames: GameSummary[];
  achievements: UserAchievement[];
  rank: {
    global: number;
    season: number;
  };
}

export interface GameSummary {
  id: string;
  mode: string;
  opponentName: string;
  opponentAvatarUrl?: string;
  result: 'WIN' | 'LOSE' | 'DRAW';
  attempts: number;
  ratingChange: number;
  playedAt: Date;
}

export interface UserAchievement {
  achievement: Achievement;
  progress: number;
  maxProgress: number;
  isCompleted: boolean;
  completedAt?: Date;
}
