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
  [GameMode.CLASSIC_3]: { name: '클래식 3자리', icon: '3️⃣' },
  [GameMode.CLASSIC_4]: { name: '클래식 4자리', icon: '4️⃣' },
  [GameMode.CLASSIC_5]: { name: '클래식 5자리', icon: '5️⃣' },
  [GameMode.CLASSIC_6]: { name: '클래식 6자리', icon: '6️⃣' },
  [GameMode.SPEED_3]: { name: '스피드 3자리', icon: '⚡' },
  [GameMode.SPEED_4]: { name: '스피드 4자리', icon: '⚡' },
  [GameMode.BLITZ]: { name: '블리츠', icon: '🔥' },
  [GameMode.MARATHON]: { name: '마라톤', icon: '🏃' },
  [GameMode.DUPLICATE_3]: { name: '중복 3자리', icon: '🔁' },
  [GameMode.DUPLICATE_4]: { name: '중복 4자리', icon: '🔁' },
  [GameMode.REVERSE]: { name: '리버스', icon: '🔄' },
  [GameMode.TEAM]: { name: '팀 2대2', icon: '👥' },
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
              <span>방 코드:</span>
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
          <div className="text-sm text-slate-400">플레이어</div>
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
                      방장
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
              {player.isHost ? '방장' : player.isReady ? '준비 완료' : '대기 중'}
            </div>
          </motion.div>
        ))}

        {/* Empty slots */}
        {Array.from({ length: maxPlayers - players.length }).map((_, i) => (
          <div
            key={`empty-${i}`}
            className="flex items-center justify-center p-3 rounded-xl border-2 border-dashed border-slate-700 text-slate-500"
          >
            플레이어 대기 중...
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
          나가기
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
              ? '플레이어 대기 중...'
              : !allReady
              ? '준비 대기 중...'
              : '게임 시작'}
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
            {isReady ? '준비 취소' : '준비'}
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};
