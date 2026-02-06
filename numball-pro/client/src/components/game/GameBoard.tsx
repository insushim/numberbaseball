import React from 'react';
import { motion } from 'framer-motion';
import type { GuessResult } from '@numball/shared';

interface GameBoardProps {
  guesses: GuessResult[];
  digitCount: number;
  title: string;
  isOpponent?: boolean;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  guesses,
  digitCount,
  title,
  isOpponent = false,
}) => {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4">
      <h3 className="font-bold mb-3 flex items-center gap-2">
        <span>{isOpponent ? '👤' : '🎯'}</span>
        {title}
      </h3>
      <div className="space-y-2 max-h-72 overflow-y-auto">
        {guesses.length === 0 ? (
          <p className="text-slate-500 text-sm text-center py-4">No guesses yet</p>
        ) : (
          guesses.map((guess, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: isOpponent ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`flex items-center justify-between p-3 rounded-lg ${
                guess.strikes === digitCount
                  ? 'bg-green-600/30 border border-green-500'
                  : 'bg-slate-700/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-slate-500 text-sm w-6">#{i + 1}</span>
                <div className="flex gap-1">
                  {guess.guess.split('').map((digit, j) => (
                    <span
                      key={j}
                      className="w-8 h-10 bg-slate-900 rounded flex items-center justify-center font-mono text-lg"
                    >
                      {digit}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <span className="text-green-400 font-bold text-lg">{guess.strikes}</span>
                  <span className="text-green-400 text-sm">S</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-yellow-400 font-bold text-lg">{guess.balls}</span>
                  <span className="text-yellow-400 text-sm">B</span>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};
