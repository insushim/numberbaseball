import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ResultModalProps {
  isOpen: boolean;
  result: {
    type: 'WIN' | 'LOSE' | 'DRAW';
    reason: string;
    ratingChange: number;
    coinsEarned: number;
    expEarned: number;
    opponentSecret?: string;
  };
  onClose: () => void;
  onPlayAgain?: () => void;
}

export const ResultModal: React.FC<ResultModalProps> = ({
  isOpen,
  result,
  onClose,
  onPlayAgain,
}) => {
  const getResultData = () => {
    switch (result.type) {
      case 'WIN':
        return {
          icon: '🎉',
          title: '승리!',
          bgClass: 'from-green-600/20 to-emerald-600/20',
          borderClass: 'border-green-500',
        };
      case 'LOSE':
        return {
          icon: '😢',
          title: '패배',
          bgClass: 'from-red-600/20 to-rose-600/20',
          borderClass: 'border-red-500',
        };
      case 'DRAW':
        return {
          icon: '🤝',
          title: '무승부',
          bgClass: 'from-yellow-600/20 to-amber-600/20',
          borderClass: 'border-yellow-500',
        };
    }
  };

  const resultData = getResultData();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className={`bg-gradient-to-br ${resultData.bgClass} bg-slate-800 border ${resultData.borderClass} rounded-2xl p-8 w-full max-w-md text-center`}
          >
            {/* Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
              className="text-7xl mb-4"
            >
              {resultData.icon}
            </motion.div>

            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold mb-2"
            >
              {resultData.title}
            </motion.h2>

            {/* Reason */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-slate-400 mb-6"
            >
              {result.reason}
            </motion.p>

            {/* Opponent Secret */}
            {result.opponentSecret && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45 }}
                className="bg-slate-900/50 rounded-lg p-3 mb-6"
              >
                <span className="text-slate-400 text-sm">상대의 숫자: </span>
                <span className="font-mono text-xl text-purple-400 tracking-widest">
                  {result.opponentSecret}
                </span>
              </motion.div>
            )}

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-3 gap-4 mb-8"
            >
              <div className="bg-slate-900/50 rounded-lg p-3">
                <div
                  className={`text-xl font-bold ${
                    result.ratingChange >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  {result.ratingChange >= 0 ? '+' : ''}
                  {result.ratingChange}
                </div>
                <div className="text-xs text-slate-400">레이팅</div>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-3">
                <div className="text-xl font-bold text-yellow-400">+{result.coinsEarned}</div>
                <div className="text-xs text-slate-400">코인</div>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-3">
                <div className="text-xl font-bold text-purple-400">+{result.expEarned}</div>
                <div className="text-xs text-slate-400">경험치</div>
              </div>
            </motion.div>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex gap-3"
            >
              <button
                onClick={onClose}
                className="flex-1 py-3 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors font-medium"
              >
                로비로 돌아가기
              </button>
              {onPlayAgain && (
                <button
                  onClick={onPlayAgain}
                  className="flex-1 py-3 bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-colors font-medium"
                >
                  다시 하기
                </button>
              )}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
