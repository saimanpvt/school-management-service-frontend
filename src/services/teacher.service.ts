import { apiServices } from '../lib/api';
const api = apiServices;

export interface TeacherDashboardStats {
  teacherName: string;
  totalStudents: number;
  activeClasses: number;
  pendingGrades: number;
  upcomingEvents: number;
  attendance: number;
  classPerformance: Array<{
    className: string;
    averageScore: number;
    totalStudents: number;
  }>;
  upcomingSchedule: Array<{
    id: string;
    className: string;
    startTime: string;
    endTime: string;
    type: 'class' | 'exam' | 'meeting';
  }>;
  recentActivities: Array<{
    id: string;
    type: 'grade' | 'attendance' | 'assignment' | 'message';
    description: string;
    date: string;
    className?: string;
  }>;
  quickStats: {
    assignmentsToGrade: number;
    pendingMessages: number;
    todayAttendance: number;
    upcomingExams: number;
  };
}

export interface Class {
  id: string;
  name: string;
  totalStudents: number;
  schedule: string;
  averagePerformance: number;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  classId: string;
  className: string;
  maxScore: number;
  status: 'active' | 'past';
}

export interface StudentGrade {
  studentId: string;
  studentName: string;
  submitted: boolean;
  submissionDate?: string;
  score: number | null;
  feedback?: string;
}

export const teacherService = {
  getDashboardStats: async (
    teacherId: string
  ): Promise<TeacherDashboardStats> => {
    const response = await apiServices.teachers.getById(teacherId);
    // Transform response to match TeacherDashboardStats interface
    return response.data as any;
  },

  getClasses: async (teacherId: string): Promise<Class[]> => {
    // Get classes from courses API
    const response = await apiServices.courses.getAll();
    return (response.data || []).map((course: any) => ({
      id: course.id,
      name: course.name || course.title,
      totalStudents: course.totalStudents || 0,
      schedule: course.schedule || '',
      averagePerformance: course.averagePerformance || 0
    })) as Class[];
  },

  getStudents: async (teacherId: string) => {
    const response = await apiServices.students.getAll();
    return response.data || [];
  },

  updateMarks: async (teacherId: string, markData: any) => {
    const response = await apiServices.marks.create(markData);
    return response.data;
  },

  createAssignment: async (teacherId: string, assignmentData: any) => {
    // Assignment creation through marks API
    const response = await apiServices.marks.create({
      ...assignmentData,
      teacherId
    });
    return response.data;
  },

  getAttendance: async (teacherId: string, classId: string) => {
    // Attendance would need specific endpoint or use students API
    const response = await apiServices.students.getAll();
    return response.data || [];
  },

  getPendingAssignments: async (teacherId: string): Promise<Assignment[]> => {
    const response = await apiServices.marks.getList();
    return (response.data || []).map((mark: any) => ({
      id: mark.id,
      title: mark.title || 'Assignment',
      description: mark.description || '',
      dueDate: mark.dueDate || '',
      classId: mark.classId || '',
      className: mark.className || '',
      maxScore: mark.maxScore || 100,
      status: mark.status || 'active'
    })) as Assignment[];
  },

  getAssignmentGrades: async (
    teacherId: string,
    assignmentId: string
  ): Promise<{ grades: StudentGrade[] }> => {
    const response = await apiServices.marks.getById(assignmentId);
    return { grades: response.data?.grades || [] };
  },

  submitGrades: async (
    teacherId: string,
    assignmentId: string,
    grades: StudentGrade[]
  ) => {
    await apiServices.marks.update(assignmentId, { grades });
  },

  submitAttendance: async (
    teacherId: string,
    classId: string,
    attendance: { [studentId: string]: boolean }
  ) => {
    // Attendance submission would need specific endpoint
    // For now, just log it
    console.log('Submitting attendance:', { teacherId, classId, attendance });
  },
};
