import api from './api';

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
    const { data } = await api.get(`/teachers/${teacherId}/dashboard`);
    return data;
  },

  getClasses: async (teacherId: string): Promise<Class[]> => {
    const { data } = await api.get(`/teachers/${teacherId}/classes`);
    return data;
  },

  getStudents: async (teacherId: string) => {
    const { data } = await api.get(`/teachers/${teacherId}/students`);
    return data;
  },

  updateMarks: async (teacherId: string, markData: any) => {
    const { data } = await api.post(`/teachers/${teacherId}/marks`, markData);
    return data;
  },

  createAssignment: async (teacherId: string, assignmentData: any) => {
    const { data } = await api.post(
      `/teachers/${teacherId}/assignments`,
      assignmentData
    );
    return data;
  },

  getAttendance: async (teacherId: string, classId: string) => {
    const { data } = await api.get(
      `/teachers/${teacherId}/classes/${classId}/attendance`
    );
    return data;
  },

  getPendingAssignments: async (teacherId: string): Promise<Assignment[]> => {
    const { data } = await api.get(
      `/teachers/${teacherId}/assignments/pending`
    );
    return data;
  },

  getAssignmentGrades: async (
    teacherId: string,
    assignmentId: string
  ): Promise<{ grades: StudentGrade[] }> => {
    const { data } = await api.get(
      `/teachers/${teacherId}/assignments/${assignmentId}/grades`
    );
    return data;
  },

  submitGrades: async (
    teacherId: string,
    assignmentId: string,
    grades: StudentGrade[]
  ) => {
    await api.post(
      `/teachers/${teacherId}/assignments/${assignmentId}/grades`,
      { grades }
    );
  },

  submitAttendance: async (
    teacherId: string,
    classId: string,
    attendance: { [studentId: string]: boolean }
  ) => {
    await api.post(`/teachers/${teacherId}/classes/${classId}/attendance`, {
      attendance,
    });
  },
};
