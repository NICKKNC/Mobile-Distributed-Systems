import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { api } from '@/app/api';

const TOKEN_KEY = 'auth_token';
const USER_KEY  = 'auth_user';

interface AuthUser {
  userId: number;
  name: string;
  email: string;
}

interface AuthContextType {
  token: string | null;
  user: AuthUser | null;
  login: (token: string, userId: number, name: string, email: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  user: null,
  login: async () => {},
  logout: async () => {},
  isAuthenticated: false,
  isLoading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser]   = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const restore = async () => {
      try {
        const savedToken = await SecureStore.getItemAsync(TOKEN_KEY);
        const savedUser  = await SecureStore.getItemAsync(USER_KEY);
        if (savedToken && savedUser) {
          const parsedUser: AuthUser = JSON.parse(savedUser);
          setToken(savedToken);
          setUser(parsedUser);
          api.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
        }
      } catch {
        // αν αποτύχει η ανάκτηση, ο χρήστης συνδέεται ξανά
      } finally {
        setIsLoading(false);
      }
    };
    restore();
  }, []);

  const login = async (newToken: string, userId: number, name: string, email: string) => {
    const newUser: AuthUser = { userId, name, email };
    setToken(newToken);
    setUser(newUser);
    api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    await SecureStore.setItemAsync(TOKEN_KEY, newToken);
    await SecureStore.setItemAsync(USER_KEY, JSON.stringify(newUser));
  };

  const logout = async () => {
    setToken(null);
    setUser(null);
    delete api.defaults.headers.common['Authorization'];
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(USER_KEY);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isAuthenticated: !!token, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
