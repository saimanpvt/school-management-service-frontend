import api from './api';

export interface StudentDashboardStats {
  coursesEnrolled: number;
  pendingAssignments: number;
  averageGrade: string;
  attendance: number;
  upcomingExams: number;
  recentActivities: Array<{
    id: string;
    type: string;
    description: string;
    date: string;
  }>;
}

export interface Course {
  id: string;
  name: string;
  teacher: string;
  schedule: string;
  progress: number;
  nextLesson: string;
  grade?: string;
  materials: {
    type: 'document' | 'video' | 'assignment';
    title: string;
    url: string;
  }[];
}

export interface Assignment {
  id: string;
  title: string;
  dueDate: string;
  subject: string;
  status: 'pending' | 'submitted' | 'graded';
  grade?: string;
}

export interface StudentInfo {
  id: string;
  name: string;
  grade: string;
  section: string;
  rollNumber: string;
  email: string;
}

export const studentService = {
  getDashboardStats: async (
    studentId: string
  ): Promise<StudentDashboardStats> => {
    const { data } = await api.get(`/students/${studentId}/dashboard`);
    return data;
  },

  getStudentInfo: async (studentId: string): Promise<StudentInfo> => {
    const { data } = await api.get(`/students/${studentId}`);
    return data;
  },

  getCourses: async (studentId: string): Promise<Course[]> => {
    const { data } = await api.get(`/students/${studentId}/courses`);
    return data;
  },

  getCourseDetails: async (
    studentId: string,
    courseId: string
  ): Promise<Course> => {
    const { data } = await api.get(
      `/students/${studentId}/courses/${courseId}`
    );
    return data;
  },

  getAssignments: async (studentId: string): Promise<Assignment[]> => {
    const { data } = await api.get(`/students/${studentId}/assignments`);
    return data;
  },

  submitAssignment: async (
    studentId: string,
    assignmentId: string,
    submission: { files: File[]; comment: string }
  ): Promise<void> => {
    const formData = new FormData();
    submission.files.forEach((file) => {
      formData.append('files', file);
    });
    formData.append('comment', submission.comment);

    await api.post(
      `/students/${studentId}/assignments/${assignmentId}/submit`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
  },

  getGrades: async (
    studentId: string
  ): Promise<
    {
      courseId: string;
      courseName: string;
      assignments: {
        id: string;
        title: string;
        grade: number;
        maxGrade: number;
      }[];
      tests: { id: string; title: string; grade: number; maxGrade: number }[];
      finalGrade?: number;
    }[]
  > => {
    const { data } = await api.get(`/students/${studentId}/grades`);
    return data;
  },

  getMessages: async (studentId: string): Promise<any[]> => {
    const { data } = await api.get(`/students/${studentId}/messages`);
    return data;
  },

  sendMessage: async (
    studentId: string,
    message: { recipientId: string; content: string }
  ): Promise<void> => {
    await api.post(`/students/${studentId}/messages`, message);
  },
};
