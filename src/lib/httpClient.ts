import axios, { AxiosRequestConfig } from 'axios';
import { ApiResponse } from './types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Create axios instance with default config
export const httpClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add authentication token to all requests
httpClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle authentication errors globally
httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // If unauthorized, clear auth data and redirect to landing page
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Redirect to landing page if not already there
      if (window.location.pathname !== '/') {
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

// Super simple HTTP request function
export const makeHttpRequest = async <T = unknown>(
  method: 'get' | 'post' | 'put' | 'delete' | 'patch',
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
  const response = await httpClient[method](
    url,
    ...(data ? [data] : []),
    config
  );
  return response.data;
};

// Common HTTP methods that return ApiResponse (kept for backward compatibility)
export const httpMethods = {
  get: async <T = unknown>(
    endpoint: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> => {
    const response = await httpClient.get(endpoint, config);
    return response.data;
  },

  post: async <T = unknown>(
    endpoint: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> => {
    const response = await httpClient.post(endpoint, data, config);
    return response.data;
  },

  put: async <T = unknown>(
    endpoint: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> => {
    const response = await httpClient.put(endpoint, data, config);
    return response.data;
  },

  delete: async <T = unknown>(
    endpoint: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> => {
    const response = await httpClient.delete(endpoint, config);
    return response.data;
  },

  patch: async <T = unknown>(
    endpoint: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> => {
    const response = await httpClient.patch(endpoint, data, config);
    return response.data;
  },
};

// Generic CRUD operations for any resource
export const createCrudApi = <T = Record<string, unknown>>(
  basePath: string
) => ({
  getAll: () => httpMethods.get<T[]>(`/${basePath}`),

  getById: (id: string) => httpMethods.get<T>(`/${basePath}/${id}`),

  create: (data: Partial<T>) => httpMethods.post<T>(`/${basePath}`, data),

  update: (id: string, data: Partial<T>) =>
    httpMethods.put<T>(`/${basePath}/${id}`, data),

  delete: (id: string) => httpMethods.delete(`/${basePath}/${id}`),
});

export default httpClient;
