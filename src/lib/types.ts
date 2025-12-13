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
  _id: string;
  email: string;
  firstName: string;
  lastName?: string;
  fullName?: string;
  userID?: string;
  userId?: string;
  userRefId?: string;
  role: number;
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
  isActive: boolean;

  // Extended fields for comprehensive user data
  attendance?: {
    present: number;
    total: number;
    percentage: number;
    streak?: number;
  };
  exams?: {
    taken: number;
    passed?: number;
    average: number;
  };
  progress?: {
    overall: number;
    currentLevel: string;
  };

  // Teacher specific
  courses?: string[];
  experience?: number;
  joinedDate?: string;
  expWithUs?: number;

  // Student specific
  classes?: string[];
  currentClassId?: string;
  timeWithUs?: number;
  feeStatus?: {
    status: 'paid' | 'pending' | 'overdue';
    amount: number;
    dueDate?: string;
  };
  parent?: {
    name: string;
    id: string;
    phone: string;
  };
  results?: {
    lastExam: string;
    grade: string;
    rank?: number;
  };
}

// Legacy User interface for auth (keeping for backward compatibility)
export interface AuthUser {
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
  user: AuthUser | null;
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
  examType:
    | 'Quiz'
    | 'Midterm'
    | 'Final'
    | 'Assignment'
    | 'Project'
    | 'Presentation'
    | 'Lab'
    | 'Practical';
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

export type IUserType = 'student' | 'teacher' | 'parent' | 'admin';

// Class Management Types
export interface ClassFormData {
  className: string;
  classCode: string;
  description: string;
  year: number;
}

export interface ClassData {
  _id: string;
  classID: string;
  className: string;
  classCode?: string;
  description?: string;
  year: number;
  createdAt?: string;
  updatedAt?: string;
  courses?: string[];
  students?: string[];
  id?: string;
  __v?: number;
}

// ========================================
// TEACHER-SPECIFIC TYPES & INTERFACES
// ========================================
// These interfaces are specifically designed for teacher portal components
// and teacher-related functionality throughout the application

/**
 * Teacher Assignment Interface
 * Used in: /teacher/[id]/assignments.tsx
 * Purpose: Managing teacher assignment creation, editing, and listing
 */
export interface TeacherAssignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  dueTime?: string;
  className: string;
  courseName: string;
  submissionsCount: number;
  totalStudents: number;
  maxMarks: number;
  instructions?: string;
  status: 'active' | 'completed' | 'overdue';
}

/**
 * Teacher Class Interface
 * Used in: Multiple teacher components for class selection
 * Purpose: Represents classes assigned to a teacher
 */
export interface TeacherClass {
  id: string;
  name: string;
  code: string;
  studentsCount?: number;
  courseName?: string;
  schedule?: {
    day: string;
    startTime: string;
    endTime: string;
  }[];
  averagePerformance?: number;
  recentActivity?: string;
}

/**
 * Teacher Exam Interface
 * Used in: /teacher/[id]/exams.tsx
 * Purpose: Managing teacher exam creation, scheduling, and monitoring
 */
export interface TeacherExam {
  id: string;
  title: string;
  subject: string;
  classId: string;
  className: string;
  date: string;
  time: string;
  duration: string;
  location: string;
  totalStudents: number;
  status: 'upcoming' | 'completed' | 'ongoing';
}

/**
 * Teacher Student Interface
 * Used in: /teacher/[id]/students.tsx
 * Purpose: Representing students under teacher's supervision
 */
export interface TeacherStudent {
  id: string;
  name: string;
  email: string;
  phone?: string;
  grade: string;
  rollNumber: string;
  attendance: number;
  averageGrade: number;
}

/**
 * Teacher Attendance Student Interface
 * Used in: /teacher/[id]/attendance.tsx
 * Purpose: Student data for attendance marking
 */
export interface TeacherAttendanceStudent {
  id: string;
  name: string;
  rollNumber: string;
  profileImage?: string;
}

/**
 * Teacher Attendance Record Interface
 * Used in: /teacher/[id]/attendance.tsx
 * Purpose: Recording student attendance status
 * Note: Status values should match TEACHER_ATTENDANCE_STATUS constant
 */
export interface TeacherAttendanceRecord {
  studentId: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';
}

/**
 * Student Interfaces
 * Used in: /student/[id]/ pages
 * Purpose: Student portal specific data structures
 */

/**
 * Student Assignment Interface
 * Used in: /student/[id]/assignments.tsx
 * Purpose: Student view of assignments with submission status
 */
export interface StudentAssignment {
  id: string;
  title: string;
  description: string;
  subject: string;
  dueDate: string;
  maxMarks: number;
  status: 'pending' | 'submitted' | 'graded' | 'overdue';
  submittedDate?: string;
  grade?: number;
  feedback?: string;
  attachments?: string[];
}

/**
 * Student Course Interface
 * Used in: /student/[id]/courses.tsx
 * Purpose: Student enrolled courses with progress
 */
export interface StudentCourse {
  id: string;
  name: string;
  code: string;
  instructor: string;
  credits: number;
  schedule: string;
  progress: number;
  grade?: string;
  description?: string;
}

/**
 * Student Exam Interface
 * Used in: /student/[id]/exams.tsx
 * Purpose: Student view of exams and results
 */
export interface StudentExam {
  id: string;
  title: string;
  subject: string;
  date: string;
  duration: number;
  maxMarks: number;
  status: 'upcoming' | 'completed' | 'missed';
  grade?: number;
  result?: 'pass' | 'fail';
  feedback?: string;
}

/**
 * Student Grade Interface
 * Used in: /student/[id]/grades.tsx
 * Purpose: Student academic performance tracking
 */
export interface StudentGrade {
  id: string;
  subject: string;
  assignment: string;
  type: 'exam' | 'assignment' | 'quiz' | 'project';
  grade: number;
  maxMarks: number;
  percentage: number;
  date: string;
  feedback?: string;
}

/**
 * Student Attendance Interface
 * Used in: /student/[id]/attendance.tsx
 * Purpose: Student attendance records
 */
export interface StudentAttendance {
  id: string;
  subject: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  teacher: string;
  notes?: string;
}

/**
 * Student Fee Interface
 * Used in: /student/[id]/fees.tsx
 * Purpose: Student fee payment history and pending fees
 */
export interface StudentFee {
  id: string;
  type: 'tuition' | 'library' | 'lab' | 'transport' | 'exam' | 'other';
  amount: number;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue' | 'partial';
  paidDate?: string;
  paidAmount?: number;
  description: string;
  semester: string;
}

/**
 * Student Dashboard Stats Interface
 * Used in: /student/[id]/dashboard.tsx
 * Purpose: Dashboard overview statistics
 */
export interface StudentDashboardStats {
  coursesEnrolled: number;
  pendingAssignments: number;
  averageGrade: string;
  attendance: number;
  upcomingExams: number;
  completedAssignments: number;
}

/**
 * Parent Attendance Interface
 * Used in: /parent/[id]/attendance.tsx
 * Purpose: Child attendance tracking for parents
 */
export interface ParentAttendance {
  id: string;
  date: string;
  childId: string;
  childName: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  subject: string;
  teacher: string;
  notes?: string;
  className?: string;
}

/**
 * Parent Child Info Interface
 * Used in: Multiple parent components
 * Purpose: Information about parent's children
 */
export interface ParentChild {
  id: string;
  name: string;
  grade: string;
  class: string;
  profileImage?: string;
  enrollmentDate: string;
  status: 'active' | 'inactive';
}

/**
 * Parent Dashboard Stats Interface
 * Used in: /parent/[id]/dashboard.tsx
 * Purpose: Dashboard overview statistics for parents
 */
export interface ParentDashboardStats {
  parentName: string;
  totalChildren: number;
  childrenStats: ParentChildStats[];
  financialSummary: {
    amountDue: number;
    nextPaymentDue: string;
    paymentStatus: 'pending' | 'overdue' | 'paid';
  };
  recentActivities: ParentActivity[];
  academicCalendar: {
    id: string;
    date: string;
    event: string;
    type: 'exam' | 'holiday' | 'event';
  }[];
}

/**
 * Parent Child Stats Interface
 * Used in: Parent dashboard and overview components
 * Purpose: Individual child statistics for parent view
 */
export interface ParentChildStats {
  id: string;
  name: string;
  grade: string;
  class: string;
  attendance: number;
  currentAverage: number;
  pendingAssignments: number;
  upcomingTests: number;
}

/**
 * Parent Activity Interface
 * Used in: Parent dashboard and activity feeds
 * Purpose: Recent activities related to parent's children
 */
export interface ParentActivity {
  id: string;
  childId: string;
  childName: string;
  type: 'grade' | 'attendance' | 'behavior' | 'message';
  description: string;
  date: string;
  status?: string;
}

/**
 * Parent Exam Interface
 * Used in: /parent/[id]/exams.tsx
 * Purpose: Exam information for parent's children
 */
export interface ParentExam {
  id: string;
  title: string;
  subject: string;
  childId: string;
  childName: string;
  date: string;
  time: string;
  duration: string;
  location: string;
  status: 'upcoming' | 'completed' | 'in-progress';
  grade?: string;
  maxMarks?: number;
  obtainedMarks?: number;
}

/**
 * Parent Progress Interface
 * Used in: /parent/[id]/progress.tsx
 * Purpose: Academic progress tracking for children
 */
export interface ParentProgress {
  id: string;
  childId: string;
  childName: string;
  subject: string;
  currentGrade: string;
  previousGrade?: string;
  trend: 'improving' | 'declining' | 'stable';
  lastUpdated: string;
  assignments: {
    completed: number;
    total: number;
  };
  exams: {
    passed: number;
    total: number;
  };
}

/**
 * Parent Fee Interface
 * Used in: /parent/[id]/fees.tsx
 * Purpose: Fee tracking and payment management for children
 */
export interface ParentFee {
  id: string;
  title: string;
  amount: number;
  dueDate: string;
  childId: string;
  childName: string;
  status: 'paid' | 'pending' | 'overdue';
  paymentDate?: string;
  transactionId?: string;
  description?: string;
  type?: 'tuition' | 'library' | 'lab' | 'transport' | 'exam' | 'other';
}
