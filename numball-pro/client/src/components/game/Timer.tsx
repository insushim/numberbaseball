import React from 'react';
import { motion } from 'framer-motion';

interface TimerProps {
  timeLeft: number;
  maxTime: number;
  isMyTurn: boolean;
}

export const Timer: React.FC<TimerProps> = ({ timeLeft, maxTime, isMyTurn }) => {
  const percentage = (timeLeft / maxTime) * 100;
  const isLow = timeLeft <= 10;
  const isCritical = timeLeft <= 5;

  return (
    <div className="relative">
      {/* Background circle */}
      <svg className="w-20 h-20 transform -rotate-90">
        <circle
          cx="40"
          cy="40"
          r="36"
          stroke="currentColor"
          strokeWidth="6"
          fill="transparent"
          className="text-slate-700"
        />
        <motion.circle
          cx="40"
          cy="40"
          r="36"
          stroke="currentColor"
          strokeWidth="6"
          fill="transparent"
          strokeLinecap="round"
          strokeDasharray={226}
          strokeDashoffset={226 - (226 * percentage) / 100}
          className={
            isCritical
              ? 'text-red-500'
              : isLow
              ? 'text-yellow-500'
              : isMyTurn
              ? 'text-indigo-500'
              : 'text-slate-500'
          }
          animate={isCritical ? { opacity: [1, 0.5, 1] } : {}}
          transition={isCritical ? { duration: 0.5, repeat: Infinity } : {}}
        />
      </svg>

      {/* Time text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.span
          className={`text-2xl font-bold ${
            isCritical ? 'text-red-500' : isLow ? 'text-yellow-500' : 'text-white'
          }`}
          animate={isCritical ? { scale: [1, 1.1, 1] } : {}}
          transition={isCritical ? { duration: 0.5, repeat: Infinity } : {}}
        >
          {timeLeft}
        </motion.span>
      </div>
    </div>
  );
};
