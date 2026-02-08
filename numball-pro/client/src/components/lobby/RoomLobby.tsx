import React from 'react';
import { motion } from 'framer-motion';
import { GameMode } from '@numball/shared';

interface RoomPlayer {
  id: string;
  username: string;
  isReady: boolean;
  isHost: boolean;
  rating: number;
  tier: string;
}

interface RoomLobbyProps {
  code: string;
  mode: GameMode;
  players: RoomPlayer[];
  maxPlayers: number;
  isHost: boolean;
  isReady: boolean;
  onReady: () => void;
  onLeave: () => void;
  onStart?: () => void;
}

const MODE_LABELS: Record<GameMode, { name: string; icon: string }> = {
  [GameMode.CLASSIC_3]: { name: 'Classic 3', icon: '3️⃣' },
  [GameMode.CLASSIC_4]: { name: 'Classic 4', icon: '4️⃣' },
  [GameMode.CLASSIC_5]: { name: 'Classic 5', icon: '5️⃣' },
  [GameMode.CLASSIC_6]: { name: 'Classic 6', icon: '6️⃣' },
  [GameMode.SPEED_3]: { name: 'Speed 3', icon: '⚡' },
  [GameMode.SPEED_4]: { name: 'Speed 4', icon: '⚡' },
  [GameMode.BLITZ]: { name: 'Blitz', icon: '🔥' },
  [GameMode.MARATHON]: { name: 'Marathon', icon: '🏃' },
  [GameMode.DUPLICATE_3]: { name: 'Duplicate 3', icon: '🔁' },
  [GameMode.DUPLICATE_4]: { name: 'Duplicate 4', icon: '🔁' },
  [GameMode.REVERSE]: { name: 'Reverse', icon: '🔄' },
  [GameMode.TEAM]: { name: 'Team 2v2', icon: '👥' },
};

export const RoomLobby: React.FC<RoomLobbyProps> = ({
  code,
  mode,
  players,
  maxPlayers,
  isHost,
  isReady,
  onReady,
  onLeave,
  onStart,
}) => {
  const modeInfo = MODE_LABELS[mode] || { name: mode, icon: '🎮' };
  const allReady = players.every((p) => p.isReady || p.isHost);
  const canStart = isHost && players.length >= 2 && allReady;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800 border border-slate-700 rounded-2xl p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{modeInfo.icon}</span>
          <div>
            <h2 className="text-xl font-bold">{modeInfo.name}</h2>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <span>Room Code:</span>
              <span className="font-mono text-indigo-400 bg-slate-900 px-2 py-0.5 rounded">
                {code}
              </span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold">
            {players.length}/{maxPlayers}
          </div>
          <div className="text-sm text-slate-400">Players</div>
        </div>
      </div>

      {/* Players */}
      <div className="space-y-3 mb-6">
        {players.map((player, index) => (
          <motion.div
            key={player.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex items-center justify-between p-3 rounded-xl ${
              player.isReady || player.isHost
                ? 'bg-green-600/20 border border-green-500/30'
                : 'bg-slate-700/50'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center font-bold">
                {player.username[0].toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{player.username}</span>
                  {player.isHost && (
                    <span className="text-xs px-1.5 py-0.5 bg-yellow-600/30 text-yellow-400 rounded">
                      HOST
                    </span>
                  )}
                </div>
                <div className="text-sm text-slate-400">
                  {player.tier} • {player.rating}
                </div>
              </div>
            </div>
            <div
              className={`text-sm font-medium ${
                player.isReady || player.isHost ? 'text-green-400' : 'text-slate-400'
              }`}
            >
              {player.isHost ? 'Host' : player.isReady ? 'Ready' : 'Not Ready'}
            </div>
          </motion.div>
        ))}

        {/* Empty slots */}
        {Array.from({ length: maxPlayers - players.length }).map((_, i) => (
          <div
            key={`empty-${i}`}
            className="flex items-center justify-center p-3 rounded-xl border-2 border-dashed border-slate-700 text-slate-500"
          >
            Waiting for player...
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onLeave}
          className="px-6 py-3 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
        >
          Leave Room
        </motion.button>

        {isHost ? (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onStart}
            disabled={!canStart}
            className={`flex-1 py-3 rounded-lg font-semibold ${
              canStart
                ? 'bg-gradient-to-r from-green-600 to-emerald-600'
                : 'bg-slate-700 text-slate-500 cursor-not-allowed'
            }`}
          >
            {players.length < 2
              ? 'Waiting for Players...'
              : !allReady
              ? 'Waiting for Ready...'
              : 'Start Game'}
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onReady}
            className={`flex-1 py-3 rounded-lg font-semibold ${
              isReady
                ? 'bg-yellow-600 hover:bg-yellow-500'
                : 'bg-green-600 hover:bg-green-500'
            }`}
          >
            {isReady ? 'Cancel Ready' : 'Ready'}
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};
