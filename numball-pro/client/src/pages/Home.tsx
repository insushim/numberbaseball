import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 0.8 }}
            className="text-8xl mb-6"
          >
            🎯
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold mb-4"
          >
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              NumBall Pro
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto"
          >
            Ultimate Number Baseball Experience. Challenge players worldwide in real-time
            competitive matches with ELO ranking system.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/register">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl font-semibold text-lg shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-shadow"
              >
                Start Playing
              </motion.button>
            </Link>
            <Link to="/login">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-slate-800 border border-slate-700 rounded-xl font-semibold text-lg hover:bg-slate-700 transition-colors"
              >
                Sign In
              </motion.button>
            </Link>
          </motion.div>
        </div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="grid md:grid-cols-3 gap-8 mt-20"
        >
          <FeatureCard
            icon="🎮"
            title="12 Game Modes"
            description="Classic, Speed, Blitz, Marathon, Reverse, Team and more unique game modes"
          />
          <FeatureCard
            icon="🏆"
            title="Ranked Matches"
            description="Compete in ELO-based ranked matches and climb through 28 tiers"
          />
          <FeatureCard
            icon="⚡"
            title="Real-time Battles"
            description="Experience seamless real-time gameplay with instant feedback"
          />
        </motion.div>

        {/* Tiers Preview */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-20 text-center"
        >
          <h2 className="text-2xl font-bold mb-6 text-slate-300">Ranking Tiers</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Master', 'Legend'].map(
              (tier, i) => (
                <motion.div
                  key={tier}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + i * 0.1 }}
                  className={`px-4 py-2 rounded-lg font-medium ${getTierColor(tier)}`}
                >
                  {tier}
                </motion.div>
              )
            )}
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-6">
        <div className="container mx-auto px-4 text-center text-slate-500 text-sm">
          <p>© 2024 NumBall Pro. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard: React.FC<{ icon: string; title: string; description: string }> = ({
  icon,
  title,
  description,
}) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 text-center"
  >
    <div className="text-4xl mb-4">{icon}</div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-slate-400">{description}</p>
  </motion.div>
);

const getTierColor = (tier: string): string => {
  const colors: Record<string, string> = {
    Bronze: 'bg-amber-900/50 text-amber-400 border border-amber-700',
    Silver: 'bg-slate-600/50 text-slate-300 border border-slate-500',
    Gold: 'bg-yellow-900/50 text-yellow-400 border border-yellow-700',
    Platinum: 'bg-cyan-900/50 text-cyan-400 border border-cyan-700',
    Diamond: 'bg-blue-900/50 text-blue-400 border border-blue-700',
    Master: 'bg-purple-900/50 text-purple-400 border border-purple-700',
    Legend: 'bg-gradient-to-r from-amber-500 to-red-500 text-white',
  };
  return colors[tier] || 'bg-slate-700';
};

export default Home;
