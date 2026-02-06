import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { NumberBaseballEngine } from '@numball/shared';

interface PracticeGuess {
  guess: string;
  strikes: number;
  balls: number;
}

const Practice: React.FC = () => {
  const [digitCount, setDigitCount] = useState(4);
  const [allowDuplicates, setAllowDuplicates] = useState(false);
  const [secret, setSecret] = useState('');
  const [guesses, setGuesses] = useState<PracticeGuess[]>([]);
  const [guessInput, setGuessInput] = useState('');
  const [gameStatus, setGameStatus] = useState<'idle' | 'playing' | 'won'>('idle');
  const [showSecret, setShowSecret] = useState(false);

  const startGame = useCallback(() => {
    const newSecret = NumberBaseballEngine.generateSecretNumber(digitCount, allowDuplicates);
    setSecret(newSecret);
    setGuesses([]);
    setGuessInput('');
    setGameStatus('playing');
    setShowSecret(false);
  }, [digitCount, allowDuplicates]);

  const handleGuess = () => {
    const validation = NumberBaseballEngine.validateGuess(guessInput, digitCount, allowDuplicates);
    if (!validation.valid) return;

    const result = NumberBaseballEngine.calculateResult(secret, guessInput);
    const newGuess: PracticeGuess = {
      guess: guessInput,
      strikes: result.strikes,
      balls: result.balls,
    };

    setGuesses((prev) => [...prev, newGuess]);
    setGuessInput('');

    if (result.strikes === digitCount) {
      setGameStatus('won');
    }
  };

  const getRecommendation = () => {
    if (guesses.length === 0) return null;

    const guessResults = guesses.map((g) => ({
      guess: g.guess,
      strikes: g.strikes,
      balls: g.balls,
    }));

    const recommendation = NumberBaseballEngine.recommendNextGuess(
      guessResults,
      digitCount,
      allowDuplicates
    );

    return recommendation;
  };

  const recommendation = gameStatus === 'playing' ? getRecommendation() : null;

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-2">Practice Mode</h1>
        <p className="text-slate-400">Practice against the computer to improve your skills</p>
      </motion.div>

      {/* Settings */}
      {gameStatus === 'idle' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-slate-800 border border-slate-700 rounded-2xl p-6 mb-6"
        >
          <h2 className="text-xl font-bold mb-4">Game Settings</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                Digit Count
              </label>
              <div className="flex gap-2">
                {[3, 4, 5, 6].map((num) => (
                  <button
                    key={num}
                    onClick={() => setDigitCount(num)}
                    className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                      digitCount === num
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                    }`}
                  >
                    {num} digits
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={allowDuplicates}
                  onChange={(e) => setAllowDuplicates(e.target.checked)}
                  className="w-5 h-5 rounded bg-slate-700 border-slate-600 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-slate-300">Allow duplicate digits</span>
              </label>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={startGame}
            className="w-full mt-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl font-semibold text-lg"
          >
            Start Practice
          </motion.button>
        </motion.div>
      )}

      {/* Game Area */}
      {(gameStatus === 'playing' || gameStatus === 'won') && (
        <>
          {/* Game Info */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <span className="px-3 py-1 bg-indigo-600/20 border border-indigo-500/30 rounded-full text-sm">
                {digitCount} digits
              </span>
              {allowDuplicates && (
                <span className="px-3 py-1 bg-purple-600/20 border border-purple-500/30 rounded-full text-sm">
                  Duplicates allowed
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowSecret(!showSecret)}
                className="px-4 py-2 bg-slate-700 rounded-lg text-sm hover:bg-slate-600 transition-colors"
              >
                {showSecret ? 'Hide' : 'Show'} Answer
              </button>
              <button
                onClick={() => setGameStatus('idle')}
                className="px-4 py-2 bg-red-600/20 border border-red-500/50 rounded-lg text-red-400 text-sm hover:bg-red-600/30 transition-colors"
              >
                Quit
              </button>
            </div>
          </div>

          {showSecret && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-3 mb-6 text-center"
            >
              Secret: <span className="font-mono text-xl text-yellow-400">{secret}</span>
            </motion.div>
          )}

          {/* Guesses */}
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4 mb-6">
            <h3 className="font-bold mb-3">
              Guesses ({guesses.length})
            </h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {guesses.length === 0 ? (
                <p className="text-slate-500 text-sm">Make your first guess!</p>
              ) : (
                guesses.map((guess, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-slate-500 text-sm">#{i + 1}</span>
                      <span className="font-mono text-xl">{guess.guess}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-green-400 font-bold text-lg">{guess.strikes}S</span>
                      <span className="text-yellow-400 font-bold text-lg">{guess.balls}B</span>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>

          {/* AI Recommendation */}
          {recommendation && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-indigo-600/10 border border-indigo-500/30 rounded-xl p-4 mb-6"
            >
              <div className="flex items-center gap-2 mb-2">
                <span>🤖</span>
                <span className="font-medium">AI Recommendation</span>
              </div>
              <p className="text-slate-400 text-sm mb-2">
                Remaining possibilities: {recommendation.remainingCount}
              </p>
              {recommendation.bestGuesses.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {recommendation.bestGuesses.slice(0, 5).map((guess, i) => (
                    <button
                      key={i}
                      onClick={() => setGuessInput(guess)}
                      className="px-3 py-1 bg-indigo-600/30 border border-indigo-500/50 rounded-lg font-mono hover:bg-indigo-600/50 transition-colors"
                    >
                      {guess}
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Input */}
          {gameStatus === 'playing' ? (
            <div className="flex gap-3">
              <input
                type="text"
                value={guessInput}
                onChange={(e) =>
                  setGuessInput(e.target.value.replace(/\D/g, '').slice(0, digitCount))
                }
                onKeyDown={(e) => e.key === 'Enter' && handleGuess()}
                className="flex-1 px-4 py-4 bg-slate-900 border border-slate-700 rounded-xl text-center text-2xl tracking-widest font-mono focus:outline-none focus:border-indigo-500"
                placeholder={'0'.repeat(digitCount)}
                maxLength={digitCount}
                autoFocus
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleGuess}
                disabled={
                  !NumberBaseballEngine.validateGuess(guessInput, digitCount, allowDuplicates).valid
                }
                className="px-8 py-4 bg-indigo-600 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Guess
              </motion.button>
            </div>
          ) : (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-green-600/20 border border-green-500 rounded-2xl p-8 text-center"
            >
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold mb-2">Congratulations!</h2>
              <p className="text-slate-400 mb-4">
                You found the secret number in {guesses.length} guesses!
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={startGame}
                className="px-6 py-3 bg-indigo-600 rounded-lg font-semibold"
              >
                Play Again
              </motion.button>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
};

export default Practice;
