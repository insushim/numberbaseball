import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSocket } from '../hooks/useSocket';
import { useAppSelector, useAppDispatch } from '../store';
import { setMySecret, resetGame } from '../store/gameSlice';
import { NumberBaseballEngine } from '@numball/shared';

const Game: React.FC = () => {
  const { gameId: urlGameId } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {
    gameId,
    status,
    config,
    isMyTurn,
    myGuesses,
    opponentGuesses,
    mySecret,
    opponentSecret,
    currentTurn,
    timeLeft,
    result,
    players,
    myIndex,
  } = useAppSelector((state) => state.game);
  const { user } = useAppSelector((state) => state.auth);
  const { setSecret, makeGuess, requestHint, surrender, leaveRoom, isConnected } = useSocket();

  const [secretInput, setSecretInput] = useState('');
  const [guessInput, setGuessInput] = useState('');
  const [showResult, setShowResult] = useState(false);

  const digitCount = config?.digitCount || 4;
  const allowDuplicates = config?.allowDuplicates || false;

  // Redirect if no game
  useEffect(() => {
    if (!gameId && urlGameId) {
      navigate('/lobby');
    }
  }, [gameId, urlGameId, navigate]);

  // Show result modal when game ends
  useEffect(() => {
    if (status === 'finished' && result) {
      setShowResult(true);
    }
  }, [status, result]);

  const gameConfig = config || ({ digitCount, allowDuplicates } as any);

  const validateInput = useCallback(
    (value: string) => {
      return NumberBaseballEngine.validateGuess(value, gameConfig);
    },
    [gameConfig]
  );

  const handleSetSecret = () => {
    const validation = validateInput(secretInput);
    if (!validation.valid) {
      return;
    }
    dispatch(setMySecret(secretInput));
    setSecret(gameId!, secretInput);
  };

  const handleMakeGuess = () => {
    const validation = validateInput(guessInput);
    if (!validation.valid || !isMyTurn) {
      return;
    }
    makeGuess(gameId!, guessInput);
    setGuessInput('');
  };

  const handleLeaveGame = () => {
    if (gameId) {
      leaveRoom(gameId);
    }
    dispatch(resetGame());
    navigate('/lobby');
  };

  const opponent = players.find((_, i) => i !== myIndex);

  if (!gameId) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Game Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">Game</h1>
          <span className="px-3 py-1 bg-indigo-600/20 border border-indigo-500/30 rounded-full text-sm">
            {config?.mode || 'Classic'}
          </span>
        </div>
        <div className="flex items-center gap-4">
          {status === 'playing' && (
            <div
              className={`text-2xl font-bold ${
                timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-slate-400'
              }`}
            >
              {timeLeft}s
            </div>
          )}
          <button
            onClick={() => surrender(gameId)}
            className="px-4 py-2 bg-red-600/20 border border-red-500/50 rounded-lg text-red-400 hover:bg-red-600/30 transition-colors"
          >
            Surrender
          </button>
        </div>
      </div>

      {/* Players */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Me */}
        <div
          className={`p-4 rounded-xl border ${
            isMyTurn && status === 'playing'
              ? 'bg-indigo-600/20 border-indigo-500'
              : 'bg-slate-800 border-slate-700'
          }`}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center font-bold">
              {user?.username?.[0]?.toUpperCase()}
            </div>
            <div>
              <div className="font-medium">{user?.username} (You)</div>
              <div className="text-sm text-slate-400">{user?.rating}</div>
            </div>
          </div>
          {mySecret && (
            <div className="text-sm text-slate-400">
              Secret: <span className="font-mono text-indigo-400">{mySecret}</span>
            </div>
          )}
        </div>

        {/* Opponent */}
        <div
          className={`p-4 rounded-xl border ${
            !isMyTurn && status === 'playing'
              ? 'bg-purple-600/20 border-purple-500'
              : 'bg-slate-800 border-slate-700'
          }`}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center font-bold">
              {opponent?.username?.[0]?.toUpperCase() || '?'}
            </div>
            <div>
              <div className="font-medium">{opponent?.username || 'Opponent'}</div>
              <div className="text-sm text-slate-400">{(opponent as any)?.rating || '---'}</div>
            </div>
          </div>
          {status === 'finished' && opponentSecret && (
            <div className="text-sm text-slate-400">
              Secret: <span className="font-mono text-purple-400">{opponentSecret}</span>
            </div>
          )}
        </div>
      </div>

      {/* Secret Setting Phase */}
      {status === 'setting_secret' && !mySecret && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800 border border-slate-700 rounded-2xl p-6 mb-6"
        >
          <h2 className="text-xl font-bold mb-4">Set Your Secret Number</h2>
          <p className="text-slate-400 mb-4">
            Enter a {digitCount}-digit number {!allowDuplicates && 'with unique digits'}
          </p>
          <div className="flex gap-3">
            <input
              type="text"
              value={secretInput}
              onChange={(e) => setSecretInput(e.target.value.replace(/\D/g, '').slice(0, digitCount))}
              className="flex-1 px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-center text-2xl tracking-widest font-mono focus:outline-none focus:border-indigo-500"
              placeholder={'0'.repeat(digitCount)}
              maxLength={digitCount}
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSetSecret}
              disabled={!validateInput(secretInput).valid}
              className="px-6 py-3 bg-indigo-600 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirm
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Waiting for opponent secret */}
      {status === 'setting_secret' && mySecret && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-slate-800 border border-slate-700 rounded-2xl p-6 mb-6 text-center"
        >
          <motion.div
            className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          <p className="text-slate-400">Waiting for opponent to set their secret...</p>
        </motion.div>
      )}

      {/* Game Board */}
      {(status === 'playing' || status === 'finished') && (
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {/* My Guesses */}
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4">
            <h3 className="font-bold mb-3">Your Guesses</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {myGuesses.length === 0 ? (
                <p className="text-slate-500 text-sm">No guesses yet</p>
              ) : (
                myGuesses.map((guess, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between p-2 bg-slate-700/50 rounded-lg"
                  >
                    <span className="font-mono text-lg">{guess.guess}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-green-400 font-bold">{guess.strikes}S</span>
                      <span className="text-yellow-400 font-bold">{guess.balls}B</span>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>

          {/* Opponent Guesses */}
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4">
            <h3 className="font-bold mb-3">Opponent's Guesses</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {opponentGuesses.length === 0 ? (
                <p className="text-slate-500 text-sm">No guesses yet</p>
              ) : (
                opponentGuesses.map((guess, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between p-2 bg-slate-700/50 rounded-lg"
                  >
                    <span className="font-mono text-lg">{guess.guess}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-green-400 font-bold">{guess.strikes}S</span>
                      <span className="text-yellow-400 font-bold">{guess.balls}B</span>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Guess Input */}
      {status === 'playing' && isMyTurn && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-indigo-600/20 border border-indigo-500 rounded-2xl p-6"
        >
          <h2 className="text-xl font-bold mb-4">Your Turn!</h2>
          <div className="flex gap-3">
            <input
              type="text"
              value={guessInput}
              onChange={(e) => setGuessInput(e.target.value.replace(/\D/g, '').slice(0, digitCount))}
              onKeyDown={(e) => e.key === 'Enter' && handleMakeGuess()}
              className="flex-1 px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-center text-2xl tracking-widest font-mono focus:outline-none focus:border-indigo-500"
              placeholder={'0'.repeat(digitCount)}
              maxLength={digitCount}
              autoFocus
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleMakeGuess}
              disabled={!validateInput(guessInput).valid}
              className="px-6 py-3 bg-indigo-600 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Guess
            </motion.button>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => requestHint(gameId, 1)}
              className="px-3 py-1 bg-slate-700 rounded text-sm hover:bg-slate-600 transition-colors"
            >
              Hint Lv.1
            </button>
            <button
              onClick={() => requestHint(gameId, 2)}
              className="px-3 py-1 bg-slate-700 rounded text-sm hover:bg-slate-600 transition-colors"
            >
              Hint Lv.2
            </button>
            <button
              onClick={() => requestHint(gameId, 3)}
              className="px-3 py-1 bg-slate-700 rounded text-sm hover:bg-slate-600 transition-colors"
            >
              Hint Lv.3
            </button>
          </div>
        </motion.div>
      )}

      {/* Waiting for opponent */}
      {status === 'playing' && !isMyTurn && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-slate-800 border border-slate-700 rounded-2xl p-6 text-center"
        >
          <motion.div
            className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          <p className="text-slate-400">Waiting for opponent's guess...</p>
        </motion.div>
      )}

      {/* Result Modal */}
      <AnimatePresence>
        {showResult && result && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-800 border border-slate-700 rounded-2xl p-8 w-full max-w-md text-center"
            >
              <div className="text-6xl mb-4">
                {result.type === 'WIN' ? '🎉' : result.type === 'LOSE' ? '😢' : '🤝'}
              </div>
              <h2 className="text-3xl font-bold mb-2">
                {result.type === 'WIN' ? 'Victory!' : result.type === 'LOSE' ? 'Defeat' : 'Draw'}
              </h2>
              <p className="text-slate-400 mb-6">{result.reason}</p>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-slate-700/50 rounded-lg p-3">
                  <div
                    className={`text-xl font-bold ${
                      result.ratingChange >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}
                  >
                    {result.ratingChange >= 0 ? '+' : ''}
                    {result.ratingChange}
                  </div>
                  <div className="text-xs text-slate-400">Rating</div>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-3">
                  <div className="text-xl font-bold text-yellow-400">+{result.coinsEarned}</div>
                  <div className="text-xs text-slate-400">Coins</div>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-3">
                  <div className="text-xl font-bold text-purple-400">+{result.expEarned}</div>
                  <div className="text-xs text-slate-400">EXP</div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleLeaveGame}
                  className="flex-1 py-3 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
                >
                  Back to Lobby
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Game;
