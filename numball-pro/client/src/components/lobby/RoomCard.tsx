import React from 'react';
import { motion } from 'framer-motion';
import type { GameMode } from '@numball/shared';

interface RoomCardProps {
  code: string;
  mode: GameMode;
  playerCount: number;
  maxPlayers: number;
  hostName: string;
  onJoin: () => void;
}

const MODE_LABELS: Record<GameMode, { name: string; icon: string }> = {
  CLASSIC_3: { name: 'Classic 3', icon: '3️⃣' },
  CLASSIC_4: { name: 'Classic 4', icon: '4️⃣' },
  CLASSIC_5: { name: 'Classic 5', icon: '5️⃣' },
  CLASSIC_6: { name: 'Classic 6', icon: '6️⃣' },
  SPEED: { name: 'Speed', icon: '⚡' },
  BLITZ: { name: 'Blitz', icon: '🔥' },
  MARATHON: { name: 'Marathon', icon: '🏃' },
  DUPLICATE: { name: 'Duplicate', icon: '🔁' },
  REVERSE: { name: 'Reverse', icon: '🔄' },
  TEAM_2V2: { name: 'Team 2v2', icon: '👥' },
};

export const RoomCard: React.FC<RoomCardProps> = ({
  code,
  mode,
  playerCount,
  maxPlayers,
  hostName,
  onJoin,
}) => {
  const modeInfo = MODE_LABELS[mode] || { name: mode, icon: '🎮' };
  const isFull = playerCount >= maxPlayers;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-slate-800 border border-slate-700 rounded-xl p-4 hover:border-slate-600 transition-colors"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{modeInfo.icon}</span>
          <div>
            <div className="font-medium">{modeInfo.name}</div>
            <div className="text-xs text-slate-400">Host: {hostName}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="font-mono text-sm text-indigo-400">{code}</div>
          <div className={`text-xs ${isFull ? 'text-red-400' : 'text-green-400'}`}>
            {playerCount}/{maxPlayers} players
          </div>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onJoin}
        disabled={isFull}
        className={`w-full py-2 rounded-lg font-medium transition-colors ${
          isFull
            ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
            : 'bg-indigo-600 hover:bg-indigo-500'
        }`}
      >
        {isFull ? 'Full' : 'Join Room'}
      </motion.button>
    </motion.div>
  );
};
