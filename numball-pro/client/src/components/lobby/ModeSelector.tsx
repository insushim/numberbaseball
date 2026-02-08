import React from 'react';
import { motion } from 'framer-motion';
import { GameMode } from '@numball/shared';

interface ModeSelectorProps {
  selectedMode: GameMode;
  onSelect: (mode: GameMode) => void;
}

const MODES: { id: GameMode; name: string; description: string; icon: string }[] = [
  { id: GameMode.CLASSIC_3, name: '클래식 3자리', description: '3자리 클래식', icon: '3️⃣' },
  { id: GameMode.CLASSIC_4, name: '클래식 4자리', description: '4자리 클래식', icon: '4️⃣' },
  { id: GameMode.CLASSIC_5, name: '클래식 5자리', description: '5자리 도전', icon: '5️⃣' },
  { id: GameMode.CLASSIC_6, name: '클래식 6자리', description: '6자리 극한', icon: '6️⃣' },
  { id: GameMode.SPEED_3, name: '스피드', description: '10초 제한', icon: '⚡' },
  { id: GameMode.BLITZ, name: '블리츠', description: '5초 제한', icon: '🔥' },
  { id: GameMode.MARATHON, name: '마라톤', description: '장기 전략전', icon: '🏃' },
  { id: GameMode.DUPLICATE_3, name: '중복 허용', description: '숫자 중복 가능', icon: '🔁' },
  { id: GameMode.REVERSE, name: '리버스', description: '내 숫자 맞추기', icon: '🔄' },
  { id: GameMode.TEAM, name: '팀 2대2', description: '팀 대전', icon: '👥' },
];

export const ModeSelector: React.FC<ModeSelectorProps> = ({ selectedMode, onSelect }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
      {MODES.map((mode) => (
        <motion.button
          key={mode.id}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect(mode.id)}
          className={`p-3 rounded-xl border text-left transition-colors ${
            selectedMode === mode.id
              ? 'bg-indigo-600/20 border-indigo-500'
              : 'bg-slate-800 border-slate-700 hover:border-slate-600'
          }`}
        >
          <div className="text-xl mb-1">{mode.icon}</div>
          <div className="font-medium text-sm">{mode.name}</div>
          <div className="text-xs text-slate-400 hidden md:block">{mode.description}</div>
        </motion.button>
      ))}
    </div>
  );
};
