import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { authService } from '../services/apiServices';

interface AuthContextType {
  user: User;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, role?: UserRole) => Promise<void>;
  register: (data: Partial<User>) => Promise<User>;
  logout: () => void;
  switchDemoRole: (role: UserRole) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(() => authService.getCurrentUser());
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('safestay_token') || 'demo_token');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    // Keep user updated
    const cur = authService.getCurrentUser();
    if (cur) setUser(cur);
  }, []);

  const login = async (email: string, role?: UserRole) => {
    setIsLoading(true);
    try {
      const res = await authService.login(email, role);
      setUser(res.user);
      setToken(res.token);
      localStorage.setItem('safestay_token', res.token);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: Partial<User>) => {
    setIsLoading(true);
    try {
      const newUser = await authService.register(data);
      return newUser;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setToken(null);
  };

  const switchDemoRole = async (role: UserRole) => {
    setIsLoading(true);
    try {
      const newUser = await authService.switchDemoRole(role);
      setUser(newUser);
      setToken(`safestay_demo_${newUser.role}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        login,
        register,
        logout,
        switchDemoRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
