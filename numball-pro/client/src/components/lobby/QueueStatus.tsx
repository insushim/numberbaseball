import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GameMode } from '@numball/shared';

interface QueueStatusProps {
  mode: GameMode;
  startTime: number;
  onCancel: () => void;
}

const MODE_LABELS: Record<GameMode, string> = {
  [GameMode.CLASSIC_3]: '클래식 3자리',
  [GameMode.CLASSIC_4]: '클래식 4자리',
  [GameMode.CLASSIC_5]: '클래식 5자리',
  [GameMode.CLASSIC_6]: '클래식 6자리',
  [GameMode.SPEED_3]: '스피드 3자리',
  [GameMode.SPEED_4]: '스피드 4자리',
  [GameMode.BLITZ]: '블리츠',
  [GameMode.MARATHON]: '마라톤',
  [GameMode.DUPLICATE_3]: '중복 3자리',
  [GameMode.DUPLICATE_4]: '중복 4자리',
  [GameMode.REVERSE]: '리버스',
  [GameMode.TEAM]: '팀전',
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
            <h3 className="font-bold text-lg">상대를 찾는 중...</h3>
            <p className="text-slate-400 text-sm">
              모드: {MODE_LABELS[mode]} • 시간: {formatTime(elapsed)}
            </p>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onCancel}
          className="px-6 py-2 bg-red-600/20 border border-red-500 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors"
        >
          취소
        </motion.button>
      </div>

      {elapsed > 30 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 text-sm text-yellow-400"
        >
          평소보다 오래 걸리고 있습니다. 검색 범위를 넓히는 중...
        </motion.p>
      )}
    </motion.div>
  );
};
