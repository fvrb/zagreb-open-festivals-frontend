import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { notifications } from '@mantine/notifications';
import { authService } from '../services/authService';
import { clearAuth, readAuth, saveAuth } from '../services/tokenStorage';
import type { AuthResponse, CurrentUser } from '../types';
import { getErrorMessage } from '../utils/format';

interface AuthContextValue {
  auth: AuthResponse | null;
  user: CurrentUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  reloadUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthResponse | null>(() => readAuth());
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);

  const reloadUser = useCallback(async () => {
    if (!readAuth()) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const currentUser = await authService.me();
      setUser(currentUser);
    } catch {
      clearAuth();
      setAuth(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reloadUser();

    const onExpired = () => {
      setAuth(null);
      setUser(null);
      notifications.show({
        color: 'red',
        title: 'Sesija je istekla',
        message: 'Prijavi se ponovno za nastavak rada.',
      });
    };

    window.addEventListener('zof:auth-expired', onExpired);
    return () => window.removeEventListener('zof:auth-expired', onExpired);
  }, [reloadUser]);

  const login = useCallback(async (username: string, password: string) => {
    try {
      const authResponse = await authService.login({ username, password });
      saveAuth(authResponse);
      setAuth(authResponse);
      const currentUser = await authService.me();
      setUser(currentUser);
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }, []);

  const register = useCallback(async (username: string, email: string, password: string) => {
    try {
      await authService.register({ username, email, password });
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setAuth(null);
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      auth,
      user,
      loading,
      isAuthenticated: Boolean(auth),
      isAdmin: user?.role === 'ROLE_ADMIN' || auth?.role === 'ROLE_ADMIN',
      login,
      register,
      logout,
      reloadUser,
    }),
    [auth, loading, login, logout, register, reloadUser, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}
