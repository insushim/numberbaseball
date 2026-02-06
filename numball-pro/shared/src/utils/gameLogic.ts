import { GameModeConfig, GuessResult, Hint } from '../types/game';

/**
 * Validation Result Interface
 */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Game Result Type
 */
export interface GameResult {
  type: 'WIN' | 'DRAW' | 'CONTINUE' | 'TIMEOUT' | 'FORFEIT';
  winnerId?: string;
  winnerName?: string;
  reason?: string;
  attempts?: number;
}

/**
 * Number Baseball Core Logic Class
 */
export class NumberBaseballEngine {
  // ==================== Number Generation ====================

  /**
   * Generate a random secret number
   * @param digitCount Number of digits
   * @param allowDuplicates Whether duplicates are allowed
   * @returns Generated secret number
   */
  static generateSecretNumber(digitCount: number, allowDuplicates: boolean): string {
    const digits = '0123456789'.split('');
    let result = '';

    if (allowDuplicates) {
      for (let i = 0; i < digitCount; i++) {
        result += digits[Math.floor(Math.random() * 10)];
      }
    } else {
      const shuffled = [...digits].sort(() => Math.random() - 0.5);
      result = shuffled.slice(0, digitCount).join('');
    }

    return result;
  }

  // ==================== Result Calculation ====================

  /**
   * Calculate strikes and balls
   * @param secret Secret number
   * @param guess Guess number
   * @returns Strikes and balls count
   */
  static calculateResult(secret: string, guess: string): { strikes: number; balls: number } {
    let strikes = 0;
    let balls = 0;

    const secretArr = secret.split('');
    const guessArr = guess.split('');

    // Strike: Same position and digit
    for (let i = 0; i < secretArr.length; i++) {
      if (secretArr[i] === guessArr[i]) {
        strikes++;
      }
    }

    // Ball: Digit exists but in different position
    for (let i = 0; i < guessArr.length; i++) {
      if (secretArr[i] !== guessArr[i] && secretArr.includes(guessArr[i])) {
        balls++;
      }
    }

    return { strikes, balls };
  }

  // ==================== Validation ====================

  /**
   * Validate a guess
   * @param guess Guess number
   * @param config Game configuration
   * @returns Validation result
   */
  static validateGuess(guess: string, config: GameModeConfig): ValidationResult {
    const errors: string[] = [];

    // Empty check
    if (!guess || guess.trim() === '') {
      errors.push('숫자를 입력해주세요.');
      return { valid: false, errors };
    }

    // Length check
    if (guess.length !== config.digitCount) {
      errors.push(`${config.digitCount}자리 숫자를 입력해주세요.`);
    }

    // Numeric only check
    if (!/^\d+$/.test(guess)) {
      errors.push('숫자만 입력해주세요.');
    }

    // Duplicate check (when not allowed)
    if (!config.allowDuplicates && guess.length === config.digitCount) {
      const uniqueDigits = new Set(guess.split(''));
      if (uniqueDigits.size !== guess.length) {
        errors.push('중복된 숫자는 사용할 수 없습니다.');
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate a secret number
   */
  static validateSecretNumber(secret: string, config: GameModeConfig): ValidationResult {
    return this.validateGuess(secret, config);
  }

  // ==================== Possibility Analysis ====================

  /**
   * Calculate remaining possible number combinations
   * @param guessHistory Guess history
   * @param config Game configuration
   * @returns Array of possible numbers
   */
  static calculatePossibilities(guessHistory: GuessResult[], config: GameModeConfig): string[] {
    const { digitCount, allowDuplicates } = config;
    const allPossibilities = this.generateAllPossibilities(digitCount, allowDuplicates);

    return allPossibilities.filter((candidate) => {
      return guessHistory.every(({ guess, strikes, balls }) => {
        const result = this.calculateResult(candidate, guess);
        return result.strikes === strikes && result.balls === balls;
      });
    });
  }

  /**
   * Generate all possible number combinations
   */
  private static generateAllPossibilities(digitCount: number, allowDuplicates: boolean): string[] {
    const results: string[] = [];
    const digits = '0123456789';

    const generate = (current: string, usedDigits: Set<string>) => {
      if (current.length === digitCount) {
        results.push(current);
        return;
      }

      for (const digit of digits) {
        if (!allowDuplicates && usedDigits.has(digit)) continue;

        const newUsed = new Set(usedDigits);
        newUsed.add(digit);
        generate(current + digit, newUsed);
      }
    };

    generate('', new Set());
    return results;
  }

  // ==================== Hint System ====================

  /**
   * Generate AI hint
   * @param guessHistory Guess history
   * @param config Game configuration
   * @param hintLevel Hint level (1-3)
   * @returns Hint information
   */
  static generateHint(guessHistory: GuessResult[], config: GameModeConfig, hintLevel: number): Hint {
    const possibilities = this.calculatePossibilities(guessHistory, config);

    switch (hintLevel) {
      case 1:
        return {
          type: 'POSSIBILITY_COUNT',
          content: `남은 가능성: ${possibilities.length}개`,
          cost: 50,
        };

      case 2:
        if (possibilities.length > 0) {
          const randomPos = Math.floor(Math.random() * config.digitCount);
          const digitFrequency: Record<string, number> = {};

          possibilities.forEach((p) => {
            const digit = p[randomPos];
            digitFrequency[digit] = (digitFrequency[digit] || 0) + 1;
          });

          const mostLikely = Object.entries(digitFrequency).sort((a, b) => b[1] - a[1])[0];

          const probability = Math.round((mostLikely[1] / possibilities.length) * 100);

          return {
            type: 'POSITION_HINT',
            content: `${randomPos + 1}번째 자리에 ${mostLikely[0]}이(가) 있을 확률: ${probability}%`,
            cost: 100,
          };
        }
        break;

      case 3:
        if (possibilities.length > 0) {
          const sample = possibilities[0];
          const randomDigit = sample[Math.floor(Math.random() * sample.length)];
          return {
            type: 'CONTAINS_DIGIT',
            content: `정답에 ${randomDigit}이(가) 포함되어 있습니다.`,
            cost: 200,
          };
        }
        break;
    }

    return {
      type: 'POSSIBILITY_COUNT',
      content: '힌트를 생성할 수 없습니다.',
      cost: 0,
    };
  }

  // ==================== AI Recommendation ====================

  /**
   * Recommend optimal next guess (Information Entropy based)
   * @param guessHistory Guess history
   * @param config Game configuration
   * @returns Recommended guess number
   */
  static recommendNextGuess(guessHistory: GuessResult[], config: GameModeConfig): string | null {
    const possibilities = this.calculatePossibilities(guessHistory, config);

    if (possibilities.length === 0) return null;
    if (possibilities.length === 1) return possibilities[0];

    let bestGuess = possibilities[0];
    let bestScore = Infinity;

    // Check maximum 50 candidates (performance optimization)
    const candidates = possibilities.slice(0, Math.min(50, possibilities.length));

    for (const candidate of candidates) {
      const buckets: Record<string, number> = {};

      for (const possibility of possibilities) {
        const { strikes, balls } = this.calculateResult(possibility, candidate);
        const key = `${strikes}S${balls}B`;
        buckets[key] = (buckets[key] || 0) + 1;
      }

      // More even buckets are better (more information gained)
      const score = Object.values(buckets).reduce((sum, count) => sum + count * count, 0);

      if (score < bestScore) {
        bestScore = score;
        bestGuess = candidate;
      }
    }

    return bestGuess;
  }

  // ==================== Digit Probability Analysis ====================

  /**
   * Calculate probability of each digit being in the answer
   */
  static calculateDigitProbabilities(
    guessHistory: GuessResult[],
    config: GameModeConfig
  ): Record<string, number> {
    const possibilities = this.calculatePossibilities(guessHistory, config);
    const probs: Record<string, number> = {};

    for (let d = 0; d <= 9; d++) {
      const digit = String(d);
      const containingCount = possibilities.filter((p) => p.includes(digit)).length;
      probs[digit] = possibilities.length > 0 ? Math.round((containingCount / possibilities.length) * 100) : 0;
    }

    return probs;
  }

  /**
   * Calculate probability of each digit at each position
   */
  static calculatePositionProbabilities(
    guessHistory: GuessResult[],
    config: GameModeConfig
  ): Record<number, Record<string, number>> {
    const possibilities = this.calculatePossibilities(guessHistory, config);
    const probs: Record<number, Record<string, number>> = {};

    for (let pos = 0; pos < config.digitCount; pos++) {
      probs[pos] = {};
      for (let d = 0; d <= 9; d++) {
        const digit = String(d);
        const matchingCount = possibilities.filter((p) => p[pos] === digit).length;
        probs[pos][digit] = possibilities.length > 0 ? Math.round((matchingCount / possibilities.length) * 100) : 0;
      }
    }

    return probs;
  }
}

export default NumberBaseballEngine;
