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
              넘볼 프로
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto"
          >
            최고의 숫자야구 경험. 전 세계 플레이어와 실시간 대전을 즐기고
            ELO 랭킹 시스템으로 실력을 증명하세요.
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
                지금 시작하기
              </motion.button>
            </Link>
            <Link to="/login">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-slate-800 border border-slate-700 rounded-xl font-semibold text-lg hover:bg-slate-700 transition-colors"
              >
                로그인
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
            title="12가지 게임 모드"
            description="클래식, 스피드, 번개전, 마라톤, 역전, 팀전 등 다양한 게임 모드"
          />
          <FeatureCard
            icon="🏆"
            title="랭크 매치"
            description="ELO 기반 랭크 매치로 28개 티어를 정복하세요"
          />
          <FeatureCard
            icon="⚡"
            title="실시간 대전"
            description="즉각적인 피드백으로 끊김 없는 실시간 대전을 경험하세요"
          />
        </motion.div>

        {/* Tiers Preview */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-20 text-center"
        >
          <h2 className="text-2xl font-bold mb-6 text-slate-300">랭킹 티어</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { en: 'Bronze', ko: '브론즈' },
              { en: 'Silver', ko: '실버' },
              { en: 'Gold', ko: '골드' },
              { en: 'Platinum', ko: '플래티넘' },
              { en: 'Diamond', ko: '다이아몬드' },
              { en: 'Master', ko: '마스터' },
              { en: 'Legend', ko: '레전드' },
            ].map((tier, i) => (
                <motion.div
                  key={tier.en}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + i * 0.1 }}
                  className={`px-4 py-2 rounded-lg font-medium ${getTierColor(tier.en)}`}
                >
                  {tier.ko}
                </motion.div>
              )
            )}
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-6">
        <div className="container mx-auto px-4 text-center text-slate-500 text-sm">
          <p>&copy; 2024 넘볼 프로. All rights reserved.</p>
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
