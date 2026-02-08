import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GameMode } from '@numball/shared';

interface QueueStatusProps {
  mode: GameMode;
  startTime: number;
  onCancel: () => void;
}

const MODE_LABELS: Record<GameMode, string> = {
  [GameMode.CLASSIC_3]: 'Classic 3',
  [GameMode.CLASSIC_4]: 'Classic 4',
  [GameMode.CLASSIC_5]: 'Classic 5',
  [GameMode.CLASSIC_6]: 'Classic 6',
  [GameMode.SPEED_3]: 'Speed 3',
  [GameMode.SPEED_4]: 'Speed 4',
  [GameMode.BLITZ]: 'Blitz',
  [GameMode.MARATHON]: 'Marathon',
  [GameMode.DUPLICATE_3]: 'Duplicate 3',
  [GameMode.DUPLICATE_4]: 'Duplicate 4',
  [GameMode.REVERSE]: 'Reverse',
  [GameMode.TEAM]: 'Team',
};

export const QueueStatus: React.FC<QueueStatusProps> = ({ mode, startTime, onCancel }) => {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-indigo-600/20 border border-indigo-500 rounded-2xl p-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <motion.div
            className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          <div>
            <h3 className="font-bold text-lg">Searching for Opponent...</h3>
            <p className="text-slate-400 text-sm">
              Mode: {MODE_LABELS[mode]} • Time: {formatTime(elapsed)}
            </p>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onCancel}
          className="px-6 py-2 bg-red-600/20 border border-red-500 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors"
        >
          Cancel
        </motion.button>
      </div>

      {elapsed > 30 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 text-sm text-yellow-400"
        >
          Taking longer than usual. Expanding search range...
        </motion.p>
      )}
    </motion.div>
  );
};
