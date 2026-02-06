import { prisma } from '../config/database';
import { redis } from '../config/redis';
import { GameMode } from '@numball/shared';

interface ActiveGame {
  gameId: string;
  roomCode: string;
  mode: GameMode;
  players: {
    id: string;
    username: string;
    socketId: string;
    secret?: string;
    secretSet: boolean;
  }[];
  currentTurn: number;
  turnPlayerId: string;
  status: 'waiting_secrets' | 'playing' | 'finished';
  startedAt: number;
  turnStartedAt?: number;
}

export class GameService {
  private static readonly GAME_PREFIX = 'game:';
  private static readonly ROOM_PREFIX = 'room:';

  static async createGame(
    roomCode: string,
    mode: GameMode,
    players: { id: string; username: string; socketId: string }[]
  ): Promise<ActiveGame> {
    const gameId = `game_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const game: ActiveGame = {
      gameId,
      roomCode,
      mode,
      players: players.map((p) => ({
        ...p,
        secretSet: false,
      })),
      currentTurn: 0,
      turnPlayerId: players[0].id,
      status: 'waiting_secrets',
      startedAt: Date.now(),
    };

    await redis.set(
      `${this.GAME_PREFIX}${gameId}`,
      JSON.stringify(game),
      'EX',
      3600 // 1 hour expiry
    );

    return game;
  }

  static async getGame(gameId: string): Promise<ActiveGame | null> {
    const data = await redis.get(`${this.GAME_PREFIX}${gameId}`);
    return data ? JSON.parse(data) : null;
  }

  static async updateGame(gameId: string, game: ActiveGame): Promise<void> {
    await redis.set(
      `${this.GAME_PREFIX}${gameId}`,
      JSON.stringify(game),
      'EX',
      3600
    );
  }

  static async deleteGame(gameId: string): Promise<void> {
    await redis.del(`${this.GAME_PREFIX}${gameId}`);
  }

  static async setPlayerSecret(
    gameId: string,
    playerId: string,
    secret: string
  ): Promise<ActiveGame | null> {
    const game = await this.getGame(gameId);
    if (!game) return null;

    const player = game.players.find((p) => p.id === playerId);
    if (!player) return null;

    player.secret = secret;
    player.secretSet = true;

    // Check if all players have set their secrets
    const allSecretsSet = game.players.every((p) => p.secretSet);
    if (allSecretsSet) {
      game.status = 'playing';
      game.turnStartedAt = Date.now();
    }

    await this.updateGame(gameId, game);
    return game;
  }

  static async nextTurn(gameId: string): Promise<ActiveGame | null> {
    const game = await this.getGame(gameId);
    if (!game) return null;

    game.currentTurn++;
    const nextPlayerIndex = game.currentTurn % game.players.length;
    game.turnPlayerId = game.players[nextPlayerIndex].id;
    game.turnStartedAt = Date.now();

    await this.updateGame(gameId, game);
    return game;
  }

  static async saveGameResult(
    gameId: string,
    mode: GameMode,
    winnerId: string | null,
    players: {
      playerId: string;
      secret: string;
      guessCount: number;
      isWinner: boolean;
      ratingBefore: number;
      ratingAfter: number;
      ratingChange: number;
      coinsEarned: number;
      expEarned: number;
    }[]
  ) {
    return prisma.game.create({
      data: {
        mode,
        status: 'COMPLETED',
        winnerId,
        startedAt: new Date(),
        endedAt: new Date(),
        players: {
          create: players,
        },
      },
      include: {
        players: true,
      },
    });
  }

  static async getGameHistory(gameId: string) {
    return prisma.game.findUnique({
      where: { id: gameId },
      include: {
        players: {
          include: {
            player: {
              select: {
                id: true,
                username: true,
                avatarUrl: true,
                rating: true,
                tier: true,
              },
            },
          },
        },
        moves: {
          orderBy: { moveNumber: 'asc' },
        },
      },
    });
  }

  static async saveMove(
    gameId: string,
    playerId: string,
    guess: string,
    strikes: number,
    balls: number,
    moveNumber: number
  ) {
    // First check if this is a real game in DB, if not skip
    const game = await prisma.game.findUnique({ where: { id: gameId } });
    if (!game) return null;

    return prisma.gameMove.create({
      data: {
        gameId,
        playerId,
        guess,
        strikes,
        balls,
        moveNumber,
      },
    });
  }
}
