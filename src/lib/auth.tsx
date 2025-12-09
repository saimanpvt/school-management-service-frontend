import React, { createContext, useContext, useEffect, useState } from 'react';
import { authApi } from '../services/authApi';
import LoadingDots from '../components/LoadingDots/LoadingDots';

// Auth context
const AuthContext = createContext<{
  user: any;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
} | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const isAuthenticated = !!user;

  // Check if user is logged in on app start
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // Login
  const login = async (email: string, password: string) => {
    const response = await authApi.login({ email, password });

    if (response.success) {
      const userData = response.data;
      const token = userData.token;

      // Set token in API headers
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));

      // Set Authorization header for future requests
      if (typeof window !== 'undefined') {
        const api = (await import('../services/api')).api;
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }

      setUser(userData);
      return true;
    }
    return false;
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, login, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use auth
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
// Simple route protection
export function ProtectedRoute({
  children,
  roles,
}: {
  children: React.ReactNode;
  roles?: string[];
}) {
  const { user, loading } = useAuth();
  if (loading)
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '200px',
        }}
      >
        <LoadingDots />
      </div>
    );
  if (!user) {
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
    return null;
  }
  if (roles && !roles.includes(user.role)) {
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
    return null;
  }

  return <>{children}</>;
}
