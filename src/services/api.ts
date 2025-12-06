import axios from 'axios';
import { ApiResponse, LoginCredentials } from './types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add authentication token to all requests
api.interceptors.request.use(
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
api.interceptors.response.use(
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
    const response = await api.post('/courses/add', data);
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

// Users API - Unified endpoint for all user types
export const usersApi = {
  getAll: async (): Promise<ApiResponse<any[]>> => {
    const response = await api.get('/auth/users');
    return response.data;
  },

  getByRole: async (role: number): Promise<ApiResponse<any[]>> => {
    const response = await api.get('/auth/users');
    if (response.data.success && response.data.data) {
      let filteredUsers = [];
      
      // Handle different response structures
      if (role === 2 && response.data.data.teachers) {
        filteredUsers = response.data.data.teachers;
      } else if (role === 3 && response.data.data.students) {
        filteredUsers = response.data.data.students;
      } else if (role === 4 && response.data.data.parents) {
        filteredUsers = response.data.data.parents;
      } else if (role === 1 && response.data.data.admins) {
        filteredUsers = response.data.data.admins;
      } else {
        // Fallback: filter from a combined users array if available
        const allUsers = response.data.data.users || [];
        filteredUsers = allUsers.filter((user: any) => user.role === role);
      }
      
      return { ...response.data, data: filteredUsers };
    }
    return response.data;
  },

  // CRUD operations for users
  getById: async (id: string): Promise<ApiResponse<any>> => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  create: async (data: any): Promise<ApiResponse<any>> => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  update: async (id: string, data: any): Promise<ApiResponse<any>> => {
    const response = await api.put(`/users/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse> => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },
};

// Admin API - Admin-specific operations
export const adminApi = {
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

  // Admin-specific user operations
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

  // Fee Structure Management
  addFeeStructure: async (data: {
    name: string;
    description: string;
    course: string;
    academicYear: string;
    semester: string;
    feeComponents: Array<{
      name: string;
      amount: number;
      type: string;
    }>;
    discountPercentage: number;
    lateFeePercentage: number;
    lateFeeGraceDays: number;
    validFrom: string;
    validTo: string;
  }): Promise<ApiResponse<any>> => {
    const response = await api.post('/admin/fee-structure', data);
    return response.data;
  },

  getAllCourses: async (): Promise<ApiResponse<any[]>> => {
    const response = await api.get('/admin/courses');
    return response.data;
  },

  deleteCourse: async (id: string): Promise<ApiResponse> => {
    const response = await api.delete(`/admin/courses/${id}`);
    return response.data;
  },

  // Class Management
  addClass: async (data: {
    className: string;
    classCode: string;
    description: string;
    year: number;
  }): Promise<ApiResponse<any>> => {
    const response = await api.post('/classes', data);
    return response.data;
  },

  getAllClasses: async (): Promise<ApiResponse<any[]>> => {
    const response = await api.get('/classes');
    return response.data;
  },

  deleteClass: async (id: string): Promise<ApiResponse> => {
    const response = await api.delete(`/classes/${id}`);
    return response.data;
  },

  updateClass: async (
    id: string,
    data: {
      className?: string;
      classCode?: string;
      description?: string;
      year?: number;
    }
  ): Promise<ApiResponse<any>> => {
    const response = await api.put(`/classes/${id}`, data);
    return response.data;
  },
};

// Token utilities are now in authApi.ts

// Export default for backward compatibility
export default api;

// Export all APIs in one object for convenience
export const apiServices = {
  users: usersApi,
  courses: coursesApi,
  classes: classesApi,
  marks: marksApi,
  exams: examsApi,
  references: referencesApi,
  fees: feesApi,
  admin: adminApi,
};
