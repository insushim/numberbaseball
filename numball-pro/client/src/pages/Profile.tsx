import React from 'react';
import { motion } from 'framer-motion';
import { useAppSelector } from '../store';

const Profile: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);

  if (!user) return null;

  const winRate = user.gamesPlayed > 0 ? (user.gamesWon / user.gamesPlayed) * 100 : 0;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 rounded-2xl p-8 mb-8"
      >
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-indigo-600 flex items-center justify-center text-4xl font-bold">
            {user.username[0].toUpperCase()}
          </div>
          <div>
            <h1 className="text-3xl font-bold">{user.username}</h1>
            <p className="text-slate-400">{user.email}</p>
            <div className="flex items-center gap-4 mt-2">
              <span className="px-3 py-1 bg-indigo-600/30 border border-indigo-500/50 rounded-full text-sm">
                {user.tier}
              </span>
              <span className="text-slate-400">Level {user.level}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
      >
        <StatCard label="Rating" value={user.rating.toString()} icon="📊" />
        <StatCard label="Games Played" value={user.gamesPlayed.toString()} icon="🎮" />
        <StatCard label="Wins" value={user.gamesWon.toString()} icon="🏆" />
        <StatCard label="Win Rate" value={`${winRate.toFixed(1)}%`} icon="📈" />
      </motion.div>

      {/* Currency */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-slate-800 border border-slate-700 rounded-2xl p-6 mb-8"
      >
        <h2 className="text-xl font-bold mb-4">Currency</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-700/50 rounded-xl p-4 flex items-center gap-4">
            <span className="text-4xl">🪙</span>
            <div>
              <p className="text-2xl font-bold text-yellow-400">{user.coins.toLocaleString()}</p>
              <p className="text-sm text-slate-400">Coins</p>
            </div>
          </div>
          <div className="bg-slate-700/50 rounded-xl p-4 flex items-center gap-4">
            <span className="text-4xl">💎</span>
            <div>
              <p className="text-2xl font-bold text-purple-400">{user.gems.toLocaleString()}</p>
              <p className="text-sm text-slate-400">Gems</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Rating History Placeholder */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-slate-800 border border-slate-700 rounded-2xl p-6"
      >
        <h2 className="text-xl font-bold mb-4">Rating History</h2>
        <div className="h-48 flex items-center justify-center text-slate-500">
          <p>Rating chart will be displayed here</p>
        </div>
      </motion.div>
    </div>
  );
};

const StatCard: React.FC<{ label: string; value: string; icon: string }> = ({
  label,
  value,
  icon,
}) => (
  <motion.div
    whileHover={{ y: -2 }}
    className="bg-slate-800 border border-slate-700 rounded-xl p-4 text-center"
  >
    <div className="text-2xl mb-2">{icon}</div>
    <div className="text-2xl font-bold">{value}</div>
    <div className="text-sm text-slate-400">{label}</div>
  </motion.div>
);

export default Profile;
