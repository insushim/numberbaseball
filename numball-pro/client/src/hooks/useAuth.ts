import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store';
import { login, register, logout, checkAuth } from '../store/authSlice';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const auth = useAppSelector((state) => state.auth);

  const handleLogin = useCallback(
    async (email: string, password: string) => {
      const result = await dispatch(login({ email, password }));
      if (login.fulfilled.match(result)) {
        navigate('/lobby');
        return true;
      }
      return false;
    },
    [dispatch, navigate]
  );

  const handleRegister = useCallback(
    async (email: string, username: string, password: string) => {
      const result = await dispatch(register({ email, username, password }));
      if (register.fulfilled.match(result)) {
        navigate('/lobby');
        return true;
      }
      return false;
    },
    [dispatch, navigate]
  );

  const handleLogout = useCallback(async () => {
    await dispatch(logout());
    navigate('/');
  }, [dispatch, navigate]);

  const refreshAuth = useCallback(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return {
    ...auth,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    refreshAuth,
  };
};
