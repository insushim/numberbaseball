import { Server, Socket } from 'socket.io';
import { PrismaClient } from '@prisma/client';
import { Redis } from 'ioredis';
import { NumberBaseballEngine, EloCalculator, getTierByRating, GAME_MODE_CONFIGS, GameMode } from '@numball/shared';
import { logger } from '../../utils/logger';
import type { GameState, PlayerGameState, GuessResult, GameModeConfig } from '@numball/shared';

interface AuthenticatedSocket extends Socket {
  userId: string;
  username: string;
}

interface ActiveGame {
  id: string;
  roomCode: string;
  state: GameState;
  turnTimer: NodeJS.Timeout | null;
  turnStartTime: number;
  secretPhaseTimer: NodeJS.Timeout | null;
}

export class GameHandler {
  private io: Server;
  private prisma: PrismaClient;
  private redis: Redis;
  private activeGames: Map<string, ActiveGame> = new Map();
  private playerGameMap: Map<string, string> = new Map();
  private eloCalculator: EloCalculator;

  constructor(io: Server, prisma: PrismaClient, redis: Redis) {
    this.io = io;
    this.prisma = prisma;
    this.redis = redis;
    this.eloCalculator = new EloCalculator();
  }

  async startGame(roomCode: string, players: any[], mode: string, settings: any): Promise<string> {
    const config = GAME_MODE_CONFIGS[mode as GameMode] || GAME_MODE_CONFIGS.CLASSIC_4;
    const gameId = `game_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const game = await this.prisma.game.create({
      data: {
        id: gameId,
        roomCode,
        mode,
        player1Id: players[0].userId,
        player2Id: players[1].userId,
        status: 'SETTING_NUMBERS',
        timeLimit: settings.timeLimit ?? config.timeLimit,
        maxAttempts: settings.maxAttempts ?? config.maxAttempts,
        hintsAllowed: settings.hintsAllowed ?? config.hintsAllowed,
        itemsAllowed: settings.itemsAllowed ?? config.itemsAllowed,
        isRanked: settings.isRanked ?? true,
        player1RatingBefore: players[0].rating,
        player2RatingBefore: players[1].rating,
      },
    });

    const gameState: GameState = {
      id: gameId,
      roomCode,
      mode: mode as GameMode,
      config,
      players: players.map((p) => ({
        userId: p.userId,
        username: p.username,
        avatarUrl: p.avatarUrl,
        secretNumber: '',
        guesses: [],
        isReady: false,
        hasWon: false,
        remainingTime: config.timeLimit,
        hintsUsed: 0,
        itemsUsed: [],
        score: 0,
        connected: true,
      })),
      currentTurn: 0,
      currentPlayerIndex: 0,
      status: 'SETTING_NUMBERS',
      isRanked: settings.isRanked ?? true,
      startedAt: Date.now(),
      draw: false,
    };

    const activeGame: ActiveGame = {
      id: gameId,
      roomCode,
      state: gameState,
      turnTimer: null,
      turnStartTime: 0,
      secretPhaseTimer: null,
    };

    this.activeGames.set(gameId, activeGame);
    players.forEach((p) => {
      this.playerGameMap.set(p.userId, gameId);
      this.redis.sadd('in_game_users', p.userId);
    });

    // Emit game start
    for (let i = 0; i < players.length; i++) {
      const socketId = await this.redis.get(`socket:${players[i].userId}`);
      if (socketId) {
        this.io.to(socketId).emit('game:started', {
          gameId,
          roomCode,
          mode,
          config,
          players: players.map((pl) => ({
            userId: pl.userId,
            username: pl.username,
            avatarUrl: pl.avatarUrl,
            rating: pl.rating,
            tier: pl.tier,
            level: pl.level,
            isReady: false,
            isHost: false,
            isOnline: true,
          })),
          yourIndex: i,
          isRanked: settings.isRanked ?? true,
        });
      }
    }

    // Secret phase
    this.broadcastToGame(gameId, 'game:setSecretPhase', { timeLimit: 60 });

    activeGame.secretPhaseTimer = setTimeout(() => {
      this.handleSecretPhaseTimeout(activeGame);
    }, 60000);

    logger.info(`Game started: ${gameId} (${mode})`);
    return gameId;
  }

  private async handleSecretPhaseTimeout(activeGame: ActiveGame) {
    const { state } = activeGame;

    for (const player of state.players) {
      if (!player.secretNumber) {
        player.secretNumber = NumberBaseballEngine.generateSecretNumber(state.config.digitCount, state.config.allowDuplicates);
        this.broadcastToGame(activeGame.id, 'game:secretSet', { userId: player.userId });
      }
    }

    await this.startGamePlay(activeGame);
  }

  async setSecret(socket: AuthenticatedSocket, secret: string) {
    const gameId = this.playerGameMap.get(socket.userId);
    if (!gameId) {
      socket.emit('game:error', { message: '게임을 찾을 수 없습니다.' });
      return;
    }

    const activeGame = this.activeGames.get(gameId);
    if (!activeGame || activeGame.state.status !== 'SETTING_NUMBERS') {
      socket.emit('game:error', { message: '비밀번호를 설정할 수 없는 상태입니다.' });
      return;
    }

    const { state } = activeGame;
    const playerIndex = state.players.findIndex((p) => p.userId === socket.userId);
    if (playerIndex === -1) return;

    const validation = NumberBaseballEngine.validateSecretNumber(secret, state.config);
    if (!validation.valid) {
      socket.emit('game:error', { message: validation.errors[0] });
      return;
    }

    state.players[playerIndex].secretNumber = secret;
    state.players[playerIndex].isReady = true;

    await this.prisma.game.update({
      where: { id: gameId },
      data: playerIndex === 0 ? { player1Secret: secret, player1Ready: true } : { player2Secret: secret, player2Ready: true },
    });

    this.broadcastToGame(gameId, 'game:secretSet', { userId: socket.userId });

    if (state.players.every((p) => p.isReady && p.secretNumber)) {
      if (activeGame.secretPhaseTimer) {
        clearTimeout(activeGame.secretPhaseTimer);
        activeGame.secretPhaseTimer = null;
      }
      await this.startGamePlay(activeGame);
    }
  }

  private async startGamePlay(activeGame: ActiveGame) {
    const { state } = activeGame;
    state.status = 'IN_PROGRESS';
    state.startedAt = Date.now();

    await this.prisma.game.update({
      where: { id: activeGame.id },
      data: { status: 'IN_PROGRESS', startedAt: new Date() },
    });

    this.broadcastToGame(activeGame.id, 'game:allSecretsSet', {});

    // Random first player
    state.currentPlayerIndex = Math.random() < 0.5 ? 0 : 1;

    setTimeout(() => {
      this.startTurn(activeGame);
    }, 1500);
  }

  private async startTurn(activeGame: ActiveGame) {
    const { state } = activeGame;
    const currentPlayer = state.players[state.currentPlayerIndex];
    const opponentPlayer = state.players[1 - state.currentPlayerIndex];

    activeGame.turnStartTime = Date.now();

    const remainingAttempts = state.config.maxAttempts > 0 ? state.config.maxAttempts - currentPlayer.guesses.length : -1;

    const currentSocketId = await this.redis.get(`socket:${currentPlayer.userId}`);
    if (currentSocketId) {
      this.io.to(currentSocketId).emit('game:yourTurn', {
        timeLimit: state.config.timeLimit,
        turnNumber: state.currentTurn + 1,
        remainingAttempts,
      });
    }

    const opponentSocketId = await this.redis.get(`socket:${opponentPlayer.userId}`);
    if (opponentSocketId) {
      this.io.to(opponentSocketId).emit('game:opponentTurn', {
        oderId: currentPlayer.userId,
        turnNumber: state.currentTurn + 1,
      });
    }

    // Timer
    if (state.config.timeLimit > 0) {
      if (activeGame.turnTimer) {
        clearTimeout(activeGame.turnTimer);
      }

      activeGame.turnTimer = setTimeout(() => {
        this.handleTurnTimeout(activeGame);
      }, state.config.timeLimit * 1000);

      // 5 second warning
      if (state.config.timeLimit > 5) {
        setTimeout(async () => {
          if (activeGame.state.status === 'IN_PROGRESS' && activeGame.state.currentPlayerIndex === state.currentPlayerIndex) {
            const socketId = await this.redis.get(`socket:${currentPlayer.userId}`);
            if (socketId) {
              this.io.to(socketId).emit('game:timeWarning', { secondsLeft: 5 });
            }
          }
        }, (state.config.timeLimit - 5) * 1000);
      }
    }
  }

  async makeGuess(socket: AuthenticatedSocket, guess: string) {
    const gameId = this.playerGameMap.get(socket.userId);
    if (!gameId) {
      socket.emit('game:error', { message: '게임을 찾을 수 없습니다.' });
      return;
    }

    const activeGame = this.activeGames.get(gameId);
    if (!activeGame || activeGame.state.status !== 'IN_PROGRESS') {
      socket.emit('game:error', { message: '게임이 진행 중이 아닙니다.' });
      return;
    }

    const { state } = activeGame;
    const playerIndex = state.players.findIndex((p) => p.userId === socket.userId);

    if (playerIndex !== state.currentPlayerIndex) {
      socket.emit('game:error', { message: '당신의 차례가 아닙니다.' });
      return;
    }

    const currentPlayer = state.players[playerIndex];
    const opponentPlayer = state.players[1 - playerIndex];

    const validation = NumberBaseballEngine.validateGuess(guess, state.config);
    if (!validation.valid) {
      socket.emit('game:error', { message: validation.errors[0] });
      return;
    }

    // Stop timer
    if (activeGame.turnTimer) {
      clearTimeout(activeGame.turnTimer);
      activeGame.turnTimer = null;
    }

    const timeSpent = Math.round((Date.now() - activeGame.turnStartTime) / 1000);
    const result = NumberBaseballEngine.calculateResult(opponentPlayer.secretNumber, guess);

    const guessResult: GuessResult = {
      guess,
      strikes: result.strikes,
      balls: result.balls,
      timestamp: Date.now(),
      turnNumber: state.currentTurn + 1,
      timeSpent,
    };

    currentPlayer.guesses.push(guessResult);

    await this.prisma.gameMove.create({
      data: {
        gameId,
        playerId: socket.userId,
        turnNumber: state.currentTurn + 1,
        guess,
        strikes: result.strikes,
        balls: result.balls,
        timeSpent,
      },
    });

    const isCorrect = result.strikes === state.config.digitCount;
    const remainingAttempts = state.config.maxAttempts > 0 ? state.config.maxAttempts - currentPlayer.guesses.length : -1;

    socket.emit('game:guessResult', {
      oderId: socket.userId,
      turnNumber: state.currentTurn + 1,
      guess,
      strikes: result.strikes,
      balls: result.balls,
      timeSpent,
      isCorrect,
      remainingAttempts,
    });

    const opponentSocketId = await this.redis.get(`socket:${opponentPlayer.userId}`);
    if (opponentSocketId) {
      this.io.to(opponentSocketId).emit('game:opponentGuessed', {
        oderId: socket.userId,
        turnNumber: state.currentTurn + 1,
        strikes: result.strikes,
        balls: result.balls,
        timeSpent,
        isCorrect,
      });
    }

    if (isCorrect) {
      currentPlayer.hasWon = true;
      await this.endGame(activeGame, socket.userId, 'CORRECT_GUESS');
      return;
    }

    if (state.config.maxAttempts > 0 && currentPlayer.guesses.length >= state.config.maxAttempts) {
      if (opponentPlayer.guesses.length >= state.config.maxAttempts) {
        await this.endGame(activeGame, null, 'MAX_ATTEMPTS_REACHED');
        return;
      }
    }

    state.currentTurn++;
    state.currentPlayerIndex = 1 - state.currentPlayerIndex;
    this.startTurn(activeGame);
  }

  private async handleTurnTimeout(activeGame: ActiveGame) {
    const { state } = activeGame;
    const currentPlayer = state.players[state.currentPlayerIndex];

    this.broadcastToGame(activeGame.id, 'game:timeout', {
      oderId: currentPlayer.userId,
    });

    const winnerId = state.players[1 - state.currentPlayerIndex].userId;
    await this.endGame(activeGame, winnerId, 'TIMEOUT');
  }

  async useHint(socket: AuthenticatedSocket, hintLevel: number) {
    const gameId = this.playerGameMap.get(socket.userId);
    if (!gameId) return;

    const activeGame = this.activeGames.get(gameId);
    if (!activeGame || activeGame.state.status !== 'IN_PROGRESS') return;

    const { state } = activeGame;
    if (!state.config.hintsAllowed) {
      socket.emit('game:error', { message: '이 게임에서는 힌트를 사용할 수 없습니다.' });
      return;
    }

    const playerIndex = state.players.findIndex((p) => p.userId === socket.userId);
    if (playerIndex === -1 || playerIndex !== state.currentPlayerIndex) return;

    const player = state.players[playerIndex];

    if (player.hintsUsed >= 3) {
      socket.emit('game:error', { message: '힌트를 더 이상 사용할 수 없습니다.' });
      return;
    }

    const hint = NumberBaseballEngine.generateHint(player.guesses, state.config, hintLevel);

    const user = await this.prisma.user.findUnique({
      where: { id: socket.userId },
      select: { coins: true },
    });

    if (!user || user.coins < hint.cost) {
      socket.emit('game:error', { message: '코인이 부족합니다.' });
      return;
    }

    await this.prisma.user.update({
      where: { id: socket.userId },
      data: { coins: { decrement: hint.cost } },
    });

    player.hintsUsed++;

    socket.emit('game:hintResult', {
      oderId: socket.userId,
      hint: {
        type: hint.type,
        content: hint.content,
        cost: hint.cost,
      },
    });
  }

  async useItem(socket: AuthenticatedSocket, itemId: string) {
    // Item usage implementation
    socket.emit('game:error', { message: '아이템 기능은 준비 중입니다.' });
  }

  async surrender(socket: AuthenticatedSocket) {
    const gameId = this.playerGameMap.get(socket.userId);
    if (!gameId) return;

    const activeGame = this.activeGames.get(gameId);
    if (!activeGame || activeGame.state.status !== 'IN_PROGRESS') return;

    const { state } = activeGame;
    const playerIndex = state.players.findIndex((p) => p.userId === socket.userId);
    if (playerIndex === -1) return;

    this.broadcastToGame(gameId, 'game:surrendered', { oderId: socket.userId });

    const winnerId = state.players[1 - playerIndex].userId;
    await this.endGame(activeGame, winnerId, 'FORFEIT');
  }

  private async endGame(activeGame: ActiveGame, winnerId: string | null, reason: string) {
    const { state } = activeGame;
    state.status = 'FINISHED';
    state.endedAt = Date.now();
    state.winner = winnerId || undefined;
    state.draw = !winnerId;

    if (activeGame.turnTimer) {
      clearTimeout(activeGame.turnTimer);
      activeGame.turnTimer = null;
    }

    const totalDuration = Math.round((state.endedAt - state.startedAt) / 1000);

    // ELO calculation
    let eloResults: any = null;

    if (state.isRanked) {
      const player1 = await this.prisma.user.findUnique({
        where: { id: state.players[0].userId },
        select: { id: true, rating: true, gamesPlayed: true },
      });
      const player2 = await this.prisma.user.findUnique({
        where: { id: state.players[1].userId },
        select: { id: true, rating: true, gamesPlayed: true },
      });

      if (player1 && player2) {
        eloResults = this.eloCalculator.processGameResult(
          { oderId: player1.id, rating: player1.rating, gamesPlayed: player1.gamesPlayed },
          { oderId: player2.id, rating: player2.rating, gamesPlayed: player2.gamesPlayed },
          winnerId,
          state.config.eloMultiplier
        );

        for (const result of [eloResults.player1Result, eloResults.player2Result]) {
          const newTier = getTierByRating(result.newRating);
          await this.prisma.user.update({
            where: { id: result.oderId },
            data: {
              rating: result.newRating,
              seasonRating: result.newRating,
              tier: newTier.tier,
              gamesPlayed: { increment: 1 },
              gamesWon: winnerId === result.oderId ? { increment: 1 } : undefined,
              gamesLost: winnerId && winnerId !== result.oderId ? { increment: 1 } : undefined,
              gamesDraw: !winnerId ? { increment: 1 } : undefined,
              totalPlayTime: { increment: totalDuration },
              winStreak: winnerId === result.oderId ? { increment: 1 } : 0,
            },
          });
        }
      }
    }

    // Update game
    await this.prisma.game.update({
      where: { id: activeGame.id },
      data: {
        status: 'FINISHED',
        winnerId,
        isDraw: !winnerId,
        winReason: reason,
        endedAt: new Date(),
        totalDuration,
        player1RatingAfter: eloResults?.player1Result.newRating,
        player1RatingChange: eloResults?.player1Result.ratingChange,
        player2RatingAfter: eloResults?.player2Result.newRating,
        player2RatingChange: eloResults?.player2Result.ratingChange,
      },
    });

    // Send results
    const baseCoins = state.config.basePoints;
    const baseExp = 50;

    for (let i = 0; i < 2; i++) {
      const player = state.players[i];
      const opponent = state.players[1 - i];
      const isWinner = winnerId === player.userId;
      const isDraw = !winnerId;

      const coinsEarned = isDraw ? Math.round(baseCoins * 0.8) : isWinner ? Math.round(baseCoins * 1.5) : Math.round(baseCoins * 0.3);

      const expEarned = isDraw ? baseExp : isWinner ? baseExp * 2 : Math.round(baseExp * 0.5);

      await this.prisma.user.update({
        where: { id: player.userId },
        data: {
          coins: { increment: coinsEarned },
          experience: { increment: expEarned },
        },
      });

      const ratingResult = i === 0 ? eloResults?.player1Result : eloResults?.player2Result;
      const gameRecord = await this.prisma.game.findUnique({ where: { id: activeGame.id } });
      const ratingBefore = i === 0 ? gameRecord?.player1RatingBefore || 1000 : gameRecord?.player2RatingBefore || 1000;

      const socketId = await this.redis.get(`socket:${player.userId}`);
      if (socketId) {
        const tierBefore = getTierByRating(ratingBefore);
        const tierAfter = getTierByRating(ratingResult?.newRating || ratingBefore);

        this.io.to(socketId).emit('game:ended', {
          gameId: activeGame.id,
          result: isDraw ? 'DRAW' : isWinner ? 'WIN' : 'LOSE',
          winnerId: winnerId || undefined,
          winnerName: winnerId ? state.players.find((p) => p.userId === winnerId)?.username : undefined,
          reason,
          myAttempts: player.guesses.length,
          mySecret: player.secretNumber,
          opponentSecret: opponent.secretNumber,
          opponentAttempts: opponent.guesses.length,
          ratingBefore,
          ratingAfter: ratingResult?.newRating || ratingBefore,
          ratingChange: ratingResult?.ratingChange || 0,
          tierBefore: tierBefore.tier,
          tierAfter: tierAfter.tier,
          tierChanged: tierBefore.tier !== tierAfter.tier,
          coinsEarned,
          expEarned,
          levelUp: false,
          achievementsUnlocked: [],
          gameStats: {
            totalTime: totalDuration,
            averageGuessTime:
              player.guesses.length > 0 ? Math.round(player.guesses.reduce((sum, g) => sum + g.timeSpent, 0) / player.guesses.length) : 0,
            hintsUsed: player.hintsUsed,
            itemsUsed: player.itemsUsed.length,
            perfectGuesses: player.guesses.filter((g) => g.strikes === state.config.digitCount).length,
          },
        });
      }

      await this.redis.srem('in_game_users', player.userId);
    }

    // Cleanup
    this.activeGames.delete(activeGame.id);
    state.players.forEach((p) => this.playerGameMap.delete(p.userId));

    logger.info(`Game ended: ${activeGame.id} - Winner: ${winnerId || 'DRAW'} (${reason})`);
  }

  async requestRematch(socket: AuthenticatedSocket) {
    const gameId = this.playerGameMap.get(socket.userId);
    if (!gameId) return;

    const rematchKey = `rematch:${gameId}`;
    const existingRequest = await this.redis.get(rematchKey);

    if (existingRequest && existingRequest !== socket.userId) {
      await this.redis.del(rematchKey);

      const newRoomCode = this.generateRoomCode();
      this.broadcastToGame(gameId, 'game:rematchAccepted', { newRoomCode });
    } else {
      await this.redis.set(rematchKey, socket.userId, 'EX', 60);

      const activeGame = this.activeGames.get(gameId);
      if (activeGame) {
        const opponent = activeGame.state.players.find((p) => p.userId !== socket.userId);
        if (opponent) {
          const opponentSocketId = await this.redis.get(`socket:${opponent.userId}`);
          if (opponentSocketId) {
            this.io.to(opponentSocketId).emit('game:rematchRequested', { oderId: socket.userId });
          }
        }
      }
    }
  }

  async declineRematch(socket: AuthenticatedSocket) {
    const gameId = this.playerGameMap.get(socket.userId);
    if (!gameId) return;

    await this.redis.del(`rematch:${gameId}`);

    const activeGame = this.activeGames.get(gameId);
    if (activeGame) {
      const opponent = activeGame.state.players.find((p) => p.userId !== socket.userId);
      if (opponent) {
        const opponentSocketId = await this.redis.get(`socket:${opponent.userId}`);
        if (opponentSocketId) {
          this.io.to(opponentSocketId).emit('game:rematchDeclined', { oderId: socket.userId });
        }
      }
    }
  }

  async handleDisconnect(socket: AuthenticatedSocket) {
    const gameId = this.playerGameMap.get(socket.userId);
    if (!gameId) return;

    const activeGame = this.activeGames.get(gameId);
    if (!activeGame || activeGame.state.status !== 'IN_PROGRESS') return;

    const { state } = activeGame;
    const playerIndex = state.players.findIndex((p) => p.userId === socket.userId);
    if (playerIndex === -1) return;

    state.players[playerIndex].connected = false;

    const opponent = state.players[1 - playerIndex];
    const opponentSocketId = await this.redis.get(`socket:${opponent.userId}`);
    if (opponentSocketId) {
      this.io.to(opponentSocketId).emit('game:playerDisconnected', {
        oderId: socket.userId,
        waitTime: 60,
      });
    }

    setTimeout(async () => {
      const currentGame = this.activeGames.get(gameId);
      if (currentGame && !currentGame.state.players[playerIndex].connected) {
        await this.endGame(currentGame, opponent.userId, 'DISCONNECT');
      }
    }, 60000);
  }

  checkTimers() {
    // Timer check logic
  }

  private async broadcastToGame(gameId: string, event: string, data: any) {
    const activeGame = this.activeGames.get(gameId);
    if (!activeGame) return;

    for (const player of activeGame.state.players) {
      const socketId = await this.redis.get(`socket:${player.userId}`);
      if (socketId) {
        this.io.to(socketId).emit(event as any, data);
      }
    }
  }

  private generateRoomCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    return Array.from({ length: 6 }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
  }
}
