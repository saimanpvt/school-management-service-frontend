import axios from 'axios';
import { ApiResponse, LoginCredentials } from './types';

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth Methods
export const authApi = {
  register: async (data: {
    firstName: string;
    email: string;
    password: string;
    role: number;
  }): Promise<ApiResponse<{ token: string; user: any }>> => {
    console.log('Register API called with data:', data);
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  login: async (
    credentials: LoginCredentials
  ): Promise<ApiResponse<{ token: string; user: any }>> => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  logout: async (): Promise<ApiResponse> => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  getProfile: async (): Promise<ApiResponse<any>> => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  updateProfile: async (data: Partial<any>): Promise<ApiResponse<any>> => {
    const response = await api.put('/auth/profile', data);
    return response.data;
  },

  changePassword: async (data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<ApiResponse> => {
    const response = await api.put('/change-password', data);
    return response.data;
  },
};

// Students API
export const studentsApi = {
  getAll: async (): Promise<ApiResponse<any[]>> => {
    const response = await api.get('/students');
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<any>> => {
    const response = await api.get(`/students/${id}`);
    return response.data;
  },

  create: async (data: any): Promise<ApiResponse<any>> => {
    const response = await api.post('/students', data);
    return response.data;
  },

  update: async (id: string, data: any): Promise<ApiResponse<any>> => {
    const response = await api.put(`/students/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse> => {
    const response = await api.delete(`/students/${id}`);
    return response.data;
  },
};

// Teachers API
export const teachersApi = {
  getAll: async (): Promise<ApiResponse<any[]>> => {
    const response = await api.get('/teachers');
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<any>> => {
    const response = await api.get(`/teachers/${id}`);
    return response.data;
  },

  create: async (data: any): Promise<ApiResponse<any>> => {
    const response = await api.post('/teachers', data);
    return response.data;
  },

  update: async (id: string, data: any): Promise<ApiResponse<any>> => {
    const response = await api.put(`/teachers/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse> => {
    const response = await api.delete(`/teachers/${id}`);
    return response.data;
  },
};

// Courses API
export const coursesApi = {
  getAll: async (): Promise<ApiResponse<any[]>> => {
    const response = await api.get('/courses');
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<any>> => {
    const response = await api.get(`/courses/${id}`);
    return response.data;
  },

  create: async (data: any): Promise<ApiResponse<any>> => {
    const response = await api.post('/courses', data);
    return response.data;
  },

  update: async (id: string, data: any): Promise<ApiResponse<any>> => {
    const response = await api.put(`/courses/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse> => {
    const response = await api.delete(`/courses/${id}`);
    return response.data;
  },
};

// Marks API
export const marksApi = {
  getById: async (id: string): Promise<ApiResponse<any>> => {
    const response = await api.get(`/marks/${id}`);
    return response.data;
  },

  getList: async (): Promise<ApiResponse<any[]>> => {
    const response = await api.get('/marks/list');
    return response.data;
  },

  create: async (data: any): Promise<ApiResponse<any>> => {
    const response = await api.post('/marks', data);
    return response.data;
  },

  update: async (id: string, data: any): Promise<ApiResponse<any>> => {
    const response = await api.put(`/marks/${id}`, data);
    return response.data;
  },
};

// Exams API
export const examsApi = {
  getAll: async (): Promise<ApiResponse<any[]>> => {
    const response = await api.get('/exams');
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<any>> => {
    const response = await api.get(`/exams/${id}`);
    return response.data;
  },

  create: async (data: any): Promise<ApiResponse<any>> => {
    const response = await api.post('/exams', data);
    return response.data;
  },

  update: async (id: string, data: any): Promise<ApiResponse<any>> => {
    const response = await api.put(`/exams/${id}`, data);
    return response.data;
  },
};

// References API
export const referencesApi = {
  getAll: async (): Promise<ApiResponse<any[]>> => {
    const response = await api.get('/references');
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<any>> => {
    const response = await api.get(`/references/${id}`);
    return response.data;
  },

  create: async (data: any): Promise<ApiResponse<any>> => {
    const response = await api.post('/references', data);
    return response.data;
  },

  update: async (id: string, data: any): Promise<ApiResponse<any>> => {
    const response = await api.put(`/references/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse> => {
    const response = await api.delete(`/references/${id}`);
    return response.data;
  },
};

// Fees API
export const feesApi = {
  getAll: async (): Promise<ApiResponse<any[]>> => {
    const response = await api.get('/fees');
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<any>> => {
    const response = await api.get(`/fees/${id}`);
    return response.data;
  },

  create: async (data: any): Promise<ApiResponse<any>> => {
    const response = await api.post('/fees', data);
    return response.data;
  },

  update: async (id: string, data: any): Promise<ApiResponse<any>> => {
    const response = await api.put(`/fees/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse> => {
    const response = await api.delete(`/fees/${id}`);
    return response.data;
  },
};

// Utility functions
export const setToken = (token: string) => {
  localStorage.setItem('token', token);
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export const clearToken = () => {
  localStorage.removeItem('token');
  delete api.defaults.headers.common['Authorization'];
};

// Export default for backward compatibility
export default api;

// Export all APIs in one object for convenience
export const apiServices = {
  auth: authApi,
  students: studentsApi,
  teachers: teachersApi,
  courses: coursesApi,
  marks: marksApi,
  exams: examsApi,
  references: referencesApi,
  fees: feesApi,
};
