import React, { createContext, useContext, useState } from 'react';
import { api } from '@/app/api';

interface AuthUser {
  userId: number;
  name: string;
  email: string;
}

interface AuthContextType {
  token: string | null;
  user: AuthUser | null;
  login: (token: string, userId: number, name: string, email: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  user: null,
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);

  const login = (newToken: string, userId: number, name: string, email: string) => {
    setToken(newToken);
    setUser({ userId, name, email });
    api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    delete api.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
