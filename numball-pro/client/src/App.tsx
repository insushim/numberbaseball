import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './store';
import { checkAuth } from './store/authSlice';
import { useSocket } from './hooks/useSocket';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Lobby from './pages/Lobby';
import Game from './pages/Game';
import Practice from './pages/Practice';
import Profile from './pages/Profile';

// Components
import { Layout } from './components/layout/Layout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Loading } from './components/common/Loading';

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isLoading, isAuthenticated } = useAppSelector((state) => state.auth);
  const { connect, disconnect } = useSocket();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      connect();
    } else {
      disconnect();
    }
  }, [isAuthenticated, connect, disconnect]);

  if (isLoading) {
    return <Loading fullScreen message="Loading..." />;
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={isAuthenticated ? <Navigate to="/lobby" /> : <Login />} />
      <Route path="/register" element={isAuthenticated ? <Navigate to="/lobby" /> : <Register />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/lobby" element={<Lobby />} />
          <Route path="/game/:gameId" element={<Game />} />
          <Route path="/practice" element={<Practice />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>

      {/* 404 */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default App;
