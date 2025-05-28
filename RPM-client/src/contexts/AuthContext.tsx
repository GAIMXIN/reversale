import React, { createContext, useContext, useState } from 'react';

interface User {
  id: string;
  email: string;
  userType: 'test' | 'salesman';
  name?: string;
  selectedField?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateSelectedField: (field: string) => void;
  register: (data: {
    email: string;
    password: string;
    phoneNumber: string;
    hasCompany: string;
    companyName?: string;
    address?: string;
    goals: string[];
    interests: string[];
  }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // 暂时设置为false，让应用从未登录状态开始
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  const login = (token: string, userData: User) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateSelectedField = (field: string) => {
    if (user) {
      const updatedUser = { ...user, selectedField: field };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const register = async (data: {
    email: string;
    password: string;
    phoneNumber: string;
    hasCompany: string;
    companyName?: string;
    address?: string;
    goals: string[];
    interests: string[];
  }) => {
    try {
      // TODO: 实现注册逻辑，调用后端 API
      console.log('Register:', data);
      // const response = await api.post('/auth/register', data);
      // if (response.data.token) {
      //   login(response.data.token);
      // }
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      login, 
      logout, 
      updateSelectedField, 
      register 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 