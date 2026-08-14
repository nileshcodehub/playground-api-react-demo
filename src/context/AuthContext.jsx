import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '@/api/auth';

const AuthContext = createContext(null);

const STORAGE_KEYS = {
  ACCESS_TOKEN: 'playground_access_token',
  REFRESH_TOKEN: 'playground_refresh_token',
  USER: 'playground_auth_user',
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [accessToken, setAccessToken] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN) || null;
  });

  const [refreshToken, setRefreshToken] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN) || null;
  });

  const [loading, setLoading] = useState(true);

  // Synchronize state to localStorage
  const persistSession = useCallback((token, refresh, userData) => {
    if (token) {
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
      setAccessToken(token);
    }
    if (refresh) {
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refresh);
      setRefreshToken(refresh);
    }
    if (userData) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
      setUser(userData);
    }
  }, []);

  const clearSession = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
  }, []);

  // Validate active token on initial load
  useEffect(() => {
    let active = true;

    const validateSession = async () => {
      const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      if (!token) {
        if (active) setLoading(false);
        return;
      }

      try {
        const data = await authApi.getMe(token);
        if (active && data.user) {
          setUser(data.user);
          localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.user));
        }
      } catch {
        // Token expired or invalid
        const storedRefresh = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
        if (storedRefresh) {
          try {
            const refreshData = await authApi.refreshToken(storedRefresh);
            if (active && refreshData.access_token) {
              setAccessToken(refreshData.access_token);
              localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, refreshData.access_token);
            }
          } catch {
            if (active) clearSession();
          }
        } else {
          if (active) clearSession();
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    validateSession();
    return () => {
      active = false;
    };
  }, [clearSession]);

  const login = async (credentials) => {
    const data = await authApi.login(credentials);
    persistSession(data.access_token, data.refresh_token, data.user);
    return data;
  };

  const register = async (userData) => {
    const data = await authApi.register(userData);
    persistSession(data.access_token, data.refresh_token, data.user);
    return data;
  };

  const logout = () => {
    clearSession();
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
  };

  const value = {
    user,
    accessToken,
    refreshToken,
    isAuthenticated: Boolean(user && accessToken),
    loading,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
