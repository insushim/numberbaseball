import React from 'react';
import { motion } from 'framer-motion';

interface PlayerCardProps {
  username: string;
  rating: number;
  tier: string;
  avatarUrl?: string;
  isCurrentTurn?: boolean;
  isMe?: boolean;
  secret?: string;
  showSecret?: boolean;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({
  username,
  rating,
  tier,
  avatarUrl,
  isCurrentTurn = false,
  isMe = false,
  secret,
  showSecret = false,
}) => {
  const getTierColor = (tier: string): string => {
    if (tier.includes('Bronze')) return 'text-amber-600';
    if (tier.includes('Silver')) return 'text-slate-400';
    if (tier.includes('Gold')) return 'text-yellow-500';
    if (tier.includes('Platinum')) return 'text-cyan-400';
    if (tier.includes('Diamond')) return 'text-blue-400';
    if (tier.includes('Master')) return 'text-purple-400';
    if (tier.includes('Legend')) return 'text-red-500';
    return 'text-slate-400';
  };

  return (
    <motion.div
      className={`p-4 rounded-xl border transition-colors ${
        isCurrentTurn
          ? isMe
            ? 'bg-indigo-600/20 border-indigo-500'
            : 'bg-purple-600/20 border-purple-500'
          : 'bg-slate-800 border-slate-700'
      }`}
      animate={isCurrentTurn ? { boxShadow: ['0 0 0 0 rgba(99, 102, 241, 0)', '0 0 0 8px rgba(99, 102, 241, 0)'] } : {}}
      transition={isCurrentTurn ? { duration: 1.5, repeat: Infinity } : {}}
    >
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${
            isMe ? 'bg-indigo-600' : 'bg-purple-600'
          }`}
        >
          {avatarUrl ? (
            <img src={avatarUrl} alt={username} className="w-full h-full rounded-full object-cover" />
          ) : (
            username[0].toUpperCase()
          )}
        </div>

        {/* Info */}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium">{username}</span>
            {isMe && (
              <span className="text-xs px-1.5 py-0.5 bg-indigo-600/30 text-indigo-400 rounded">
                YOU
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className={getTierColor(tier)}>{tier}</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">{rating}</span>
          </div>
        </div>

        {/* Turn indicator */}
        {isCurrentTurn && (
          <motion.div
            className="w-3 h-3 rounded-full bg-green-500"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        )}
      </div>

      {/* Secret */}
      {secret && showSecret && (
        <div className="mt-3 pt-3 border-t border-slate-700">
          <div className="text-sm text-slate-400">
            Secret:{' '}
            <span className="font-mono text-indigo-400 tracking-widest">{secret}</span>
          </div>
        </div>
      )}
    </motion.div>
  );
};
