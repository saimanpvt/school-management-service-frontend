import { makeHttpRequest, httpClient } from '../lib/httpClient';
import { ApiResponse } from '../lib/types';

interface LoginCredentials {
  email: string;
  password: string;
}

// Authentication API calls
export const authApi = {
  login: async (
    credentials: LoginCredentials
  ): Promise<
    ApiResponse<{
      _id: string;
      email: string;
      userID: string;
      firstName: string;
      lastName: string;
      address: Record<string, unknown>;
      role: string;
      token: string;
    }>
  > => {
    return await makeHttpRequest('post', '/auth/login', credentials);
  },

  register: async (data: {
    firstName: string;
    email: string;
    password: string;
    role: string;
  }): Promise<ApiResponse<{ token: string; user: object }>> => {
    return await makeHttpRequest('post', '/auth/register', data);
  },

  logout: async (): Promise<ApiResponse<object>> => {
    return await makeHttpRequest('post', '/logout');
  },

  changePassword: async (data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<ApiResponse<object>> => {
    return await makeHttpRequest('post', '/auth/change-password', data);
  },
};

// Token management utilities
export const setToken = (token: string) => {
  localStorage.setItem('token', token);
  httpClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export const clearToken = () => {
  localStorage.removeItem('token');
  delete httpClient.defaults.headers.common['Authorization'];
};
