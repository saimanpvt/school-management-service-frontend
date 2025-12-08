import axios from 'axios';
import { ExamFormData, FeeStructureFormData } from '../lib/types';

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Teacher Dashboard Types
export interface TeacherDashboardStats {
  totalStudents: number;
  totalCourses: number;
  activeClasses: number;
  completedAssignments: number;
  quickStats: {
    assignmentsToGrade: number;
    todaysAttendance: number;
    pendingExams: number;
    averageClassPerformance: number;
  };
  courses: Array<{
    id: string;
    name: string;
    code: string;
    studentsCount: number;
  }>;
  upcomingSchedule: Array<{
    id: string;
    startTime: string;
    endTime: string;
    className: string;
    courseName: string;
    type: string;
  }>;
  classPerformance: Array<{
    className: string;
    courseName: string;
    averageScore: number;
    totalStudents: number;
  }>;
  recentActivities: Array<{
    id: string;
    message: string;
    timestamp: string;
    type: string;
  }>;
}

// Student Dashboard Types
export interface StudentDashboardStats {
  currentGrade: string;
  totalCourses: number;
  completedAssignments: number;
  pendingAssignments: number;
  quickStats: {
    averageGrade: number;
    attendanceRate: number;
    upcomingExams: number;
    missedClasses: number;
  };
  courses: Array<{
    id: string;
    name: string;
    code: string;
    instructor: string;
    currentGrade: string;
  }>;
  upcomingSchedule: Array<{
    id: string;
    startTime: string;
    endTime: string;
    courseName: string;
    type: 'class' | 'exam' | 'assignment';
    location?: string;
  }>;
  recentGrades: Array<{
    id: string;
    courseName: string;
    assignmentName: string;
    grade: string;
    maxMarks: number;
    receivedMarks: number;
    date: string;
  }>;
  attendance: Array<{
    date: string;
    courseName: string;
    status: 'present' | 'absent' | 'late';
  }>;
}

// Student-related interfaces
export interface Course {
  id: string;
  name: string;
  code: string;
  instructor: string;
  description?: string;
  credits: number;
  currentGrade?: string;
  progress?: number;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'pending' | 'submitted' | 'graded' | 'overdue';
  courseName: string;
  maxMarks?: number;
  receivedMarks?: number;
  submittedAt?: string;
}

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

// Exams API
export const examsApi = {
  getAll: async (): Promise<ApiResponse<ExamFormData[]>> => {
    const response = await api.get('/exams');
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<ExamFormData>> => {
    const response = await api.get(`/exams/${id}`);
    return response.data;
  },

  create: async (data: ExamFormData): Promise<ApiResponse<ExamFormData>> => {
    const response = await api.post('/exams', data);
    return response.data;
  },

  update: async (
    id: string,
    data: Partial<ExamFormData>
  ): Promise<ApiResponse<ExamFormData>> => {
    const response = await api.put(`/exams/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse> => {
    const response = await api.delete(`/exams/${id}`);
    return response.data;
  },
};

// Fees API
export const feesApi = {
  getAll: async (): Promise<ApiResponse<FeeStructureFormData[]>> => {
    const response = await api.get('/fees');
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<FeeStructureFormData>> => {
    const response = await api.get(`/fees/${id}`);
    return response.data;
  },

  create: async (
    data: FeeStructureFormData
  ): Promise<ApiResponse<FeeStructureFormData>> => {
    const response = await api.post('/fees', data);
    return response.data;
  },

  update: async (
    id: string,
    data: Partial<FeeStructureFormData>
  ): Promise<ApiResponse<FeeStructureFormData>> => {
    const response = await api.put(`/fees/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse> => {
    const response = await api.delete(`/fees/${id}`);
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

// Teacher API - Teacher-specific operations (reusing existing endpoints where possible)
export const teacherApi = {
  // Dashboard Statistics - Teacher specific data aggregation
  getDashboardStats: async (
    teacherId: string
  ): Promise<ApiResponse<TeacherDashboardStats>> => {
    const response = await api.get(`/teacher/${teacherId}/dashboard-stats`);
    return response.data;
  },

  // Reuse existing classes API but filter by teacher
  getTeacherClasses: async (teacherId: string): Promise<ApiResponse<any[]>> => {
    const response = await classesApi.getAll();
    if (response.success && response.data) {
      // Filter classes where teacher is assigned (assuming classes have teacherId field)
      const teacherClasses = response.data.filter(
        (cls: any) => cls.teacherId === teacherId
      );
      return { ...response, data: teacherClasses };
    }
    return response;
  },

  // Reuse existing users API to get students by class
  getStudentsByClass: async (classId: string): Promise<ApiResponse<any[]>> => {
    const response = await usersApi.getByRole(3); // Role 3 = students
    if (response.success && response.data) {
      // Filter students by classId
      const classStudents = response.data.filter(
        (student: any) => student.classId === classId
      );
      return { ...response, data: classStudents };
    }
    return response;
  },

  // Teacher-specific functionality that needs dedicated endpoints
  markAttendance: async (data: {
    classId: string;
    date: string;
    attendance: Array<{
      studentId: string;
      status: 'present' | 'absent' | 'late';
    }>;
  }): Promise<ApiResponse<any>> => {
    const response = await api.post('/teacher/attendance', data);
    return response.data;
  },

  getAssignments: async (): Promise<ApiResponse<any[]>> => {
    const response = await api.get(`/teacher/assignments`);
    return response.data;
  },

  createAssignment: async (data: {
    title: string;
    description: string;
    classId: string;
    dueDate: string;
    maxMarks: number;
  }): Promise<ApiResponse<any>> => {
    const response = await api.post('/teacher/assignments', data);
    return response.data;
  },

  submitGrades: async (
    assignmentId: string,
    grades: Array<{
      studentId: string;
      marks: number;
      feedback?: string;
    }>
  ): Promise<ApiResponse<any>> => {
    const response = await api.post(
      `/teacher/assignments/${assignmentId}/grades`,
      { grades }
    );
    return response.data;
  },
};

// Student API - Student-specific operations (reusing existing endpoints where possible)
export const studentApi = {
  // Dashboard Statistics - Student specific data aggregation
  getDashboardStats: async (
    studentId: string
  ): Promise<ApiResponse<StudentDashboardStats>> => {
    const response = await api.get(`/student/${studentId}/dashboard-stats`);
    return response.data;
  },

  // Reuse existing courses API but filter by student enrollment
  getStudentCourses: async (studentId: string): Promise<ApiResponse<any[]>> => {
    const response = await coursesApi.getAll();
    if (response.success && response.data) {
      // Filter courses where student is enrolled (assuming courses have enrolled students array)
      const studentCourses = response.data.filter((course: any) =>
        course.enrolledStudents?.includes(studentId)
      );
      return { ...response, data: studentCourses };
    }
    return response;
  },

  // Get student's assignments using existing marks/assignments endpoints
  getAssignments: async (studentId: string): Promise<ApiResponse<any[]>> => {
    const response = await api.get(`/student/${studentId}/assignments`);
    return response.data;
  },

  // Get student grades - reuse existing marks API
  getGrades: async (studentId: string): Promise<ApiResponse<any[]>> => {
    const response = await marksApi.getList();
    if (response.success && response.data) {
      // Filter grades for this student
      const studentGrades = response.data.filter(
        (grade: any) => grade.studentId === studentId
      );
      return { ...response, data: studentGrades };
    }
    return response;
  },

  // Get student's exams using existing exams API
  getExams: async (studentId: string): Promise<ApiResponse<any[]>> => {
    const response = await examsApi.getAll();
    if (response.success && response.data) {
      // Filter exams for student's class/courses
      // This would need student's class information to filter properly
      return response;
    }
    return response;
  },

  // Student-specific functionality that needs dedicated endpoints
  submitAssignment: async (
    assignmentId: string,
    submission: {
      content?: string;
      files?: File[];
      submittedAt?: string;
    }
  ): Promise<ApiResponse<any>> => {
    const formData = new FormData();
    if (submission.content) formData.append('content', submission.content);
    if (submission.files) {
      submission.files.forEach((file) => formData.append('files', file));
    }

    const response = await api.post(
      `/student/assignments/${assignmentId}/submit`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    return response.data;
  },

  // Get attendance records
  getAttendance: async (studentId: string): Promise<ApiResponse<any[]>> => {
    const response = await api.get(`/student/${studentId}/attendance`);
    return response.data;
  },

  // Get fee information - reuse existing fees API
  getFees: async (studentId: string): Promise<ApiResponse<any>> => {
    const response = await api.get(`/student/${studentId}/fees`);
    return response.data;
  },
};

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
  teacher: teacherApi,
  student: studentApi,
};
