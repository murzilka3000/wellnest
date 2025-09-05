'use client';

import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import api from '@/lib/axios'; // <-- ИЗМЕНЕНИЕ: Импортируем наш кастомный `api`

const IS_DEV_MODE = true; 

// ... (интерфейсы и createContext без изменений) ...
interface AuthContextType {
    token: string | null;
    isLoading: boolean;
    login: (token: string) => void;
    logout: () => void;
  }
  
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (IS_DEV_MODE) {
        const fakeToken = 'DEV_MODE_FAKE_TOKEN.user_id_123.signature';
        console.warn('--- RUNNING IN DEV MODE: FAKE AUTH ENABLED ---');
        setToken(fakeToken);
        setIsLoading(false);
        return;
      }

      try {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
          setToken(storedToken);
          return;
        }
        
        const tg = window.Telegram?.WebApp;
        if (tg && tg.initData) {
          // <-- ИЗМЕНЕНИЕ: Используем `api.post` вместо `axios.post`
          const response = await api.post('/auth/telegram', {
            initData: tg.initData
          });
          login(response.data.access_token);
        }
      } catch (error) {
        console.error('Authentication failed during initialization', error);
      } finally {
        setIsLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = (newToken: string) => {
    setToken(newToken);
    if (!IS_DEV_MODE) {
      localStorage.setItem('token', newToken);
    }
  };

  const logout = () => {
    setToken(null);
    if (!IS_DEV_MODE) {
      localStorage.removeItem('token');
    }
  };

  const value = { token, isLoading, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
      throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
  };