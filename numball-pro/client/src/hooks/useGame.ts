import { useCallback, useMemo } from 'react';
import { useAppSelector } from '../store';
import { NumberBaseballEngine } from '@numball/shared';

export const useGame = () => {
  const game = useAppSelector((state) => state.game);
  const { user } = useAppSelector((state) => state.auth);

  const digitCount = game.config?.digitCount || 4;
  const allowDuplicates = game.config?.allowDuplicates || false;

  const validateInput = useCallback(
    (value: string) => {
      return NumberBaseballEngine.validateGuess(value, digitCount, allowDuplicates);
    },
    [digitCount, allowDuplicates]
  );

  const remainingPossibilities = useMemo(() => {
    if (game.myGuesses.length === 0) return null;

    const guessResults = game.myGuesses.map((g) => ({
      guess: g.guess,
      strikes: g.strikes,
      balls: g.balls,
    }));

    return NumberBaseballEngine.calculatePossibilities(guessResults, digitCount, allowDuplicates);
  }, [game.myGuesses, digitCount, allowDuplicates]);

  const recommendation = useMemo(() => {
    if (game.myGuesses.length === 0 || game.status !== 'playing') return null;

    const guessResults = game.myGuesses.map((g) => ({
      guess: g.guess,
      strikes: g.strikes,
      balls: g.balls,
    }));

    return NumberBaseballEngine.recommendNextGuess(guessResults, digitCount, allowDuplicates);
  }, [game.myGuesses, game.status, digitCount, allowDuplicates]);

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
