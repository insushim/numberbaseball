import React from 'react';
import { motion } from 'framer-motion';
import { GameMode } from '@numball/shared';

interface ModeSelectorProps {
  selectedMode: GameMode;
  onSelect: (mode: GameMode) => void;
}

const MODES: { id: GameMode; name: string; description: string; icon: string }[] = [
  { id: GameMode.CLASSIC_3, name: 'Classic 3', description: '3 digit classic', icon: '3️⃣' },
  { id: GameMode.CLASSIC_4, name: 'Classic 4', description: '4 digit classic', icon: '4️⃣' },
  { id: GameMode.CLASSIC_5, name: 'Classic 5', description: '5 digit challenge', icon: '5️⃣' },
  { id: GameMode.CLASSIC_6, name: 'Classic 6', description: '6 digit extreme', icon: '6️⃣' },
  { id: GameMode.SPEED_3, name: 'Speed', description: '10 second turns', icon: '⚡' },
  { id: GameMode.BLITZ, name: 'Blitz', description: '5 second turns', icon: '🔥' },
  { id: GameMode.MARATHON, name: 'Marathon', description: 'Long strategic games', icon: '🏃' },
  { id: GameMode.DUPLICATE_3, name: 'Duplicate', description: 'Duplicates allowed', icon: '🔁' },
  { id: GameMode.REVERSE, name: 'Reverse', description: 'Guess your own number', icon: '🔄' },
  { id: GameMode.TEAM, name: 'Team 2v2', description: 'Team battle', icon: '👥' },
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
