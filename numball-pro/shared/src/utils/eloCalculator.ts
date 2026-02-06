/**
 * ELO Configuration
 */
export interface EloConfig {
  kFactor: number;
  minRating: number;
  maxRating: number;
  provisionalGames: number;
  provisionalKFactor: number;
}

export const DEFAULT_ELO_CONFIG: EloConfig = {
  kFactor: 32,
  minRating: 100,
  maxRating: 3000,
  provisionalGames: 10,
  provisionalKFactor: 64,
};

/**
 * ELO Player
 */
export interface EloPlayer {
  oderId: string;
  rating: number;
  gamesPlayed: number;
}

/**
 * ELO Result
 */
export interface EloResult {
  oderId: string;
  newRating: number;
  ratingChange: number;
}

/**
 * ELO Calculator Class
 */
export class EloCalculator {
  private config: EloConfig;

  constructor(config: Partial<EloConfig> = {}) {
    this.config = { ...DEFAULT_ELO_CONFIG, ...config };
  }

  /**
   * Calculate expected score
   */
  calculateExpectedScore(playerRating: number, opponentRating: number): number {
    return 1 / (1 + Math.pow(10, (opponentRating - playerRating) / 400));
  }

  /**
   * Determine K-factor
   */
  getKFactor(player: EloPlayer, modeMultiplier: number = 1): number {
    const baseK =
      player.gamesPlayed < this.config.provisionalGames
        ? this.config.provisionalKFactor
        : this.config.kFactor;

    let k = baseK;
    if (player.rating > 2400) k = baseK * 0.5;
    else if (player.rating > 2000) k = baseK * 0.75;

    return k * modeMultiplier;
  }

  /**
   * Calculate new rating
   */
  calculateNewRating(
    player: EloPlayer,
    opponent: EloPlayer,
    score: number,
    modeMultiplier: number = 1
  ): { newRating: number; change: number } {
    const expected = this.calculateExpectedScore(player.rating, opponent.rating);
    const k = this.getKFactor(player, modeMultiplier);

    const change = Math.round(k * (score - expected));
    let newRating = player.rating + change;

    newRating = Math.max(this.config.minRating, Math.min(this.config.maxRating, newRating));

    return { newRating, change };
  }

  /**
   * Process game result
   */
  processGameResult(
    player1: EloPlayer,
    player2: EloPlayer,
    winnerId: string | null,
    modeMultiplier: number = 1
  ): { player1Result: EloResult; player2Result: EloResult } {
    const isDraw = winnerId === null;
    const player1Won = winnerId === player1.oderId;

    const player1Score = isDraw ? 0.5 : player1Won ? 1 : 0;
    const player2Score = isDraw ? 0.5 : player1Won ? 0 : 1;

    const p1Result = this.calculateNewRating(player1, player2, player1Score, modeMultiplier);
    const p2Result = this.calculateNewRating(player2, player1, player2Score, modeMultiplier);

    return {
      player1Result: {
        oderId: player1.oderId,
        newRating: p1Result.newRating,
        ratingChange: p1Result.change,
      },
      player2Result: {
        oderId: player2.oderId,
        newRating: p2Result.newRating,
        ratingChange: p2Result.change,
      },
    };
  }
}

// ==================== Tier System ====================

/**
 * Tier Enumeration
 */
export enum Tier {
  BRONZE_5 = 'BRONZE_5',
  BRONZE_4 = 'BRONZE_4',
  BRONZE_3 = 'BRONZE_3',
  BRONZE_2 = 'BRONZE_2',
  BRONZE_1 = 'BRONZE_1',
  SILVER_5 = 'SILVER_5',
  SILVER_4 = 'SILVER_4',
  SILVER_3 = 'SILVER_3',
  SILVER_2 = 'SILVER_2',
  SILVER_1 = 'SILVER_1',
  GOLD_5 = 'GOLD_5',
  GOLD_4 = 'GOLD_4',
  GOLD_3 = 'GOLD_3',
  GOLD_2 = 'GOLD_2',
  GOLD_1 = 'GOLD_1',
  PLATINUM_5 = 'PLATINUM_5',
  PLATINUM_4 = 'PLATINUM_4',
  PLATINUM_3 = 'PLATINUM_3',
  PLATINUM_2 = 'PLATINUM_2',
  PLATINUM_1 = 'PLATINUM_1',
  DIAMOND_5 = 'DIAMOND_5',
  DIAMOND_4 = 'DIAMOND_4',
  DIAMOND_3 = 'DIAMOND_3',
  DIAMOND_2 = 'DIAMOND_2',
  DIAMOND_1 = 'DIAMOND_1',
  MASTER = 'MASTER',
  GRANDMASTER = 'GRANDMASTER',
  LEGEND = 'LEGEND',
}

/**
 * Tier Information
 */
export interface TierInfo {
  tier: Tier;
  name: string;
  nameEn: string;
  minRating: number;
  maxRating: number;
  icon: string;
  color: string;
  bgGradient: string;
  seasonRewardCoins: number;
}

/**
 * Tier Configuration
 */
export const TIER_CONFIG: TierInfo[] = [
  { tier: Tier.BRONZE_5, name: '브론즈 5', nameEn: 'Bronze 5', minRating: 0, maxRating: 199, icon: '🥉', color: '#CD7F32', bgGradient: 'from-amber-700 to-amber-900', seasonRewardCoins: 100 },
  { tier: Tier.BRONZE_4, name: '브론즈 4', nameEn: 'Bronze 4', minRating: 200, maxRating: 299, icon: '🥉', color: '#CD7F32', bgGradient: 'from-amber-700 to-amber-900', seasonRewardCoins: 150 },
  { tier: Tier.BRONZE_3, name: '브론즈 3', nameEn: 'Bronze 3', minRating: 300, maxRating: 399, icon: '🥉', color: '#CD7F32', bgGradient: 'from-amber-700 to-amber-900', seasonRewardCoins: 200 },
  { tier: Tier.BRONZE_2, name: '브론즈 2', nameEn: 'Bronze 2', minRating: 400, maxRating: 499, icon: '🥉', color: '#CD7F32', bgGradient: 'from-amber-700 to-amber-900', seasonRewardCoins: 250 },
  { tier: Tier.BRONZE_1, name: '브론즈 1', nameEn: 'Bronze 1', minRating: 500, maxRating: 599, icon: '🥉', color: '#CD7F32', bgGradient: 'from-amber-700 to-amber-900', seasonRewardCoins: 300 },
  { tier: Tier.SILVER_5, name: '실버 5', nameEn: 'Silver 5', minRating: 600, maxRating: 699, icon: '🥈', color: '#C0C0C0', bgGradient: 'from-gray-400 to-gray-600', seasonRewardCoins: 400 },
  { tier: Tier.SILVER_4, name: '실버 4', nameEn: 'Silver 4', minRating: 700, maxRating: 799, icon: '🥈', color: '#C0C0C0', bgGradient: 'from-gray-400 to-gray-600', seasonRewardCoins: 450 },
  { tier: Tier.SILVER_3, name: '실버 3', nameEn: 'Silver 3', minRating: 800, maxRating: 899, icon: '🥈', color: '#C0C0C0', bgGradient: 'from-gray-400 to-gray-600', seasonRewardCoins: 500 },
  { tier: Tier.SILVER_2, name: '실버 2', nameEn: 'Silver 2', minRating: 900, maxRating: 999, icon: '🥈', color: '#C0C0C0', bgGradient: 'from-gray-400 to-gray-600', seasonRewardCoins: 550 },
  { tier: Tier.SILVER_1, name: '실버 1', nameEn: 'Silver 1', minRating: 1000, maxRating: 1099, icon: '🥈', color: '#C0C0C0', bgGradient: 'from-gray-400 to-gray-600', seasonRewardCoins: 600 },
  { tier: Tier.GOLD_5, name: '골드 5', nameEn: 'Gold 5', minRating: 1100, maxRating: 1199, icon: '🥇', color: '#FFD700', bgGradient: 'from-yellow-400 to-yellow-600', seasonRewardCoins: 700 },
  { tier: Tier.GOLD_4, name: '골드 4', nameEn: 'Gold 4', minRating: 1200, maxRating: 1299, icon: '🥇', color: '#FFD700', bgGradient: 'from-yellow-400 to-yellow-600', seasonRewardCoins: 750 },
  { tier: Tier.GOLD_3, name: '골드 3', nameEn: 'Gold 3', minRating: 1300, maxRating: 1399, icon: '🥇', color: '#FFD700', bgGradient: 'from-yellow-400 to-yellow-600', seasonRewardCoins: 800 },
  { tier: Tier.GOLD_2, name: '골드 2', nameEn: 'Gold 2', minRating: 1400, maxRating: 1499, icon: '🥇', color: '#FFD700', bgGradient: 'from-yellow-400 to-yellow-600', seasonRewardCoins: 850 },
  { tier: Tier.GOLD_1, name: '골드 1', nameEn: 'Gold 1', minRating: 1500, maxRating: 1599, icon: '🥇', color: '#FFD700', bgGradient: 'from-yellow-400 to-yellow-600', seasonRewardCoins: 900 },
  { tier: Tier.PLATINUM_5, name: '플래티넘 5', nameEn: 'Platinum 5', minRating: 1600, maxRating: 1699, icon: '💎', color: '#E5E4E2', bgGradient: 'from-cyan-300 to-cyan-500', seasonRewardCoins: 1000 },
  { tier: Tier.PLATINUM_4, name: '플래티넘 4', nameEn: 'Platinum 4', minRating: 1700, maxRating: 1799, icon: '💎', color: '#E5E4E2', bgGradient: 'from-cyan-300 to-cyan-500', seasonRewardCoins: 1100 },
  { tier: Tier.PLATINUM_3, name: '플래티넘 3', nameEn: 'Platinum 3', minRating: 1800, maxRating: 1899, icon: '💎', color: '#E5E4E2', bgGradient: 'from-cyan-300 to-cyan-500', seasonRewardCoins: 1200 },
  { tier: Tier.PLATINUM_2, name: '플래티넘 2', nameEn: 'Platinum 2', minRating: 1900, maxRating: 1999, icon: '💎', color: '#E5E4E2', bgGradient: 'from-cyan-300 to-cyan-500', seasonRewardCoins: 1300 },
  { tier: Tier.PLATINUM_1, name: '플래티넘 1', nameEn: 'Platinum 1', minRating: 2000, maxRating: 2099, icon: '💎', color: '#E5E4E2', bgGradient: 'from-cyan-300 to-cyan-500', seasonRewardCoins: 1400 },
  { tier: Tier.DIAMOND_5, name: '다이아몬드 5', nameEn: 'Diamond 5', minRating: 2100, maxRating: 2199, icon: '💠', color: '#B9F2FF', bgGradient: 'from-blue-300 to-blue-500', seasonRewardCoins: 1600 },
  { tier: Tier.DIAMOND_4, name: '다이아몬드 4', nameEn: 'Diamond 4', minRating: 2200, maxRating: 2299, icon: '💠', color: '#B9F2FF', bgGradient: 'from-blue-300 to-blue-500', seasonRewardCoins: 1700 },
  { tier: Tier.DIAMOND_3, name: '다이아몬드 3', nameEn: 'Diamond 3', minRating: 2300, maxRating: 2399, icon: '💠', color: '#B9F2FF', bgGradient: 'from-blue-300 to-blue-500', seasonRewardCoins: 1800 },
  { tier: Tier.DIAMOND_2, name: '다이아몬드 2', nameEn: 'Diamond 2', minRating: 2400, maxRating: 2499, icon: '💠', color: '#B9F2FF', bgGradient: 'from-blue-300 to-blue-500', seasonRewardCoins: 1900 },
  { tier: Tier.DIAMOND_1, name: '다이아몬드 1', nameEn: 'Diamond 1', minRating: 2500, maxRating: 2599, icon: '💠', color: '#B9F2FF', bgGradient: 'from-blue-300 to-blue-500', seasonRewardCoins: 2000 },
  { tier: Tier.MASTER, name: '마스터', nameEn: 'Master', minRating: 2600, maxRating: 2799, icon: '👑', color: '#9B59B6', bgGradient: 'from-purple-500 to-purple-700', seasonRewardCoins: 2500 },
  { tier: Tier.GRANDMASTER, name: '그랜드마스터', nameEn: 'Grandmaster', minRating: 2800, maxRating: 2999, icon: '🏆', color: '#E74C3C', bgGradient: 'from-red-500 to-red-700', seasonRewardCoins: 3000 },
  { tier: Tier.LEGEND, name: '레전드', nameEn: 'Legend', minRating: 3000, maxRating: 9999, icon: '🌟', color: '#F39C12', bgGradient: 'from-orange-400 to-red-500', seasonRewardCoins: 5000 },
];

/**
 * Get tier info by rating
 */
export function getTierByRating(rating: number): TierInfo {
  for (let i = TIER_CONFIG.length - 1; i >= 0; i--) {
    if (rating >= TIER_CONFIG[i].minRating) {
      return TIER_CONFIG[i];
    }
  }
  return TIER_CONFIG[0];
}

/**
 * Get next tier
 */
export function getNextTier(currentTier: Tier): TierInfo | null {
  const currentIndex = TIER_CONFIG.findIndex((t) => t.tier === currentTier);
  if (currentIndex < TIER_CONFIG.length - 1) {
    return TIER_CONFIG[currentIndex + 1];
  }
  return null;
}

/**
 * Calculate tier progress
 */
export function getRatingProgress(rating: number): {
  current: number;
  max: number;
  percentage: number;
  pointsToNext: number;
} {
  const tier = getTierByRating(rating);
  const nextTier = getNextTier(tier.tier);

  if (!nextTier) {
    return { current: rating, max: rating, percentage: 100, pointsToNext: 0 };
  }

  const current = rating - tier.minRating;
  const max = nextTier.minRating - tier.minRating;
  const percentage = Math.round((current / max) * 100);
  const pointsToNext = nextTier.minRating - rating;

  return { current, max, percentage, pointsToNext };
}

export default EloCalculator;
