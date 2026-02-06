var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// ../shared/dist/types/game.js
var require_game = __commonJS({
  "../shared/dist/types/game.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.GameItemType = exports2.GameStatus = exports2.GAME_MODE_CONFIGS = exports2.GameMode = void 0;
    var GameMode;
    (function(GameMode2) {
      GameMode2["CLASSIC_3"] = "CLASSIC_3";
      GameMode2["CLASSIC_4"] = "CLASSIC_4";
      GameMode2["CLASSIC_5"] = "CLASSIC_5";
      GameMode2["CLASSIC_6"] = "CLASSIC_6";
      GameMode2["DUPLICATE_3"] = "DUPLICATE_3";
      GameMode2["DUPLICATE_4"] = "DUPLICATE_4";
      GameMode2["SPEED_3"] = "SPEED_3";
      GameMode2["SPEED_4"] = "SPEED_4";
      GameMode2["BLITZ"] = "BLITZ";
      GameMode2["MARATHON"] = "MARATHON";
      GameMode2["REVERSE"] = "REVERSE";
      GameMode2["TEAM"] = "TEAM";
    })(GameMode || (exports2.GameMode = GameMode = {}));
    exports2.GAME_MODE_CONFIGS = {
      [GameMode.CLASSIC_3]: {
        mode: GameMode.CLASSIC_3,
        digitCount: 3,
        allowDuplicates: false,
        timeLimit: 30,
        maxAttempts: 10,
        basePoints: 100,
        eloMultiplier: 1,
        hintsAllowed: true,
        itemsAllowed: true,
        description: "\uD074\uB798\uC2DD 3\uC790\uB9AC \uC22B\uC790\uC57C\uAD6C",
        descriptionEn: "Classic 3-digit Number Baseball",
        unlockLevel: 1,
        iconEmoji: "\u26BE"
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
        description: "\uD074\uB798\uC2DD 4\uC790\uB9AC \uC22B\uC790\uC57C\uAD6C",
        descriptionEn: "Classic 4-digit Number Baseball",
        unlockLevel: 5,
        iconEmoji: "\u{1F3AF}"
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
        description: "\uD074\uB798\uC2DD 5\uC790\uB9AC \uC22B\uC790\uC57C\uAD6C",
        descriptionEn: "Classic 5-digit Number Baseball",
        unlockLevel: 10,
        iconEmoji: "\u{1F3C6}"
      },
      [GameMode.CLASSIC_6]: {
        mode: GameMode.CLASSIC_6,
        digitCount: 6,
        allowDuplicates: false,
        timeLimit: 90,
        maxAttempts: 20,
        basePoints: 300,
        eloMultiplier: 2,
        hintsAllowed: true,
        itemsAllowed: true,
        description: "\uD558\uB4DC\uCF54\uC5B4 6\uC790\uB9AC \uC22B\uC790\uC57C\uAD6C",
        descriptionEn: "Hardcore 6-digit Number Baseball",
        unlockLevel: 20,
        iconEmoji: "\u{1F480}"
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
        description: "\uC911\uBCF5 \uD5C8\uC6A9 3\uC790\uB9AC",
        descriptionEn: "3-digit with Duplicates",
        unlockLevel: 3,
        iconEmoji: "\u{1F522}"
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
        description: "\uC911\uBCF5 \uD5C8\uC6A9 4\uC790\uB9AC",
        descriptionEn: "4-digit with Duplicates",
        unlockLevel: 8,
        iconEmoji: "\u{1F501}"
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
        description: "\uC2A4\uD53C\uB4DC \uBAA8\uB4DC - 10\uCD08",
        descriptionEn: "Speed Mode - 10 seconds",
        unlockLevel: 7,
        iconEmoji: "\u26A1"
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
        description: "\uC2A4\uD53C\uB4DC \uBAA8\uB4DC - 15\uCD08",
        descriptionEn: "Speed Mode - 15 seconds",
        unlockLevel: 12,
        iconEmoji: "\u26A1"
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
        description: "\uBC88\uAC1C\uC804 - 5\uCD08",
        descriptionEn: "Blitz - 5 seconds",
        unlockLevel: 15,
        iconEmoji: "\u{1F525}"
      },
      [GameMode.MARATHON]: {
        mode: GameMode.MARATHON,
        digitCount: 4,
        allowDuplicates: false,
        timeLimit: 0,
        maxAttempts: 0,
        basePoints: 250,
        eloMultiplier: 1,
        hintsAllowed: true,
        itemsAllowed: false,
        description: "\uB9C8\uB77C\uD1A4 - \uCD5C\uC18C \uC2DC\uB3C4\uB85C \uC2B9\uB9AC",
        descriptionEn: "Marathon - Win with minimum attempts",
        unlockLevel: 10,
        iconEmoji: "\u{1F3C3}"
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
        description: "\uC5ED\uC804 \uBAA8\uB4DC - \uC0C1\uB300\uAC00 \uC22B\uC790 \uC124\uC815",
        descriptionEn: "Reverse - Opponent sets the number",
        unlockLevel: 18,
        iconEmoji: "\u{1F504}"
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
        description: "\uD300\uC804 2vs2",
        descriptionEn: "Team Battle 2vs2",
        unlockLevel: 15,
        iconEmoji: "\u{1F465}"
      }
    };
    var GameStatus;
    (function(GameStatus2) {
      GameStatus2["WAITING"] = "WAITING";
      GameStatus2["SETTING_NUMBERS"] = "SETTING_NUMBERS";
      GameStatus2["IN_PROGRESS"] = "IN_PROGRESS";
      GameStatus2["PAUSED"] = "PAUSED";
      GameStatus2["FINISHED"] = "FINISHED";
      GameStatus2["ABANDONED"] = "ABANDONED";
    })(GameStatus || (exports2.GameStatus = GameStatus = {}));
    var GameItemType;
    (function(GameItemType2) {
      GameItemType2["TIME_EXTEND"] = "TIME_EXTEND";
      GameItemType2["HINT_DIGIT"] = "HINT_DIGIT";
      GameItemType2["HINT_POSITION"] = "HINT_POSITION";
      GameItemType2["EXTRA_GUESS"] = "EXTRA_GUESS";
      GameItemType2["SHIELD"] = "SHIELD";
    })(GameItemType || (exports2.GameItemType = GameItemType = {}));
  }
});

// ../shared/dist/types/user.js
var require_user = __commonJS({
  "../shared/dist/types/user.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
  }
});

// ../shared/dist/types/room.js
var require_room = __commonJS({
  "../shared/dist/types/room.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.RoomStatus = void 0;
    var RoomStatus;
    (function(RoomStatus2) {
      RoomStatus2["WAITING"] = "WAITING";
      RoomStatus2["STARTING"] = "STARTING";
      RoomStatus2["IN_GAME"] = "IN_GAME";
      RoomStatus2["FINISHED"] = "FINISHED";
    })(RoomStatus || (exports2.RoomStatus = RoomStatus = {}));
  }
});

// ../shared/dist/types/socket.js
var require_socket = __commonJS({
  "../shared/dist/types/socket.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
  }
});

// ../shared/dist/types/index.js
var require_types = __commonJS({
  "../shared/dist/types/index.js"(exports2) {
    "use strict";
    var __createBinding = exports2 && exports2.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __exportStar = exports2 && exports2.__exportStar || function(m, exports3) {
      for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports3, p)) __createBinding(exports3, m, p);
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    __exportStar(require_game(), exports2);
    __exportStar(require_user(), exports2);
    __exportStar(require_room(), exports2);
    __exportStar(require_socket(), exports2);
  }
});

// ../shared/dist/utils/gameLogic.js
var require_gameLogic = __commonJS({
  "../shared/dist/utils/gameLogic.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.NumberBaseballEngine = void 0;
    var NumberBaseballEngine = class {
      // ==================== Number Generation ====================
      /**
       * Generate a random secret number
       * @param digitCount Number of digits
       * @param allowDuplicates Whether duplicates are allowed
       * @returns Generated secret number
       */
      static generateSecretNumber(digitCount, allowDuplicates) {
        const digits = "0123456789".split("");
        let result = "";
        if (allowDuplicates) {
          for (let i = 0; i < digitCount; i++) {
            result += digits[Math.floor(Math.random() * 10)];
          }
        } else {
          const shuffled = [...digits].sort(() => Math.random() - 0.5);
          result = shuffled.slice(0, digitCount).join("");
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
      static calculateResult(secret, guess) {
        let strikes = 0;
        let balls = 0;
        const secretArr = secret.split("");
        const guessArr = guess.split("");
        for (let i = 0; i < secretArr.length; i++) {
          if (secretArr[i] === guessArr[i]) {
            strikes++;
          }
        }
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
      static validateGuess(guess, config) {
        const errors = [];
        if (!guess || guess.trim() === "") {
          errors.push("\uC22B\uC790\uB97C \uC785\uB825\uD574\uC8FC\uC138\uC694.");
          return { valid: false, errors };
        }
        if (guess.length !== config.digitCount) {
          errors.push(`${config.digitCount}\uC790\uB9AC \uC22B\uC790\uB97C \uC785\uB825\uD574\uC8FC\uC138\uC694.`);
        }
        if (!/^\d+$/.test(guess)) {
          errors.push("\uC22B\uC790\uB9CC \uC785\uB825\uD574\uC8FC\uC138\uC694.");
        }
        if (!config.allowDuplicates && guess.length === config.digitCount) {
          const uniqueDigits = new Set(guess.split(""));
          if (uniqueDigits.size !== guess.length) {
            errors.push("\uC911\uBCF5\uB41C \uC22B\uC790\uB294 \uC0AC\uC6A9\uD560 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.");
          }
        }
        return {
          valid: errors.length === 0,
          errors
        };
      }
      /**
       * Validate a secret number
       */
      static validateSecretNumber(secret, config) {
        return this.validateGuess(secret, config);
      }
      // ==================== Possibility Analysis ====================
      /**
       * Calculate remaining possible number combinations
       * @param guessHistory Guess history
       * @param config Game configuration
       * @returns Array of possible numbers
       */
      static calculatePossibilities(guessHistory, config) {
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
      static generateAllPossibilities(digitCount, allowDuplicates) {
        const results = [];
        const digits = "0123456789";
        const generate = (current, usedDigits) => {
          if (current.length === digitCount) {
            results.push(current);
            return;
          }
          for (const digit of digits) {
            if (!allowDuplicates && usedDigits.has(digit))
              continue;
            const newUsed = new Set(usedDigits);
            newUsed.add(digit);
            generate(current + digit, newUsed);
          }
        };
        generate("", /* @__PURE__ */ new Set());
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
      static generateHint(guessHistory, config, hintLevel) {
        const possibilities = this.calculatePossibilities(guessHistory, config);
        switch (hintLevel) {
          case 1:
            return {
              type: "POSSIBILITY_COUNT",
              content: `\uB0A8\uC740 \uAC00\uB2A5\uC131: ${possibilities.length}\uAC1C`,
              cost: 50
            };
          case 2:
            if (possibilities.length > 0) {
              const randomPos = Math.floor(Math.random() * config.digitCount);
              const digitFrequency = {};
              possibilities.forEach((p) => {
                const digit = p[randomPos];
                digitFrequency[digit] = (digitFrequency[digit] || 0) + 1;
              });
              const mostLikely = Object.entries(digitFrequency).sort((a, b) => b[1] - a[1])[0];
              const probability = Math.round(mostLikely[1] / possibilities.length * 100);
              return {
                type: "POSITION_HINT",
                content: `${randomPos + 1}\uBC88\uC9F8 \uC790\uB9AC\uC5D0 ${mostLikely[0]}\uC774(\uAC00) \uC788\uC744 \uD655\uB960: ${probability}%`,
                cost: 100
              };
            }
            break;
          case 3:
            if (possibilities.length > 0) {
              const sample = possibilities[0];
              const randomDigit = sample[Math.floor(Math.random() * sample.length)];
              return {
                type: "CONTAINS_DIGIT",
                content: `\uC815\uB2F5\uC5D0 ${randomDigit}\uC774(\uAC00) \uD3EC\uD568\uB418\uC5B4 \uC788\uC2B5\uB2C8\uB2E4.`,
                cost: 200
              };
            }
            break;
        }
        return {
          type: "POSSIBILITY_COUNT",
          content: "\uD78C\uD2B8\uB97C \uC0DD\uC131\uD560 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.",
          cost: 0
        };
      }
      // ==================== AI Recommendation ====================
      /**
       * Recommend optimal next guess (Information Entropy based)
       * @param guessHistory Guess history
       * @param config Game configuration
       * @returns Recommended guess number
       */
      static recommendNextGuess(guessHistory, config) {
        const possibilities = this.calculatePossibilities(guessHistory, config);
        if (possibilities.length === 0)
          return null;
        if (possibilities.length === 1)
          return possibilities[0];
        let bestGuess = possibilities[0];
        let bestScore = Infinity;
        const candidates = possibilities.slice(0, Math.min(50, possibilities.length));
        for (const candidate of candidates) {
          const buckets = {};
          for (const possibility of possibilities) {
            const { strikes, balls } = this.calculateResult(possibility, candidate);
            const key = `${strikes}S${balls}B`;
            buckets[key] = (buckets[key] || 0) + 1;
          }
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
      static calculateDigitProbabilities(guessHistory, config) {
        const possibilities = this.calculatePossibilities(guessHistory, config);
        const probs = {};
        for (let d = 0; d <= 9; d++) {
          const digit = String(d);
          const containingCount = possibilities.filter((p) => p.includes(digit)).length;
          probs[digit] = possibilities.length > 0 ? Math.round(containingCount / possibilities.length * 100) : 0;
        }
        return probs;
      }
      /**
       * Calculate probability of each digit at each position
       */
      static calculatePositionProbabilities(guessHistory, config) {
        const possibilities = this.calculatePossibilities(guessHistory, config);
        const probs = {};
        for (let pos = 0; pos < config.digitCount; pos++) {
          probs[pos] = {};
          for (let d = 0; d <= 9; d++) {
            const digit = String(d);
            const matchingCount = possibilities.filter((p) => p[pos] === digit).length;
            probs[pos][digit] = possibilities.length > 0 ? Math.round(matchingCount / possibilities.length * 100) : 0;
          }
        }
        return probs;
      }
    };
    exports2.NumberBaseballEngine = NumberBaseballEngine;
    exports2.default = NumberBaseballEngine;
  }
});

// ../shared/dist/utils/eloCalculator.js
var require_eloCalculator = __commonJS({
  "../shared/dist/utils/eloCalculator.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.TIER_CONFIG = exports2.Tier = exports2.EloCalculator = exports2.DEFAULT_ELO_CONFIG = void 0;
    exports2.getTierByRating = getTierByRating4;
    exports2.getNextTier = getNextTier;
    exports2.getRatingProgress = getRatingProgress;
    exports2.DEFAULT_ELO_CONFIG = {
      kFactor: 32,
      minRating: 100,
      maxRating: 3e3,
      provisionalGames: 10,
      provisionalKFactor: 64
    };
    var EloCalculator = class {
      constructor(config = {}) {
        this.config = { ...exports2.DEFAULT_ELO_CONFIG, ...config };
      }
      /**
       * Calculate expected score
       */
      calculateExpectedScore(playerRating, opponentRating) {
        return 1 / (1 + Math.pow(10, (opponentRating - playerRating) / 400));
      }
      /**
       * Determine K-factor
       */
      getKFactor(player, modeMultiplier = 1) {
        const baseK = player.gamesPlayed < this.config.provisionalGames ? this.config.provisionalKFactor : this.config.kFactor;
        let k = baseK;
        if (player.rating > 2400)
          k = baseK * 0.5;
        else if (player.rating > 2e3)
          k = baseK * 0.75;
        return k * modeMultiplier;
      }
      /**
       * Calculate new rating
       */
      calculateNewRating(player, opponent, score, modeMultiplier = 1) {
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
      processGameResult(player1, player2, winnerId, modeMultiplier = 1) {
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
            ratingChange: p1Result.change
          },
          player2Result: {
            oderId: player2.oderId,
            newRating: p2Result.newRating,
            ratingChange: p2Result.change
          }
        };
      }
    };
    exports2.EloCalculator = EloCalculator;
    var Tier;
    (function(Tier2) {
      Tier2["BRONZE_5"] = "BRONZE_5";
      Tier2["BRONZE_4"] = "BRONZE_4";
      Tier2["BRONZE_3"] = "BRONZE_3";
      Tier2["BRONZE_2"] = "BRONZE_2";
      Tier2["BRONZE_1"] = "BRONZE_1";
      Tier2["SILVER_5"] = "SILVER_5";
      Tier2["SILVER_4"] = "SILVER_4";
      Tier2["SILVER_3"] = "SILVER_3";
      Tier2["SILVER_2"] = "SILVER_2";
      Tier2["SILVER_1"] = "SILVER_1";
      Tier2["GOLD_5"] = "GOLD_5";
      Tier2["GOLD_4"] = "GOLD_4";
      Tier2["GOLD_3"] = "GOLD_3";
      Tier2["GOLD_2"] = "GOLD_2";
      Tier2["GOLD_1"] = "GOLD_1";
      Tier2["PLATINUM_5"] = "PLATINUM_5";
      Tier2["PLATINUM_4"] = "PLATINUM_4";
      Tier2["PLATINUM_3"] = "PLATINUM_3";
      Tier2["PLATINUM_2"] = "PLATINUM_2";
      Tier2["PLATINUM_1"] = "PLATINUM_1";
      Tier2["DIAMOND_5"] = "DIAMOND_5";
      Tier2["DIAMOND_4"] = "DIAMOND_4";
      Tier2["DIAMOND_3"] = "DIAMOND_3";
      Tier2["DIAMOND_2"] = "DIAMOND_2";
      Tier2["DIAMOND_1"] = "DIAMOND_1";
      Tier2["MASTER"] = "MASTER";
      Tier2["GRANDMASTER"] = "GRANDMASTER";
      Tier2["LEGEND"] = "LEGEND";
    })(Tier || (exports2.Tier = Tier = {}));
    exports2.TIER_CONFIG = [
      { tier: Tier.BRONZE_5, name: "\uBE0C\uB860\uC988 5", nameEn: "Bronze 5", minRating: 0, maxRating: 199, icon: "\u{1F949}", color: "#CD7F32", bgGradient: "from-amber-700 to-amber-900", seasonRewardCoins: 100 },
      { tier: Tier.BRONZE_4, name: "\uBE0C\uB860\uC988 4", nameEn: "Bronze 4", minRating: 200, maxRating: 299, icon: "\u{1F949}", color: "#CD7F32", bgGradient: "from-amber-700 to-amber-900", seasonRewardCoins: 150 },
      { tier: Tier.BRONZE_3, name: "\uBE0C\uB860\uC988 3", nameEn: "Bronze 3", minRating: 300, maxRating: 399, icon: "\u{1F949}", color: "#CD7F32", bgGradient: "from-amber-700 to-amber-900", seasonRewardCoins: 200 },
      { tier: Tier.BRONZE_2, name: "\uBE0C\uB860\uC988 2", nameEn: "Bronze 2", minRating: 400, maxRating: 499, icon: "\u{1F949}", color: "#CD7F32", bgGradient: "from-amber-700 to-amber-900", seasonRewardCoins: 250 },
      { tier: Tier.BRONZE_1, name: "\uBE0C\uB860\uC988 1", nameEn: "Bronze 1", minRating: 500, maxRating: 599, icon: "\u{1F949}", color: "#CD7F32", bgGradient: "from-amber-700 to-amber-900", seasonRewardCoins: 300 },
      { tier: Tier.SILVER_5, name: "\uC2E4\uBC84 5", nameEn: "Silver 5", minRating: 600, maxRating: 699, icon: "\u{1F948}", color: "#C0C0C0", bgGradient: "from-gray-400 to-gray-600", seasonRewardCoins: 400 },
      { tier: Tier.SILVER_4, name: "\uC2E4\uBC84 4", nameEn: "Silver 4", minRating: 700, maxRating: 799, icon: "\u{1F948}", color: "#C0C0C0", bgGradient: "from-gray-400 to-gray-600", seasonRewardCoins: 450 },
      { tier: Tier.SILVER_3, name: "\uC2E4\uBC84 3", nameEn: "Silver 3", minRating: 800, maxRating: 899, icon: "\u{1F948}", color: "#C0C0C0", bgGradient: "from-gray-400 to-gray-600", seasonRewardCoins: 500 },
      { tier: Tier.SILVER_2, name: "\uC2E4\uBC84 2", nameEn: "Silver 2", minRating: 900, maxRating: 999, icon: "\u{1F948}", color: "#C0C0C0", bgGradient: "from-gray-400 to-gray-600", seasonRewardCoins: 550 },
      { tier: Tier.SILVER_1, name: "\uC2E4\uBC84 1", nameEn: "Silver 1", minRating: 1e3, maxRating: 1099, icon: "\u{1F948}", color: "#C0C0C0", bgGradient: "from-gray-400 to-gray-600", seasonRewardCoins: 600 },
      { tier: Tier.GOLD_5, name: "\uACE8\uB4DC 5", nameEn: "Gold 5", minRating: 1100, maxRating: 1199, icon: "\u{1F947}", color: "#FFD700", bgGradient: "from-yellow-400 to-yellow-600", seasonRewardCoins: 700 },
      { tier: Tier.GOLD_4, name: "\uACE8\uB4DC 4", nameEn: "Gold 4", minRating: 1200, maxRating: 1299, icon: "\u{1F947}", color: "#FFD700", bgGradient: "from-yellow-400 to-yellow-600", seasonRewardCoins: 750 },
      { tier: Tier.GOLD_3, name: "\uACE8\uB4DC 3", nameEn: "Gold 3", minRating: 1300, maxRating: 1399, icon: "\u{1F947}", color: "#FFD700", bgGradient: "from-yellow-400 to-yellow-600", seasonRewardCoins: 800 },
      { tier: Tier.GOLD_2, name: "\uACE8\uB4DC 2", nameEn: "Gold 2", minRating: 1400, maxRating: 1499, icon: "\u{1F947}", color: "#FFD700", bgGradient: "from-yellow-400 to-yellow-600", seasonRewardCoins: 850 },
      { tier: Tier.GOLD_1, name: "\uACE8\uB4DC 1", nameEn: "Gold 1", minRating: 1500, maxRating: 1599, icon: "\u{1F947}", color: "#FFD700", bgGradient: "from-yellow-400 to-yellow-600", seasonRewardCoins: 900 },
      { tier: Tier.PLATINUM_5, name: "\uD50C\uB798\uD2F0\uB118 5", nameEn: "Platinum 5", minRating: 1600, maxRating: 1699, icon: "\u{1F48E}", color: "#E5E4E2", bgGradient: "from-cyan-300 to-cyan-500", seasonRewardCoins: 1e3 },
      { tier: Tier.PLATINUM_4, name: "\uD50C\uB798\uD2F0\uB118 4", nameEn: "Platinum 4", minRating: 1700, maxRating: 1799, icon: "\u{1F48E}", color: "#E5E4E2", bgGradient: "from-cyan-300 to-cyan-500", seasonRewardCoins: 1100 },
      { tier: Tier.PLATINUM_3, name: "\uD50C\uB798\uD2F0\uB118 3", nameEn: "Platinum 3", minRating: 1800, maxRating: 1899, icon: "\u{1F48E}", color: "#E5E4E2", bgGradient: "from-cyan-300 to-cyan-500", seasonRewardCoins: 1200 },
      { tier: Tier.PLATINUM_2, name: "\uD50C\uB798\uD2F0\uB118 2", nameEn: "Platinum 2", minRating: 1900, maxRating: 1999, icon: "\u{1F48E}", color: "#E5E4E2", bgGradient: "from-cyan-300 to-cyan-500", seasonRewardCoins: 1300 },
      { tier: Tier.PLATINUM_1, name: "\uD50C\uB798\uD2F0\uB118 1", nameEn: "Platinum 1", minRating: 2e3, maxRating: 2099, icon: "\u{1F48E}", color: "#E5E4E2", bgGradient: "from-cyan-300 to-cyan-500", seasonRewardCoins: 1400 },
      { tier: Tier.DIAMOND_5, name: "\uB2E4\uC774\uC544\uBAAC\uB4DC 5", nameEn: "Diamond 5", minRating: 2100, maxRating: 2199, icon: "\u{1F4A0}", color: "#B9F2FF", bgGradient: "from-blue-300 to-blue-500", seasonRewardCoins: 1600 },
      { tier: Tier.DIAMOND_4, name: "\uB2E4\uC774\uC544\uBAAC\uB4DC 4", nameEn: "Diamond 4", minRating: 2200, maxRating: 2299, icon: "\u{1F4A0}", color: "#B9F2FF", bgGradient: "from-blue-300 to-blue-500", seasonRewardCoins: 1700 },
      { tier: Tier.DIAMOND_3, name: "\uB2E4\uC774\uC544\uBAAC\uB4DC 3", nameEn: "Diamond 3", minRating: 2300, maxRating: 2399, icon: "\u{1F4A0}", color: "#B9F2FF", bgGradient: "from-blue-300 to-blue-500", seasonRewardCoins: 1800 },
      { tier: Tier.DIAMOND_2, name: "\uB2E4\uC774\uC544\uBAAC\uB4DC 2", nameEn: "Diamond 2", minRating: 2400, maxRating: 2499, icon: "\u{1F4A0}", color: "#B9F2FF", bgGradient: "from-blue-300 to-blue-500", seasonRewardCoins: 1900 },
      { tier: Tier.DIAMOND_1, name: "\uB2E4\uC774\uC544\uBAAC\uB4DC 1", nameEn: "Diamond 1", minRating: 2500, maxRating: 2599, icon: "\u{1F4A0}", color: "#B9F2FF", bgGradient: "from-blue-300 to-blue-500", seasonRewardCoins: 2e3 },
      { tier: Tier.MASTER, name: "\uB9C8\uC2A4\uD130", nameEn: "Master", minRating: 2600, maxRating: 2799, icon: "\u{1F451}", color: "#9B59B6", bgGradient: "from-purple-500 to-purple-700", seasonRewardCoins: 2500 },
      { tier: Tier.GRANDMASTER, name: "\uADF8\uB79C\uB4DC\uB9C8\uC2A4\uD130", nameEn: "Grandmaster", minRating: 2800, maxRating: 2999, icon: "\u{1F3C6}", color: "#E74C3C", bgGradient: "from-red-500 to-red-700", seasonRewardCoins: 3e3 },
      { tier: Tier.LEGEND, name: "\uB808\uC804\uB4DC", nameEn: "Legend", minRating: 3e3, maxRating: 9999, icon: "\u{1F31F}", color: "#F39C12", bgGradient: "from-orange-400 to-red-500", seasonRewardCoins: 5e3 }
    ];
    function getTierByRating4(rating) {
      for (let i = exports2.TIER_CONFIG.length - 1; i >= 0; i--) {
        if (rating >= exports2.TIER_CONFIG[i].minRating) {
          return exports2.TIER_CONFIG[i];
        }
      }
      return exports2.TIER_CONFIG[0];
    }
    function getNextTier(currentTier) {
      const currentIndex = exports2.TIER_CONFIG.findIndex((t) => t.tier === currentTier);
      if (currentIndex < exports2.TIER_CONFIG.length - 1) {
        return exports2.TIER_CONFIG[currentIndex + 1];
      }
      return null;
    }
    function getRatingProgress(rating) {
      const tier = getTierByRating4(rating);
      const nextTier = getNextTier(tier.tier);
      if (!nextTier) {
        return { current: rating, max: rating, percentage: 100, pointsToNext: 0 };
      }
      const current = rating - tier.minRating;
      const max = nextTier.minRating - tier.minRating;
      const percentage = Math.round(current / max * 100);
      const pointsToNext = nextTier.minRating - rating;
      return { current, max, percentage, pointsToNext };
    }
    exports2.default = EloCalculator;
  }
});

// ../shared/dist/utils/index.js
var require_utils = __commonJS({
  "../shared/dist/utils/index.js"(exports2) {
    "use strict";
    var __createBinding = exports2 && exports2.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __exportStar = exports2 && exports2.__exportStar || function(m, exports3) {
      for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports3, p)) __createBinding(exports3, m, p);
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    __exportStar(require_gameLogic(), exports2);
    __exportStar(require_eloCalculator(), exports2);
  }
});

// ../shared/dist/index.js
var require_dist = __commonJS({
  "../shared/dist/index.js"(exports2) {
    "use strict";
    var __createBinding = exports2 && exports2.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __exportStar = exports2 && exports2.__exportStar || function(m, exports3) {
      for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports3, p)) __createBinding(exports3, m, p);
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    __exportStar(require_types(), exports2);
    __exportStar(require_utils(), exports2);
  }
});

// src/app.ts
var app_exports = {};
__export(app_exports, {
  default: () => app_default
});
module.exports = __toCommonJS(app_exports);
var import_express6 = __toESM(require("express"));
var import_cors = __toESM(require("cors"));
var import_helmet = __toESM(require("helmet"));
var import_compression = __toESM(require("compression"));
var import_morgan = __toESM(require("morgan"));
var import_express_rate_limit = __toESM(require("express-rate-limit"));

// src/routes/index.ts
var import_express5 = require("express");

// src/routes/authRoutes.ts
var import_express = require("express");
var import_express_validator2 = require("express-validator");

// src/controllers/authController.ts
var import_bcryptjs = __toESM(require("bcryptjs"));
var import_jsonwebtoken = __toESM(require("jsonwebtoken"));
var import_express_validator = require("express-validator");

// src/config/database.ts
var import_client = require("@prisma/client");
var globalForPrisma = global;
var prisma = globalForPrisma.prisma || new import_client.PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"]
});
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// src/utils/logger.ts
var import_winston = __toESM(require("winston"));
var logFormat = import_winston.default.format.combine(
  import_winston.default.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  import_winston.default.format.errors({ stack: true }),
  import_winston.default.format.printf(({ level, message, timestamp, stack }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${stack || message}`;
  })
);
var transports = [
  new import_winston.default.transports.Console({
    format: import_winston.default.format.combine(import_winston.default.format.colorize(), logFormat)
  })
];
if (process.env.NODE_ENV !== "production" || process.env.LOG_TO_FILE === "true") {
  try {
    transports.push(
      new import_winston.default.transports.File({ filename: "logs/error.log", level: "error" }),
      new import_winston.default.transports.File({ filename: "logs/combined.log" })
    );
  } catch {
  }
}
var logger = import_winston.default.createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format: logFormat,
  transports
});

// src/middleware/errorHandler.ts
var AppError = class extends Error {
  statusCode;
  isOperational;
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
};
var errorHandler = (err, req, res, _next) => {
  if (err instanceof AppError) {
    logger.warn(`AppError: ${err.message}`);
    return res.status(err.statusCode).json({
      success: false,
      message: err.message
    });
  }
  logger.error("Unexpected error:", err);
  return res.status(500).json({
    success: false,
    message: "\uC11C\uBC84 \uB0B4\uBD80 \uC624\uB958\uAC00 \uBC1C\uC0DD\uD588\uC2B5\uB2C8\uB2E4.",
    error: err.message
  });
};
var notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: "\uC694\uCCAD\uD55C \uB9AC\uC18C\uC2A4\uB97C \uCC3E\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4."
  });
};

// src/controllers/authController.ts
var import_shared = __toESM(require_dist());
var generateToken = (userId) => {
  return import_jsonwebtoken.default.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d"
  });
};
var register = async (req, res, next) => {
  try {
    const errors = (0, import_express_validator.validationResult)(req);
    if (!errors.isEmpty()) {
      throw new AppError(errors.array()[0].msg, 400);
    }
    const { email, username, password } = req.body;
    const existingEmail = await prisma.user.findUnique({ where: { email } });
    if (existingEmail) {
      throw new AppError("\uC774\uBBF8 \uC0AC\uC6A9 \uC911\uC778 \uC774\uBA54\uC77C\uC785\uB2C8\uB2E4.", 400);
    }
    const existingUsername = await prisma.user.findUnique({ where: { username } });
    if (existingUsername) {
      throw new AppError("\uC774\uBBF8 \uC0AC\uC6A9 \uC911\uC778 \uB2C9\uB124\uC784\uC785\uB2C8\uB2E4.", 400);
    }
    const passwordHash = await import_bcryptjs.default.hash(password, 12);
    const user = await prisma.user.create({
      data: {
        email,
        username,
        passwordHash,
        rating: 1e3,
        tier: "SILVER_1",
        coins: 500
      },
      select: {
        id: true,
        email: true,
        username: true,
        rating: true,
        tier: true,
        level: true,
        coins: true,
        gems: true
      }
    });
    const token = generateToken(user.id);
    res.status(201).json({
      success: true,
      data: { user, token }
    });
  } catch (error) {
    next(error);
  }
};
var login = async (req, res, next) => {
  try {
    const errors = (0, import_express_validator.validationResult)(req);
    if (!errors.isEmpty()) {
      throw new AppError(errors.array()[0].msg, 400);
    }
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        username: true,
        passwordHash: true,
        rating: true,
        tier: true,
        level: true,
        coins: true,
        gems: true,
        isBanned: true,
        avatarUrl: true,
        gamesPlayed: true,
        gamesWon: true
      }
    });
    if (!user || !user.passwordHash) {
      throw new AppError("\uC774\uBA54\uC77C \uB610\uB294 \uBE44\uBC00\uBC88\uD638\uAC00 \uC77C\uCE58\uD558\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4.", 401);
    }
    if (user.isBanned) {
      throw new AppError("\uACC4\uC815\uC774 \uC815\uC9C0\uB418\uC5C8\uC2B5\uB2C8\uB2E4.", 403);
    }
    const isPasswordValid = await import_bcryptjs.default.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new AppError("\uC774\uBA54\uC77C \uB610\uB294 \uBE44\uBC00\uBC88\uD638\uAC00 \uC77C\uCE58\uD558\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4.", 401);
    }
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: /* @__PURE__ */ new Date() }
    });
    const token = generateToken(user.id);
    const { passwordHash: _, ...userData } = user;
    res.json({
      success: true,
      data: { user: userData, token }
    });
  } catch (error) {
    next(error);
  }
};
var logout = async (_req, res, next) => {
  try {
    res.json({
      success: true,
      message: "\uB85C\uADF8\uC544\uC6C3\uB418\uC5C8\uC2B5\uB2C8\uB2E4."
    });
  } catch (error) {
    next(error);
  }
};
var getCurrentUser = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        email: true,
        username: true,
        avatarUrl: true,
        rating: true,
        seasonRating: true,
        tier: true,
        level: true,
        experience: true,
        coins: true,
        gems: true,
        gamesPlayed: true,
        gamesWon: true,
        gamesLost: true,
        winStreak: true,
        maxWinStreak: true
      }
    });
    if (!user) {
      throw new AppError("\uC0AC\uC6A9\uC790\uB97C \uCC3E\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.", 404);
    }
    const tierInfo = (0, import_shared.getTierByRating)(user.rating);
    res.json({
      success: true,
      data: {
        ...user,
        tierInfo,
        winRate: user.gamesPlayed > 0 ? Math.round(user.gamesWon / user.gamesPlayed * 100) : 0
      }
    });
  } catch (error) {
    next(error);
  }
};
var refreshToken = async (req, res, next) => {
  try {
    const { token } = req.body;
    if (!token) {
      throw new AppError("\uD1A0\uD070\uC774 \uD544\uC694\uD569\uB2C8\uB2E4.", 400);
    }
    const decoded = import_jsonwebtoken.default.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, isBanned: true }
    });
    if (!user || user.isBanned) {
      throw new AppError("\uC720\uD6A8\uD558\uC9C0 \uC54A\uC740 \uD1A0\uD070\uC785\uB2C8\uB2E4.", 401);
    }
    const newToken = generateToken(user.id);
    res.json({
      success: true,
      data: { token: newToken }
    });
  } catch (error) {
    next(error);
  }
};
var googleAuth = async (req, res, next) => {
  try {
    const { idToken } = req.body;
    if (!idToken) {
      throw new AppError("Google ID token\uC774 \uD544\uC694\uD569\uB2C8\uB2E4.", 400);
    }
    res.status(501).json({
      success: false,
      message: "Google OAuth not implemented yet"
    });
  } catch (error) {
    next(error);
  }
};
var kakaoAuth = async (req, res, next) => {
  try {
    const { accessToken } = req.body;
    if (!accessToken) {
      throw new AppError("Kakao access token\uC774 \uD544\uC694\uD569\uB2C8\uB2E4.", 400);
    }
    res.status(501).json({
      success: false,
      message: "Kakao OAuth not implemented yet"
    });
  } catch (error) {
    next(error);
  }
};

// src/middleware/auth.ts
var import_jsonwebtoken2 = __toESM(require("jsonwebtoken"));
var authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError("\uC778\uC99D \uD1A0\uD070\uC774 \uD544\uC694\uD569\uB2C8\uB2E4.", 401);
    }
    const token = authHeader.substring(7);
    const decoded = import_jsonwebtoken2.default.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, username: true, isBanned: true }
    });
    if (!user) {
      throw new AppError("\uC0AC\uC6A9\uC790\uB97C \uCC3E\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.", 401);
    }
    if (user.isBanned) {
      throw new AppError("\uACC4\uC815\uC774 \uC815\uC9C0\uB418\uC5C8\uC2B5\uB2C8\uB2E4.", 403);
    }
    req.userId = user.id;
    req.user = user;
    next();
  } catch (error) {
    if (error instanceof import_jsonwebtoken2.default.JsonWebTokenError) {
      return next(new AppError("\uC720\uD6A8\uD558\uC9C0 \uC54A\uC740 \uD1A0\uD070\uC785\uB2C8\uB2E4.", 401));
    }
    next(error);
  }
};
var optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next();
    }
    const token = authHeader.substring(7);
    const decoded = import_jsonwebtoken2.default.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, username: true }
    });
    if (user) {
      req.userId = user.id;
      req.user = user;
    }
    next();
  } catch {
    next();
  }
};

// src/routes/authRoutes.ts
var router = (0, import_express.Router)();
var registerValidation = [
  (0, import_express_validator2.body)("email").isEmail().withMessage("\uC720\uD6A8\uD55C \uC774\uBA54\uC77C\uC744 \uC785\uB825\uD574\uC8FC\uC138\uC694."),
  (0, import_express_validator2.body)("username").isLength({ min: 2, max: 20 }).withMessage("\uB2C9\uB124\uC784\uC740 2-20\uC790 \uC0AC\uC774\uC5EC\uC57C \uD569\uB2C8\uB2E4.").matches(/^[a-zA-Z0-9가-힣_]+$/).withMessage("\uB2C9\uB124\uC784\uC740 \uC601\uBB38, \uC22B\uC790, \uD55C\uAE00, \uBC11\uC904\uB9CC \uC0AC\uC6A9\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4."),
  (0, import_express_validator2.body)("password").isLength({ min: 6 }).withMessage("\uBE44\uBC00\uBC88\uD638\uB294 6\uC790 \uC774\uC0C1\uC774\uC5B4\uC57C \uD569\uB2C8\uB2E4.")
];
var loginValidation = [
  (0, import_express_validator2.body)("email").isEmail().withMessage("\uC720\uD6A8\uD55C \uC774\uBA54\uC77C\uC744 \uC785\uB825\uD574\uC8FC\uC138\uC694."),
  (0, import_express_validator2.body)("password").notEmpty().withMessage("\uBE44\uBC00\uBC88\uD638\uB97C \uC785\uB825\uD574\uC8FC\uC138\uC694.")
];
router.post("/register", registerValidation, register);
router.post("/login", loginValidation, login);
router.post("/logout", authenticate, logout);
router.get("/me", authenticate, getCurrentUser);
router.post("/refresh", refreshToken);
router.post("/google", googleAuth);
router.post("/kakao", kakaoAuth);
var authRoutes_default = router;

// src/routes/userRoutes.ts
var import_express2 = require("express");

// src/controllers/userController.ts
var import_shared2 = __toESM(require_dist());
var getMyProfile = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        email: true,
        username: true,
        avatarUrl: true,
        avatarFrameId: true,
        titleId: true,
        bio: true,
        country: true,
        rating: true,
        seasonRating: true,
        tier: true,
        peakRating: true,
        peakTier: true,
        level: true,
        experience: true,
        gamesPlayed: true,
        gamesWon: true,
        gamesLost: true,
        gamesDraw: true,
        winStreak: true,
        maxWinStreak: true,
        totalPlayTime: true,
        coins: true,
        gems: true,
        createdAt: true
      }
    });
    if (!user) {
      throw new AppError("\uC0AC\uC6A9\uC790\uB97C \uCC3E\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.", 404);
    }
    const tierInfo = (0, import_shared2.getTierByRating)(user.rating);
    res.json({
      success: true,
      data: {
        ...user,
        tierInfo,
        winRate: user.gamesPlayed > 0 ? Math.round(user.gamesWon / user.gamesPlayed * 100) : 0
      }
    });
  } catch (error) {
    next(error);
  }
};
var getUserProfile = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        avatarUrl: true,
        avatarFrameId: true,
        titleId: true,
        bio: true,
        country: true,
        rating: true,
        tier: true,
        level: true,
        gamesPlayed: true,
        gamesWon: true,
        gamesLost: true,
        gamesDraw: true,
        maxWinStreak: true,
        totalPlayTime: true,
        isOnline: true,
        lastOnlineAt: true,
        createdAt: true
      }
    });
    if (!user) {
      throw new AppError("\uC0AC\uC6A9\uC790\uB97C \uCC3E\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.", 404);
    }
    const tierInfo = (0, import_shared2.getTierByRating)(user.rating);
    res.json({
      success: true,
      data: {
        ...user,
        tierInfo,
        winRate: user.gamesPlayed > 0 ? Math.round(user.gamesWon / user.gamesPlayed * 100) : 0
      }
    });
  } catch (error) {
    next(error);
  }
};
var updateProfile = async (req, res, next) => {
  try {
    const { username, bio, avatarUrl, avatarFrameId, titleId } = req.body;
    if (username) {
      const existing = await prisma.user.findFirst({
        where: { username, id: { not: req.userId } }
      });
      if (existing) {
        throw new AppError("\uC774\uBBF8 \uC0AC\uC6A9 \uC911\uC778 \uB2C9\uB124\uC784\uC785\uB2C8\uB2E4.", 400);
      }
    }
    const user = await prisma.user.update({
      where: { id: req.userId },
      data: {
        ...username && { username },
        ...bio !== void 0 && { bio },
        ...avatarUrl && { avatarUrl },
        ...avatarFrameId && { avatarFrameId },
        ...titleId && { titleId }
      },
      select: {
        id: true,
        username: true,
        avatarUrl: true,
        avatarFrameId: true,
        titleId: true,
        bio: true
      }
    });
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};
var getUserStats = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        gamesPlayed: true,
        gamesWon: true,
        gamesLost: true,
        gamesDraw: true,
        winStreak: true,
        maxWinStreak: true,
        totalPlayTime: true,
        totalGuesses: true,
        perfectGames: true
      }
    });
    if (!user) {
      throw new AppError("\uC0AC\uC6A9\uC790\uB97C \uCC3E\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.", 404);
    }
    const modeStats = await prisma.game.groupBy({
      by: ["mode"],
      where: {
        OR: [{ player1Id: userId }, { player2Id: userId }],
        status: "FINISHED"
      },
      _count: true
    });
    const favoriteMode = modeStats.length > 0 ? modeStats.reduce((a, b) => a._count > b._count ? a : b).mode : "CLASSIC_4";
    res.json({
      success: true,
      data: {
        ...user,
        winRate: user.gamesPlayed > 0 ? Math.round(user.gamesWon / user.gamesPlayed * 100) : 0,
        averageAttempts: user.gamesPlayed > 0 ? Math.round(user.totalGuesses / user.gamesPlayed) : 0,
        favoriteMode,
        modeStats
      }
    });
  } catch (error) {
    next(error);
  }
};
var getUserGames = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const [games, total] = await Promise.all([
      prisma.game.findMany({
        where: {
          OR: [{ player1Id: userId }, { player2Id: userId }],
          status: "FINISHED"
        },
        select: {
          id: true,
          mode: true,
          winnerId: true,
          isDraw: true,
          player1Id: true,
          player2Id: true,
          player1RatingChange: true,
          player2RatingChange: true,
          endedAt: true,
          player1: { select: { id: true, username: true, avatarUrl: true } },
          player2: { select: { id: true, username: true, avatarUrl: true } },
          _count: { select: { moves: true } }
        },
        orderBy: { endedAt: "desc" },
        skip,
        take: Number(limit)
      }),
      prisma.game.count({
        where: {
          OR: [{ player1Id: userId }, { player2Id: userId }],
          status: "FINISHED"
        }
      })
    ]);
    const formattedGames = games.map((game) => {
      const isPlayer1 = game.player1Id === userId;
      const opponent = isPlayer1 ? game.player2 : game.player1;
      const ratingChange = isPlayer1 ? game.player1RatingChange : game.player2RatingChange;
      let result = "DRAW";
      if (!game.isDraw) {
        result = game.winnerId === userId ? "WIN" : "LOSE";
      }
      return {
        id: game.id,
        mode: game.mode,
        opponentName: opponent?.username || "Unknown",
        opponentAvatarUrl: opponent?.avatarUrl,
        result,
        attempts: game._count.moves,
        ratingChange: ratingChange || 0,
        playedAt: game.endedAt
      };
    });
    res.json({
      success: true,
      data: {
        games: formattedGames,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// src/routes/userRoutes.ts
var router2 = (0, import_express2.Router)();
router2.get("/profile", authenticate, getMyProfile);
router2.get("/:userId", getUserProfile);
router2.put("/profile", authenticate, updateProfile);
router2.get("/:userId/stats", getUserStats);
router2.get("/:userId/games", getUserGames);
var userRoutes_default = router2;

// src/routes/gameRoutes.ts
var import_express3 = require("express");

// src/controllers/gameController.ts
var getMyGames = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, mode } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const where = {
      OR: [{ player1Id: req.userId }, { player2Id: req.userId }],
      status: "FINISHED",
      ...mode && { mode: String(mode) }
    };
    const [games, total] = await Promise.all([
      prisma.game.findMany({
        where,
        select: {
          id: true,
          mode: true,
          winnerId: true,
          isDraw: true,
          player1Id: true,
          player2Id: true,
          player1RatingChange: true,
          player2RatingChange: true,
          totalDuration: true,
          endedAt: true,
          player1: { select: { id: true, username: true, avatarUrl: true } },
          player2: { select: { id: true, username: true, avatarUrl: true } },
          _count: { select: { moves: true } }
        },
        orderBy: { endedAt: "desc" },
        skip,
        take: Number(limit)
      }),
      prisma.game.count({ where })
    ]);
    const formattedGames = games.map((game) => {
      const isPlayer1 = game.player1Id === req.userId;
      const opponent = isPlayer1 ? game.player2 : game.player1;
      const ratingChange = isPlayer1 ? game.player1RatingChange : game.player2RatingChange;
      let result = "DRAW";
      if (!game.isDraw) {
        result = game.winnerId === req.userId ? "WIN" : "LOSE";
      }
      return {
        id: game.id,
        mode: game.mode,
        opponentName: opponent?.username || "Unknown",
        opponentAvatarUrl: opponent?.avatarUrl,
        result,
        attempts: game._count.moves,
        ratingChange: ratingChange || 0,
        duration: game.totalDuration,
        playedAt: game.endedAt
      };
    });
    res.json({
      success: true,
      data: {
        games: formattedGames,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      }
    });
  } catch (error) {
    next(error);
  }
};
var getGameDetails = async (req, res, next) => {
  try {
    const { gameId } = req.params;
    const game = await prisma.game.findUnique({
      where: { id: gameId },
      include: {
        player1: {
          select: { id: true, username: true, avatarUrl: true, rating: true, tier: true }
        },
        player2: {
          select: { id: true, username: true, avatarUrl: true, rating: true, tier: true }
        },
        moves: {
          orderBy: { turnNumber: "asc" },
          select: {
            id: true,
            playerId: true,
            turnNumber: true,
            guess: true,
            strikes: true,
            balls: true,
            timeSpent: true,
            createdAt: true
          }
        }
      }
    });
    if (!game) {
      throw new AppError("\uAC8C\uC784\uC744 \uCC3E\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.", 404);
    }
    const isPlayer = game.player1Id === req.userId || game.player2Id === req.userId;
    const showSecrets = game.status === "FINISHED" || isPlayer;
    res.json({
      success: true,
      data: {
        ...game,
        player1Secret: showSecrets ? game.player1Secret : null,
        player2Secret: showSecrets ? game.player2Secret : null
      }
    });
  } catch (error) {
    next(error);
  }
};
var getGameMoves = async (req, res, next) => {
  try {
    const { gameId } = req.params;
    const game = await prisma.game.findUnique({
      where: { id: gameId },
      select: { player1Id: true, player2Id: true }
    });
    if (!game) {
      throw new AppError("\uAC8C\uC784\uC744 \uCC3E\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.", 404);
    }
    const moves = await prisma.gameMove.findMany({
      where: { gameId },
      orderBy: { turnNumber: "asc" },
      select: {
        id: true,
        playerId: true,
        turnNumber: true,
        guess: true,
        strikes: true,
        balls: true,
        timeSpent: true,
        hintUsed: true,
        itemUsed: true,
        createdAt: true,
        player: {
          select: { username: true }
        }
      }
    });
    res.json({
      success: true,
      data: moves
    });
  } catch (error) {
    next(error);
  }
};

// src/routes/gameRoutes.ts
var router3 = (0, import_express3.Router)();
router3.get("/", authenticate, getMyGames);
router3.get("/:gameId", authenticate, getGameDetails);
router3.get("/:gameId/moves", authenticate, getGameMoves);
var gameRoutes_default = router3;

// src/routes/rankingRoutes.ts
var import_express4 = require("express");

// src/config/redis.ts
var import_ioredis = __toESM(require("ioredis"));
var InMemoryRedis = class {
  store = /* @__PURE__ */ new Map();
  hashes = /* @__PURE__ */ new Map();
  sortedSets = /* @__PURE__ */ new Map();
  sets = /* @__PURE__ */ new Map();
  ttls = /* @__PURE__ */ new Map();
  async ping() {
    return "PONG";
  }
  // String commands
  async get(key) {
    return this.store.get(key) || null;
  }
  async set(key, value, ...args) {
    this.store.set(key, value);
    if (args[0] === "EX" && typeof args[1] === "number") {
      this.clearTtl(key);
      this.ttls.set(key, setTimeout(() => {
        this.store.delete(key);
        this.ttls.delete(key);
      }, args[1] * 1e3));
    }
    return "OK";
  }
  async del(key) {
    this.clearTtl(key);
    const existed = this.store.has(key);
    this.store.delete(key);
    this.hashes.delete(key);
    this.sortedSets.delete(key);
    this.sets.delete(key);
    return existed ? 1 : 0;
  }
  // Hash commands
  async hset(key, field, value) {
    if (!this.hashes.has(key)) this.hashes.set(key, /* @__PURE__ */ new Map());
    this.hashes.get(key).set(field, value);
    return 1;
  }
  async hget(key, field) {
    return this.hashes.get(key)?.get(field) || null;
  }
  async hdel(key, field) {
    const h = this.hashes.get(key);
    if (!h) return 0;
    const existed = h.has(field);
    h.delete(field);
    return existed ? 1 : 0;
  }
  async hexists(key, field) {
    return this.hashes.get(key)?.has(field) ? 1 : 0;
  }
  // Sorted set commands
  async zadd(key, score, member) {
    if (!this.sortedSets.has(key)) this.sortedSets.set(key, []);
    const ss = this.sortedSets.get(key);
    const idx = ss.findIndex((e) => e.member === member);
    if (idx >= 0) {
      ss[idx].score = score;
    } else {
      ss.push({ score, member });
    }
    ss.sort((a, b) => a.score - b.score);
    return 1;
  }
  async zrem(key, member) {
    const ss = this.sortedSets.get(key);
    if (!ss) return 0;
    const idx = ss.findIndex((e) => e.member === member);
    if (idx >= 0) {
      ss.splice(idx, 1);
      return 1;
    }
    return 0;
  }
  async zrange(key, start, stop) {
    const ss = this.sortedSets.get(key) || [];
    const end = stop < 0 ? ss.length + stop + 1 : stop + 1;
    return ss.slice(start, end).map((e) => e.member);
  }
  async zrangebyscore(key, min, max) {
    const ss = this.sortedSets.get(key) || [];
    return ss.filter((e) => e.score >= min && e.score <= max).map((e) => e.member);
  }
  async zcard(key) {
    return (this.sortedSets.get(key) || []).length;
  }
  // Set commands
  async sadd(key, member) {
    if (!this.sets.has(key)) this.sets.set(key, /* @__PURE__ */ new Set());
    this.sets.get(key).add(member);
    return 1;
  }
  async srem(key, member) {
    const s = this.sets.get(key);
    if (!s) return 0;
    const existed = s.has(member);
    s.delete(member);
    return existed ? 1 : 0;
  }
  async quit() {
    return "OK";
  }
  // Event emitter stubs
  on(_event, _fn) {
    return this;
  }
  clearTtl(key) {
    const t = this.ttls.get(key);
    if (t) {
      clearTimeout(t);
      this.ttls.delete(key);
    }
  }
};
var redis;
if (process.env.REDIS_URL) {
  redis = new import_ioredis.default(process.env.REDIS_URL, {
    maxRetriesPerRequest: 3,
    retryStrategy(times) {
      const delay = Math.min(times * 50, 2e3);
      return delay;
    }
  });
  redis.on("connect", () => {
    logger.info("Redis connected");
  });
  redis.on("error", (err) => {
    logger.error("Redis connection error:", err);
  });
} else {
  logger.info("REDIS_URL not set, using in-memory store (single-server mode)");
  redis = new InMemoryRedis();
}

// src/controllers/rankingController.ts
var import_shared3 = __toESM(require_dist());
var getGlobalRanking = async (req, res, next) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const cacheKey = `ranking:global:${page}:${limit}`;
    const cached = await redis.get(cacheKey);
    if (cached) {
      return res.json({
        success: true,
        data: JSON.parse(cached),
        cached: true
      });
    }
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where: { gamesPlayed: { gte: 10 } },
        select: {
          id: true,
          username: true,
          avatarUrl: true,
          rating: true,
          tier: true,
          level: true,
          gamesPlayed: true,
          gamesWon: true
        },
        orderBy: { rating: "desc" },
        skip,
        take: Number(limit)
      }),
      prisma.user.count({ where: { gamesPlayed: { gte: 10 } } })
    ]);
    const rankedUsers = users.map((user, index) => ({
      ...user,
      rank: skip + index + 1,
      tierInfo: (0, import_shared3.getTierByRating)(user.rating),
      winRate: user.gamesPlayed > 0 ? Math.round(user.gamesWon / user.gamesPlayed * 100) : 0
    }));
    const data = {
      rankings: rankedUsers,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    };
    await redis.setex(cacheKey, 300, JSON.stringify(data));
    res.json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
};
var getSeasonRanking = async (req, res, next) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const cacheKey = `ranking:season:${page}:${limit}`;
    const cached = await redis.get(cacheKey);
    if (cached) {
      return res.json({
        success: true,
        data: JSON.parse(cached),
        cached: true
      });
    }
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where: { gamesPlayed: { gte: 10 } },
        select: {
          id: true,
          username: true,
          avatarUrl: true,
          seasonRating: true,
          tier: true,
          level: true,
          gamesPlayed: true,
          gamesWon: true
        },
        orderBy: { seasonRating: "desc" },
        skip,
        take: Number(limit)
      }),
      prisma.user.count({ where: { gamesPlayed: { gte: 10 } } })
    ]);
    const rankedUsers = users.map((user, index) => ({
      ...user,
      rank: skip + index + 1,
      tierInfo: (0, import_shared3.getTierByRating)(user.seasonRating),
      winRate: user.gamesPlayed > 0 ? Math.round(user.gamesWon / user.gamesPlayed * 100) : 0
    }));
    const data = {
      rankings: rankedUsers,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    };
    await redis.setex(cacheKey, 300, JSON.stringify(data));
    res.json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
};
var getMyRank = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        username: true,
        rating: true,
        seasonRating: true,
        gamesPlayed: true
      }
    });
    if (!user) {
      return res.json({
        success: true,
        data: { globalRank: null, seasonRank: null }
      });
    }
    if (user.gamesPlayed < 10) {
      return res.json({
        success: true,
        data: {
          globalRank: null,
          seasonRank: null,
          message: "\uB7AD\uD0B9\uC5D0 \uB4F1\uB85D\uB418\uB824\uBA74 \uCD5C\uC18C 10\uAC8C\uC784\uC774 \uD544\uC694\uD569\uB2C8\uB2E4.",
          gamesNeeded: 10 - user.gamesPlayed
        }
      });
    }
    const [globalRank, seasonRank] = await Promise.all([
      prisma.user.count({
        where: {
          rating: { gt: user.rating },
          gamesPlayed: { gte: 10 }
        }
      }),
      prisma.user.count({
        where: {
          seasonRating: { gt: user.seasonRating },
          gamesPlayed: { gte: 10 }
        }
      })
    ]);
    res.json({
      success: true,
      data: {
        globalRank: globalRank + 1,
        seasonRank: seasonRank + 1,
        rating: user.rating,
        seasonRating: user.seasonRating
      }
    });
  } catch (error) {
    next(error);
  }
};

// src/routes/rankingRoutes.ts
var router4 = (0, import_express4.Router)();
router4.get("/global", optionalAuth, getGlobalRanking);
router4.get("/season", optionalAuth, getSeasonRanking);
router4.get("/my-rank", authenticate, getMyRank);
var rankingRoutes_default = router4;

// src/routes/index.ts
var router5 = (0, import_express5.Router)();
router5.use("/auth", authRoutes_default);
router5.use("/users", userRoutes_default);
router5.use("/games", gameRoutes_default);
router5.use("/rankings", rankingRoutes_default);
var routes_default = router5;

// src/app.ts
var app = (0, import_express6.default)();
app.use((0, import_helmet.default)());
app.use(
  (0, import_cors.default)({
    origin: process.env.CORS_ORIGIN || process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true
  })
);
app.use((0, import_compression.default)());
app.use(import_express6.default.json({ limit: "10mb" }));
app.use(import_express6.default.urlencoded({ extended: true }));
app.use(
  (0, import_morgan.default)("combined", {
    stream: { write: (message) => logger.info(message.trim()) }
  })
);
var limiter = (0, import_express_rate_limit.default)({
  windowMs: 15 * 60 * 1e3,
  // 15 minutes
  max: 1e3,
  message: { message: "\uB108\uBB34 \uB9CE\uC740 \uC694\uCCAD\uC785\uB2C8\uB2E4. \uC7A0\uC2DC \uD6C4 \uB2E4\uC2DC \uC2DC\uB3C4\uD574\uC8FC\uC138\uC694." }
});
app.use("/api", limiter);
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: (/* @__PURE__ */ new Date()).toISOString() });
});
app.use("/api", routes_default);
app.use(notFoundHandler);
app.use(errorHandler);
var app_default = app;
