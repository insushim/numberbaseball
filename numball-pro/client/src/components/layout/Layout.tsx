import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store';
import { logout } from '../../store/authSlice';
import { useSocket } from '../../hooks/useSocket';
import { motion } from 'framer-motion';

export const Layout: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const { isConnected } = useSocket();

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/lobby" className="flex items-center gap-2">
              <span className="text-2xl">🎯</span>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                넘볼 프로
              </span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <Link
                to="/lobby"
                className="text-slate-300 hover:text-white transition-colors"
              >
                로비
              </Link>
              <Link
                to="/practice"
                className="text-slate-300 hover:text-white transition-colors"
              >
                연습
              </Link>
            </nav>

            {/* User Info */}
            <div className="flex items-center gap-4">
              {/* Connection Status */}
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    isConnected ? 'bg-green-500' : 'bg-red-500'
                  }`}
                />
                <span className="text-xs text-slate-400">
                  {isConnected ? '접속 중' : '오프라인'}
                </span>
              </div>

              {/* Currency */}
              <div className="flex items-center gap-3 text-sm">
                <div className="flex items-center gap-1">
                  <span>🪙</span>
                  <span className="text-yellow-400">{user?.coins || 0}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>💎</span>
                  <span className="text-purple-400">{user?.gems || 0}</span>
                </div>
              </div>

              {/* User Profile */}
              <Link
                to="/profile"
                className="flex items-center gap-2 bg-slate-700 px-3 py-1.5 rounded-lg hover:bg-slate-600 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-bold">
                  {user?.username?.[0]?.toUpperCase() || '?'}
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium">{user?.username}</p>
                  <p className="text-xs text-slate-400">
                    {user?.tier} • {user?.rating}
                  </p>
                </div>
              </Link>

              {/* Logout */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-white transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm11 4.414l-4.293 4.293a1 1 0 01-1.414-1.414L11.586 7H6a1 1 0 110-2h5.586l-3.293-3.293a1 1 0 011.414-1.414L14 4.586V10a1 1 0 11-2 0V7.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
};
