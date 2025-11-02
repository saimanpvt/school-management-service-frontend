import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { authApi, setToken, clearToken } from './api';
import { AuthState, User } from './types';

interface AuthContextType extends AuthState {
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => Promise<void>;
    updateUser: (user: User) => void;
}

const initialState: AuthState = {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [state, setState] = useState<AuthState>(initialState);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setToken(token);
            loadUser();
        } else {
            setState(prev => ({ ...prev, isLoading: false }));
        }
    }, []);

    const loadUser = async () => {
        try {
            const response = await authApi.getProfile();
            if (response.success && response.data) {
                setState({
                    user: response.data,
                    token: localStorage.getItem('token'),
                    isAuthenticated: true,
                    isLoading: false,
                });
            } else {
                handleLogout();
            }
        } catch {
            handleLogout();
        }
    };

    const login = async (email: string, password: string) => {
        try {
            const response = await authApi.login({ email, password });
            if (response.success && response.data) {
                const { token, user } = response.data;
                setToken(token);
                setState({
                    user,
                    token,
                    isAuthenticated: true,
                    isLoading: false,
                });
                // Store user in window for immediate access
                if (typeof window !== 'undefined') {
                    (window as any).__authUser = user;
                }
                return true;
            }
            return false;
        } catch (error: any) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const handleLogout = async () => {
        try {
            await authApi.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            clearToken();
            setState(initialState);
            const routerInstance = router as any;
            routerInstance?.push('/login');
        }
    };

    const updateUser = (user: User) => {
        setState(prev => ({ ...prev, user }));
    };

    return (
        <AuthContext.Provider value={{ ...state, login, logout: handleLogout, updateUser }}>
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