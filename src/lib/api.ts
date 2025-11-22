import axios from 'axios';
import { ApiResponse, LoginCredentials } from './types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

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
      // Only redirect to login if we're not already on the login page
      // and if the token exists (meaning it's expired, not missing)
      const currentPath = window.location.pathname;
      const hasToken = localStorage.getItem('token');

      if (currentPath !== '/login' && hasToken) {
        console.log('Token expired, redirecting to login');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      } else if (!hasToken && currentPath !== '/login') {
        // No token and not on login page - redirect
        window.location.href = '/login';
      }
      // If already on login page, don't redirect (prevents loop)
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
  ): Promise<
    ApiResponse<{
      uuid: string;
      id: string;
      email: string;
      userID: string;
      firstName: string;
      lastName: string;
      phone?: string;
      address?: {
        street?: string;
        city?: string;
        state?: string;
        zipCode?: string;
        country?: string;
      };
      dob?: string;
      gender?: string;
      bloodGroup?: string;
      role: string;
      profileImage?: string;
      accessToken: string;
    }>
  > => {
    const response = await api.post('/login', credentials);
    return response.data;
  },

  logout: async (): Promise<ApiResponse> => {
    const response = await api.post('/logout');
    return response.data;
  },

  getProfile: async (): Promise<ApiResponse<any>> => {
    const response = await api.get('/profile');
    return response.data;
  },

  updateProfile: async (data: Partial<any>): Promise<ApiResponse<any>> => {
    const response = await api.put('/profile', data);
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
    const response = await api.get('/student');
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<any>> => {
    const response = await api.get(`/student/${id}`);
    return response.data;
  },

  create: async (data: any): Promise<ApiResponse<any>> => {
    const response = await api.post('/student', data);
    return response.data;
  },

  update: async (id: string, data: any): Promise<ApiResponse<any>> => {
    const response = await api.put(`/student/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse> => {
    const response = await api.delete(`/student/${id}`);
    return response.data;
  },
};

// Teachers API
export const teachersApi = {
  getAll: async (): Promise<ApiResponse<any[]>> => {
    const response = await api.get('/teacher');
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<any>> => {
    const response = await api.get(`/teacher/${id}`);
    return response.data;
  },

  create: async (data: any): Promise<ApiResponse<any>> => {
    const response = await api.post('/teacher', data);
    return response.data;
  },

  update: async (id: string, data: any): Promise<ApiResponse<any>> => {
    const response = await api.put(`/teacher/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse> => {
    const response = await api.delete(`/teacher/${id}`);
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

// Classes API
export const classesApi = {
  getAll: async (): Promise<ApiResponse<any[]>> => {
    const response = await api.get('/classes');
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<any>> => {
    const response = await api.get(`/classes/${id}`);
    return response.data;
  },

  create: async (data: any): Promise<ApiResponse<any>> => {
    const response = await api.post('/classes', data);
    return response.data;
  },

  update: async (id: string, data: any): Promise<ApiResponse<any>> => {
    const response = await api.put(`/classes/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse> => {
    const response = await api.delete(`/classes/${id}`);
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

// Admin API
export const adminApi = {
  // User Management
  getAllUsers: async (): Promise<ApiResponse<any[]>> => {
    const response = await api.get('/users');
    return response.data;
  },

  createUser: async (data: {
    email: string;
    firstName: string;
    lastName: string;
    role: number;
    password: string;
    phone?: string;
    userID: string;
    address?: {
      street?: string;
      city?: string;
      state?: string;
      zipCode?: string;
      country?: string;
    };
    dob?: string;
    gender?: string;
    bloodGroup?: string;
  }): Promise<ApiResponse<any>> => {
    const response = await api.post('/register', data);
    return response.data;
  },

  updateUser: async (id: string, data: any): Promise<ApiResponse<any>> => {
    const response = await api.put(`/users/${id}`, data);
    return response.data;
  },

  deleteUser: async (id: string): Promise<ApiResponse> => {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  },

  toggleUserStatus: async (id: string): Promise<ApiResponse<any>> => {
    const response = await api.patch(`/admin/users/${id}/toggle-status`);
    return response.data;
  },

  resetUserPassword: async (
    id: string
  ): Promise<ApiResponse<{ password: string }>> => {
    const response = await api.post(`/admin/users/${id}/reset-password`);
    return response.data;
  },

  sendCredentialsEmail: async (data: {
    email: string;
    password: string;
    userID: string;
    firstName: string;
  }): Promise<ApiResponse> => {
    const response = await api.post('/admin/send-credentials', data);
    return response.data;
  },

  // Dashboard Statistics
  getDashboardStats: async (): Promise<
    ApiResponse<{
      totalUsers: number;
      totalStudents: number;
      totalTeachers: number;
      totalParents: number;
      totalAdmins: number;
      activeUsers: number;
      recentLogins: any[];
      userGrowth: any[];
    }>
  > => {
    const response = await api.get('/admin/dashboard-stats');
    return response.data;
  },

  // Bulk Operations
  bulkCreateUsers: async (users: any[]): Promise<ApiResponse<any[]>> => {
    const response = await api.post('/admin/bulk-create-users', { users });
    return response.data;
  },

  exportUsers: async (role?: number): Promise<ApiResponse<any>> => {
    const params = role ? `?role=${role}` : '';
    const response = await api.get(`/admin/export-users${params}`);
    return response.data;
  },

  // System Settings
  getSystemSettings: async (): Promise<ApiResponse<any>> => {
    const response = await api.get('/admin/system-settings');
    return response.data;
  },

  updateSystemSettings: async (settings: any): Promise<ApiResponse<any>> => {
    const response = await api.put('/admin/system-settings', settings);
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
  classes: classesApi,
  marks: marksApi,
  exams: examsApi,
  references: referencesApi,
  fees: feesApi,
  admin: adminApi,
};
