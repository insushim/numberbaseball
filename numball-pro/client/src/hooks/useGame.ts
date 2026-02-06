import { useCallback, useMemo } from 'react';
import { useAppSelector } from '../store';
import { NumberBaseballEngine, GAME_MODE_CONFIGS, GameMode } from '@numball/shared';
import type { GameModeConfig, GuessResult } from '@numball/shared';

const makeConfig = (digitCount: number, allowDuplicates: boolean): GameModeConfig =>
  ({ digitCount, allowDuplicates } as GameModeConfig);

export const useGame = () => {
  const game = useAppSelector((state) => state.game);
  const { user } = useAppSelector((state) => state.auth);

  const digitCount = game.config?.digitCount || 4;
  const allowDuplicates = game.config?.allowDuplicates || false;
  const config = game.config || makeConfig(digitCount, allowDuplicates);

  const validateInput = useCallback(
    (value: string) => {
      return NumberBaseballEngine.validateGuess(value, config);
    },
    [config]
  );

  const remainingPossibilities = useMemo(() => {
    if (game.myGuesses.length === 0) return null;

    const guessResults: GuessResult[] = game.myGuesses.map((g) => ({
      guess: g.guess,
      strikes: g.strikes,
      balls: g.balls,
      timestamp: 0,
      turnNumber: 0,
      timeSpent: 0,
    }));

    return NumberBaseballEngine.calculatePossibilities(guessResults, config);
  }, [game.myGuesses, config]);

  const recommendation = useMemo(() => {
    if (game.myGuesses.length === 0 || game.status !== 'playing') return null;

    const guessResults: GuessResult[] = game.myGuesses.map((g) => ({
      guess: g.guess,
      strikes: g.strikes,
      balls: g.balls,
      timestamp: 0,
      turnNumber: 0,
      timeSpent: 0,
    }));

    return NumberBaseballEngine.recommendNextGuess(guessResults, config);
  }, [game.myGuesses, game.status, config]);

  const opponent = useMemo(() => {
    return game.players.find((_, i) => i !== game.myIndex);
  }, [game.players, game.myIndex]);

  const myPlayer = useMemo(() => {
    return game.players[game.myIndex];
  }, [game.players, game.myIndex]);

  return {
    ...game,
    digitCount,
    allowDuplicates,
    validateInput,
    remainingPossibilities,
    recommendation,
    opponent,
    myPlayer,
    isGameActive: game.status === 'playing' || game.status === 'setting_secret',
    isWaiting: game.status === 'setting_secret' && !!game.mySecret,
  };
};
