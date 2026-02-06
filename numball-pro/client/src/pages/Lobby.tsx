import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSocket } from '../hooks/useSocket';
import { useAppSelector } from '../store';
import type { GameMode } from '@numball/shared';

const GAME_MODES: { id: GameMode; name: string; description: string; icon: string }[] = [
  { id: 'CLASSIC_3', name: 'Classic 3', description: '3 digit classic mode', icon: '3️⃣' },
  { id: 'CLASSIC_4', name: 'Classic 4', description: '4 digit classic mode', icon: '4️⃣' },
  { id: 'CLASSIC_5', name: 'Classic 5', description: '5 digit challenge', icon: '5️⃣' },
  { id: 'SPEED', name: 'Speed', description: '10 second turns', icon: '⚡' },
  { id: 'BLITZ', name: 'Blitz', description: '5 second turns', icon: '🔥' },
  { id: 'MARATHON', name: 'Marathon', description: 'Long strategic games', icon: '🏃' },
  { id: 'DUPLICATE', name: 'Duplicate', description: 'Duplicate digits allowed', icon: '🔁' },
  { id: 'REVERSE', name: 'Reverse', description: 'Guess your own number', icon: '🔄' },
];

const Lobby: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const { gameId, status } = useAppSelector((state) => state.game);
  const { startMatchmaking, cancelMatchmaking, createRoom, joinRoom, isConnected } = useSocket();

  const [selectedMode, setSelectedMode] = useState<GameMode>('CLASSIC_4');
  const [isSearching, setIsSearching] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [roomCode, setRoomCode] = useState('');

  // If game is active, navigate to game
  React.useEffect(() => {
    if (gameId && status !== 'idle') {
      navigate(`/game/${gameId}`);
    }
  }, [gameId, status, navigate]);

  const handleQuickMatch = () => {
    if (!isConnected) return;
    setIsSearching(true);
    startMatchmaking(selectedMode);
  };

  const handleCancelSearch = () => {
    setIsSearching(false);
    cancelMatchmaking();
  };

  const handleCreateRoom = () => {
    if (!isConnected) return;
    createRoom({
      mode: selectedMode,
      maxPlayers: 2,
      isPrivate: true,
    });
  };

  const handleJoinRoom = () => {
    if (!isConnected || !roomCode.trim()) return;
    joinRoom(roomCode.trim().toUpperCase());
    setShowJoinModal(false);
    setRoomCode('');
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 rounded-2xl p-6 mb-8"
      >
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, <span className="text-indigo-400">{user?.username}</span>!
        </h1>
        <div className="flex items-center gap-4 text-slate-400">
          <span>Rating: {user?.rating}</span>
          <span>•</span>
          <span>Tier: {user?.tier}</span>
          <span>•</span>
          <span>
            Win Rate: {user?.gamesPlayed ? Math.round((user.gamesWon / user.gamesPlayed) * 100) : 0}%
          </span>
        </div>
      </motion.div>

      {/* Game Mode Selection */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <h2 className="text-xl font-bold mb-4">Select Game Mode</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {GAME_MODES.map((mode) => (
            <motion.button
              key={mode.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedMode(mode.id)}
              className={`p-4 rounded-xl border text-left transition-colors ${
                selectedMode === mode.id
                  ? 'bg-indigo-600/20 border-indigo-500'
                  : 'bg-slate-800 border-slate-700 hover:border-slate-600'
              }`}
            >
              <div className="text-2xl mb-2">{mode.icon}</div>
              <div className="font-medium">{mode.name}</div>
              <div className="text-xs text-slate-400">{mode.description}</div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid md:grid-cols-3 gap-4"
      >
        {/* Quick Match */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={isSearching ? handleCancelSearch : handleQuickMatch}
          disabled={!isConnected}
          className={`p-6 rounded-xl text-center ${
            isSearching
              ? 'bg-red-600/20 border border-red-500'
              : 'bg-gradient-to-br from-indigo-600 to-purple-600'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <div className="text-3xl mb-2">{isSearching ? '⏹️' : '🎮'}</div>
          <div className="font-bold text-lg">{isSearching ? 'Cancel Search' : 'Quick Match'}</div>
          <div className="text-sm text-slate-300">
            {isSearching ? 'Searching for opponent...' : 'Find a random opponent'}
          </div>
          {isSearching && (
            <div className="mt-2">
              <motion.div
                className="w-8 h-8 border-4 border-red-400 border-t-transparent rounded-full mx-auto"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
            </div>
          )}
        </motion.button>

        {/* Create Room */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleCreateRoom}
          disabled={!isConnected || isSearching}
          className="p-6 rounded-xl bg-slate-800 border border-slate-700 text-center disabled:opacity-50 disabled:cursor-not-allowed hover:border-slate-600 transition-colors"
        >
          <div className="text-3xl mb-2">🏠</div>
          <div className="font-bold text-lg">Create Room</div>
          <div className="text-sm text-slate-400">Create a private room</div>
        </motion.button>

        {/* Join Room */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowJoinModal(true)}
          disabled={!isConnected || isSearching}
          className="p-6 rounded-xl bg-slate-800 border border-slate-700 text-center disabled:opacity-50 disabled:cursor-not-allowed hover:border-slate-600 transition-colors"
        >
          <div className="text-3xl mb-2">🚪</div>
          <div className="font-bold text-lg">Join Room</div>
          <div className="text-sm text-slate-400">Enter room code</div>
        </motion.button>
      </motion.div>

      {/* Connection Status */}
      {!isConnected && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-center text-red-400"
        >
          Not connected to server. Please wait or refresh the page.
        </motion.div>
      )}

      {/* Join Room Modal */}
      <AnimatePresence>
        {showJoinModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4"
            onClick={() => setShowJoinModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-800 border border-slate-700 rounded-2xl p-6 w-full max-w-md"
            >
              <h2 className="text-xl font-bold mb-4">Join Room</h2>
              <input
                type="text"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                placeholder="Enter room code"
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors text-center text-2xl tracking-widest uppercase"
                maxLength={6}
              />
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => setShowJoinModal(false)}
                  className="flex-1 py-3 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleJoinRoom}
                  disabled={roomCode.length < 4}
                  className="flex-1 py-3 bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Join
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Lobby;
