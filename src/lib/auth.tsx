import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { authApi, setToken, clearToken } from './api';
import { AuthState, User, UserRole } from './types';

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

    const handleLogout = useCallback(async () => {
        try {
            // Only call API logout if we have a token
            const hasToken = localStorage.getItem('token');
            if (hasToken) {
                await authApi.logout();
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            clearToken();
            localStorage.removeItem('user');
            setState({
                user: null,
                token: null,
                isAuthenticated: false,
                isLoading: false,
            });

            // Only redirect if not already on login page
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
    }, []);

    const loadUser = useCallback(async () => {
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
                // Only logout if we get a clear failure from server
                console.log('Profile fetch failed, user might be logged out');
                handleLogout();
            }
        } catch (error: any) {
            // Check if it's a network error vs authentication error
            if (error.response?.status === 401) {
                // Clear authentication - token is invalid
                console.log('Authentication failed, logging out');
                handleLogout();
            } else {
                // Network error or server issue - keep user logged in but mark as not loading
                console.log('Network error while fetching profile, keeping user logged in');
                setState(prev => ({ ...prev, isLoading: false }));
            }
        }
    }, [handleLogout]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (token) {
            setToken(token);

            // If we have stored user data, use it immediately while verifying with server
            if (storedUser) {
                try {
                    const user = JSON.parse(storedUser);
                    setState({
                        user,
                        token,
                        isAuthenticated: true,
                        isLoading: false,
                    });
                    console.log('Loaded user from localStorage:', user);

                    // Skip background verification to prevent logout loops
                    console.log('User loaded from localStorage, skipping server verification');
                } catch (error) {
                    console.error('Error parsing stored user:', error);
                    // Clear invalid stored data and load fresh
                    localStorage.removeItem('user');
                    loadUser();
                }
            } else {
                // Have token but no user data - don't fetch to avoid logout loop
                console.log('Token exists but no user data, staying logged in');
                setState(prev => ({ ...prev, isLoading: false }));
            }
        } else {
            // No token - user is not logged in
            setState(prev => ({ ...prev, isLoading: false }));
        }
    }, [loadUser]);

    const login = async (email: string, password: string) => {
        try {
            const response = await authApi.login({ email, password });
            console.log('Login response:', response);

            if (response.success && response.data) {
                // Extract user data from the response
                const userData = response.data;

                const user: User = {
                    uuid: userData._id, // Use _id from backend
                    id: userData._id,
                    userID: userData.userID,
                    email: userData.email,
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    phone: undefined, // Not in backend response
                    address: userData.address,
                    dob: undefined, // Not in backend response
                    gender: undefined, // Not in backend response
                    bloodGroup: undefined, // Not in backend response
                    role: userData.role as UserRole,
                    profileImage: undefined, // Not in backend response
                    accessToken: userData.token // Use token from backend
                };

                console.log('User data processed:', user);

                // Use token from backend response
                const token = userData.token;

                setToken(token);
                setState({
                    user,
                    token,
                    isAuthenticated: true,
                    isLoading: false,
                });

                // Store user in localStorage for persistence
                if (typeof window !== 'undefined') {
                    localStorage.setItem('user', JSON.stringify(user));
                    (window as unknown as { __authUser: User }).__authUser = user;
                }
                return true;
            }
            return false;
        } catch (error: unknown) {
            console.error('Login error:', error);
            const errorMessage = error instanceof Error ? error.message : 'Login failed';
            throw new Error(errorMessage);
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