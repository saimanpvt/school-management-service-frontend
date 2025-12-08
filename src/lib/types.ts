export type UserRole =
  | 'Admin'
  | 'Teacher'
  | 'Student'
  | 'Parent'
  | 'admin'
  | 'teacher'
  | 'student'
  | 'parent';

export interface User {
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
  role: UserRole;
  profileImage?: string;
  accessToken: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Course Types
export interface CourseFormData {
  courseCode: string;
  courseName: string;
  description?: string;
  duration: number;
  teacherId: string;
  classId: string;
  academicYear: string;
  isActive?: boolean;
}

// Exam Types
export interface ExamFormData {
  examName: string;
  examType: 'Quiz' | 'Midterm' | 'Final' | 'Assignment' | 'Project' | 'Presentation' | 'Lab' | 'Practical';
  course: string;
  classId: string;
  academicYear: string;
  totalMarks: number;
  passingMarks: number;
  examDate: string;
  startTime: string;
  endTime: string;
  duration: number;
  venue: string;
  instructions?: string;
  isActive?: boolean;
  isCompleted?: boolean;
  resultsPublished?: boolean;
}

// Fee Structure Types
export interface FeeComponent {
  name: string;
  amount: number;
  isMandatory?: boolean;
  description?: string;
  dueDate?: string;
  isRecurring?: boolean;
  frequency?: 'One-time' | 'Monthly' | 'Quarterly' | 'Semester' | 'Annual';
}

export interface FeeStructureFormData {
  name: string;
  description?: string;
  course: string;
  academicYear: string;
  semester: 'Spring' | 'Summer' | 'Fall' | 'Winter';
  feeComponents: FeeComponent[];
  totalAmount: number;
  discountPercentage?: number;
  lateFeePercentage?: number;
  lateFeeGraceDays?: number;
  isActive?: boolean;
  validFrom: string;
  validTo: string;
}

