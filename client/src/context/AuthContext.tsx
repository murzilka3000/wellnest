"use client";

import {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import api from "@/lib/axios"; // Используем наш настроенный axios

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
      try {
        if (IS_DEV_MODE) {
          console.warn(
            "--- RUNNING IN DEV MODE: Attempting to get dev token ---"
          );
          // В режиме разработки делаем запрос на специальный эндпоинт
          const response = await api.get("/auth/dev-login");
          login(response.data.access_token);
          console.log("Dev token received and set!");
        } else {
          // Логика для реальной авторизации остается здесь
          const storedToken = localStorage.getItem("token");
          if (storedToken) {
            setToken(storedToken);
            return;
          }
          const tg = window.Telegram?.WebApp;
          if (tg && tg.initData) {
            const response = await api.post("/auth/telegram", {
              initData: tg.initData,
            });
            login(response.data.access_token);
          }
        }
      } catch (error) {
        console.error("Authentication failed during initialization", error);
      } finally {
        setIsLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = (newToken: string) => {
    setToken(newToken);
    localStorage.setItem("token", newToken); // Сохраняем токен в localStorage в любом режиме
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem("token");
  };

  const value = { token, isLoading, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
