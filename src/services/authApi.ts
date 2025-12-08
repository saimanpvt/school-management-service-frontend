import { api } from './api';

interface LoginCredentials {
  email: string;
  password: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
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
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  register: async (data: {
    firstName: string;
    email: string;
    password: string;
    role: string;
  }): Promise<ApiResponse<{ token: string; user: object }>> => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  logout: async (): Promise<ApiResponse<object>> => {
    const response = await api.post('/logout');
    return response.data;
  },

  changePassword: async (data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<ApiResponse<{ message: string }>> => {
    const response = await api.post('/auth/change-password', data);
    return response.data;
  },
};

// Token management utilities
export const setToken = (token: string) => {
  localStorage.setItem('token', token);
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export const clearToken = () => {
  localStorage.removeItem('token');
  delete api.defaults.headers.common['Authorization'];
};
