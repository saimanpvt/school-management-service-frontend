import { apiServices } from '../lib/api';
const api = apiServices;

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
    const response = await apiServices.students.getById(studentId);
    // Transform response to match StudentDashboardStats interface
    return response.data as any;
  },

  getStudentInfo: async (studentId: string): Promise<StudentInfo> => {
    const response = await apiServices.students.getById(studentId);
    return response.data as StudentInfo;
  },

  getCourses: async (studentId: string): Promise<Course[]> => {
    const response = await apiServices.courses.getAll();
    return response.data || [];
  },

  getCourseDetails: async (
    studentId: string,
    courseId: string
  ): Promise<Course> => {
    const response = await apiServices.courses.getById(courseId);
    return response.data as Course;
  },

  getAssignments: async (studentId: string): Promise<Assignment[]> => {
    // Get assignments from marks API
    const response = await apiServices.marks.getList();
    return (response.data || []).map((mark: any) => ({
      id: mark.id,
      title: mark.title || 'Assignment',
      dueDate: mark.dueDate || '',
      subject: mark.subject || '',
      status: mark.status || 'pending',
      grade: mark.grade
    })) as Assignment[];
  },

  submitAssignment: async (
    studentId: string,
    assignmentId: string,
    submission: { files: File[]; comment: string }
  ): Promise<void> => {
    // Assignment submission would need specific endpoint
    // For now, submit through marks API
    const formData = new FormData();
    submission.files.forEach((file) => {
      formData.append('files', file);
    });
    formData.append('comment', submission.comment);
    formData.append('studentId', studentId);
    formData.append('assignmentId', assignmentId);
    
    // Use marks API to update assignment status
    await apiServices.marks.update(assignmentId, {
      studentId,
      status: 'submitted',
      comment: submission.comment
    });
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
    const response = await apiServices.marks.getById(studentId);
    // Transform response to match expected format
    return response.data as any || [];
  },

  getMessages: async (studentId: string): Promise<any[]> => {
    // Messages API would need to be added to apiServices
    // For now, return empty array or mock data
    return [];
  },

  sendMessage: async (
    studentId: string,
    message: { recipientId: string; content: string }
  ): Promise<void> => {
    // Messages API would need to be added to apiServices
    // Implementation depends on backend message endpoint
  },
};
