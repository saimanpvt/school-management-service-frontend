import { UserCheck, GraduationCap, BookOpen, Heart } from 'lucide-react';

// Role mappings
export const ROLES = {
  ADMIN: 1,
  TEACHER: 2,
  STUDENT: 3,
  PARENT: 4,
} as const;

export const ROLE_NAMES = {
  [ROLES.ADMIN]: 'admin',
  [ROLES.TEACHER]: 'teacher',
  [ROLES.STUDENT]: 'student',
  [ROLES.PARENT]: 'parent',
} as const;

export const ROLE_LABELS = {
  [ROLES.ADMIN]: 'Admin',
  [ROLES.TEACHER]: 'Teacher',
  [ROLES.STUDENT]: 'Student',
  [ROLES.PARENT]: 'Parent',
} as const;

// Role colors for UI
export const ROLE_COLORS = {
  [ROLES.ADMIN]: '#7c3aed',
  [ROLES.TEACHER]: '#059669',
  [ROLES.STUDENT]: '#2563eb',
  [ROLES.PARENT]: '#f59e0b',
} as const;

// Academic years
export const ACADEMIC_YEARS = [
  '2023-2024',
  '2024-2025',
  '2025-2026',
  '2026-2027',
  '2027-2028',
] as const;

// Status colors
export const STATUS_COLORS = {
  ACTIVE: '#059669',
  INACTIVE: '#6b7280',
  PENDING: '#f59e0b',
  COMPLETED: '#7c3aed',
} as const;

// Fee status colors
export const FEE_STATUS_COLORS = {
  paid: {
    background: '#dcfce7',
    color: '#166534',
  },
  pending: {
    background: '#fef3c7',
    color: '#92400e',
  },
  overdue: {
    background: '#fee2e2',
    color: '#991b1b',
  },
} as const;

// Attendance percentage colors
export const ATTENDANCE_COLORS = {
  EXCELLENT: '#059669', // >= 90%
  GOOD: '#f59e0b',      // >= 75%
  POOR: '#dc2626',      // < 75%
} as const;

// Default form data
export const DEFAULT_CLASS_FORM = {
  className: '',
  classCode: '',
  description: '',
  year: 0,
} as const;

export const DEFAULT_COURSE_FORM = {
  courseCode: '',
  courseName: '',
  description: '',
  duration: 1,
  teacherId: '',
  classId: '',
  academicYear: '2024-2025',
  isActive: true,
} as const;

export const DEFAULT_USER_FORM = {
  email: '',
  firstName: '',
  lastName: '',
  role: 'student',
  phone: '',
  userID: '',
  address: {
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  },
  dob: '',
  gender: '',
  bloodGroup: '',
  // Role-specific fields
  employeeId: '',
  experience: '',
  DOJ: '',
  admissionDate: '',
  studentId: '',
  childrenId: '',
  classId: '',
} as const;

// Table column spans
export const TABLE_COLSPANS = {
  USER_MANAGEMENT: 5,
  COURSES: 8,
  CLASSES: 7,
  EXAMS: 6,
  FEES: 5,
} as const;

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/logout',
    CHANGE_PASSWORD: '/auth/change-password',
    VERIFY: '/auth/verify',
  },
  USERS: {
    BASE: '/auth/users',
    DELETE: (id: string) => `auth/delete/${id}`,
  },
  COURSES: {
    BASE: '/courses',
    ADD: '/courses/add',
  },
  CLASSES: {
    BASE: '/classes',
  },
  EXAMS: {
    BASE: '/exams',
  },
  FEES: {
    BASE: '/fees',
  },
} as const;

// Alert types
export const ALERT_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
} as const;

// Blood groups
export const BLOOD_GROUPS = [
  'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'
] as const;

// // Gender options
// export const GENDER_OPTIONS = [
//   'Male', 'Female', 'Other'
// ] as const;

// Experience options for teachers
export const EXPERIENCE_OPTIONS = [
  '0-1 years', '1-3 years', '3-5 years', '5-10 years', '10+ years'
] as const;

// Class year options
export const CLASS_YEARS = [
  2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030
] as const;

// User type filters for tabs
export const USER_TYPE_FILTERS = [
  {
    key: 'student' as const,
    label: 'Students',
    icon: GraduationCap,
    color: '#2563eb',
  },
  {
    key: 'teacher' as const,
    label: 'Teachers',
    icon: BookOpen,
    color: '#059669',
  },
  {
    key: 'parent' as const,
    label: 'Parents',
    icon: Heart,
    color: '#f59e0b',
  },
  {
    key: 'admin' as const,
    label: 'Admins',
    icon: UserCheck,
    color: '#7c3aed',
  },
] as const;

// Role options for each user type
export const ROLE_OPTIONS = {
  admin: [{ value: 'admin', label: 'Admin', color: '#7c3aed' }],
  teacher: [{ value: 'teacher', label: 'Teacher', color: '#059669' }],
  student: [{ value: 'student', label: 'Student', color: '#2563eb' }],
  parent: [{ value: 'parent', label: 'Parent', color: '#f59e0b' }],
} as const;

// Form options
export const GENDER_OPTIONS: string[] = ['Male', 'Female', 'Other'];

export const BLOOD_GROUP_OPTIONS: string[] = [
  'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'
];

// Alert messages
export const ALERT_MESSAGES = {
  DELETE_CONFIRM: (userName: string) => `Are you sure you want to delete "${userName}"? This action cannot be undone.`,
  USER_DELETED: 'User deleted successfully!',
  DELETE_FAILED: 'Failed to delete user. Please try again.',
  USER_CREATED: (password: string) => `User created successfully! Password: ${password}`,
  USER_UPDATED: 'User updated successfully!',
  CREATE_FAILED: 'Failed to create user. Please try again.',
  UPDATE_FAILED: 'Failed to update user. Please try again.',
  GENERATE_PASSWORD_REQUIRED: 'Please generate a password first',
} as const;

// UI Constants
export const UI_CONSTANTS = {
  TABLE_COLUMNS: [
    { key: 'id', label: 'ID', align: 'center' as const },
    { key: 'name', label: 'Name', align: 'center' as const },
    { key: 'attendance', label: 'Attendance', align: 'center' as const },
    { key: 'fees', label: 'Fees', align: 'center' as const },
    { key: 'actions', label: 'Actions', align: 'center' as const },
  ],
  BUTTON_STYLES: {
    DELETE: {
      background: '#fee2e2',
      color: '#991b1b',
      border: 'none',
      padding: '6px 8px',
      borderRadius: '6px',
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
    } as const,
  },
  TEXT_STYLES: {
    SECONDARY: '#6b7280',
    SMALL_TEXT: {
      fontSize: '0.75rem',
      color: '#6b7280',
      marginTop: '2px',
    } as const,
  },
} as const;

// Form field configurations
export const FORM_FIELDS = {
  REQUIRED_BASE: ['email', 'firstName', 'lastName', 'role', 'userID'],
  ROLE_SPECIFIC: {
    admin: [],
    teacher: ['employeeId', 'experience', 'DOJ'],
    student: ['studentId', 'admissionDate', 'classId'],
    parent: ['childrenId'],
  },
  OPTIONAL: ['phone', 'dob', 'gender', 'bloodGroup', 'address'],
} as const;

// Attendance constants
export const ATTENDANCE_CONSTANTS = {
  TABS: [
    { key: 'students' as const, label: 'Students', icon: 'GraduationCap' },
    { key: 'teachers' as const, label: 'Teachers', icon: 'User' },
  ],
  FILTER_STATUS: [
    { key: 'all' as const, label: 'All' },
    { key: 'present' as const, label: 'Present (90%+)' },
    { key: 'absent' as const, label: 'Absent Today' },
    { key: 'low' as const, label: 'Low Attendance (<75%)' },
  ],
  THRESHOLDS: {
    HIGH_ATTENDANCE: 90,
    LOW_ATTENDANCE: 75,
  },
  STATUSES: ['present', 'absent', 'late'] as const,
  RECENT_DAYS: 7,
} as const;

// Dashboard constants
export const DASHBOARD_CONSTANTS = {
  STAT_CARDS: [
    {
      key: 'students',
      title: 'Total Students',
      icon: 'GraduationCap',
      color: '#3b82f6',
      background: '#dbeafe',
    },
    {
      key: 'teachers',
      title: 'Total Teachers', 
      icon: 'Users',
      color: '#059669',
      background: '#dcfce7',
    },
    {
      key: 'parents',
      title: 'Total Parents',
      icon: 'Heart',
      color: '#f59e0b',
      background: '#fef3c7',
    },
    {
      key: 'courses',
      title: 'Total Courses',
      icon: 'BookOpen',
      color: '#8b5cf6',
      background: '#ede9fe',
    },
  ],
} as const;

// Exam constants
export const EXAM_CONSTANTS = {
  TYPES: ['Quiz', 'Test', 'Midterm', 'Final', 'Assignment'] as const,
  DEFAULT_FORM: {
    examName: '',
    examType: 'Quiz' as const,
    course: '',
    classId: '',
    academicYear: '',
    totalMarks: 0,
    passingMarks: 0,
    examDate: '',
    startTime: '',
    endTime: '',
    duration: 0,
    venue: '',
    instructions: '',
    isActive: true,
    isCompleted: false,
    resultsPublished: false,
  },
} as const;

// Navigation route patterns
export const USER_DETAIL_ROUTES = {
  1: '/portal/admin/{adminId}/users/{userId}', // Admin details
  2: '/portal/admin/{adminId}/teacher-details/{userId}', // Teacher details
  3: '/portal/admin/{adminId}/student-details/{userId}', // Student details
  4: '/portal/admin/{adminId}/parent-details/{userId}', // Parent details
} as const;

// Teacher function - Assignment constants
export const TEACHER_ASSIGNMENT_CONSTANTS = {
  DEFAULT_FORM: {
    title: '',
    description: '',
    dueDate: '',
    course: '',
    maxMarks: 100,
    instructions: '',
    attachments: [] as string[],
  },
  PRIORITY_LEVELS: ['low', 'medium', 'high'] as const,
  STATUS_OPTIONS: ['pending', 'submitted', 'graded', 'overdue'] as const,
  GRADE_SCALE: {
    A: { min: 90, max: 100 },
    B: { min: 80, max: 89 },
    C: { min: 70, max: 79 },
    D: { min: 60, max: 69 },
    F: { min: 0, max: 59 },
  } as const,
} as const;

// Teacher function - Attendance status constants
export const TEACHER_ATTENDANCE_STATUS = {
  PRESENT: 'present',
  ABSENT: 'absent',  
  LATE: 'late',
  EXCUSED: 'excused',
} as const;

// Teacher function - Exam constants
export const TEACHER_EXAM_CONSTANTS = {
  DEFAULT_FORM: {
    examName: '',
    examType: 'Quiz' as const,
    subject: '',
    date: '',
    startTime: '',
    endTime: '',
    totalMarks: 100,
    passingMarks: 40,
    instructions: '',
  },
  EXAM_TYPES: ['Quiz', 'Assignment', 'Mid-term', 'Final', 'Project'] as const,
  GRADE_LEVELS: ['A+', 'A', 'B+', 'B', 'C+', 'C', 'D', 'F'] as const,
  RESULT_STATUS: ['pending', 'published', 'draft'] as const,
} as const;

// Teacher function - Class management constants
export const TEACHER_CLASS_CONSTANTS = {
  STUDENT_STATUS: ['active', 'inactive', 'transferred'] as const,
  PERFORMANCE_CATEGORIES: ['excellent', 'good', 'average', 'needs_improvement'] as const,
  BEHAVIOR_RATINGS: ['excellent', 'good', 'satisfactory', 'needs_attention'] as const,
} as const;

// Teacher function - Mock data for development
export const TEACHER_MOCK_DATA = {
  EXAMS: [
    {
      id: '1',
      title: 'Mid-term Mathematics Exam',
      subject: 'Mathematics',
      classId: 'class1',
      className: 'Grade 10A',
      date: '2025-01-15',
      time: '09:00 AM',
      duration: '2 hours',
      location: 'Room 101',
      totalStudents: 30,
      status: 'upcoming' as const,
    },
    {
      id: '2',
      title: 'Science Quiz',
      subject: 'Science',
      classId: 'class2',
      className: 'Grade 10B',
      date: '2025-01-10',
      time: '10:00 AM',
      duration: '1 hour',
      location: 'Lab 1',
      totalStudents: 25,
      status: 'completed' as const,
    },
    {
      id: '3',
      title: 'English Literature Test',
      subject: 'English',
      classId: 'class3',
      className: 'Grade 9A',
      date: '2025-01-20',
      time: '11:00 AM',
      duration: '1.5 hours',
      location: 'Room 203',
      totalStudents: 28,
      status: 'upcoming' as const,
    },
  ],
} as const;// Student Portal Constants
export const STUDENT_ASSIGNMENT_STATUS = {
  PENDING: 'pending',
  SUBMITTED: 'submitted', 
  GRADED: 'graded',
  OVERDUE: 'overdue',
} as const;

export const STUDENT_EXAM_STATUS = {
  UPCOMING: 'upcoming',
  COMPLETED: 'completed',
  MISSED: 'missed',
} as const;

export const STUDENT_ATTENDANCE_STATUS = {
  PRESENT: 'present',
  ABSENT: 'absent',
  LATE: 'late',
  EXCUSED: 'excused',
} as const;

export const STUDENT_FEE_STATUS = {
  PAID: 'paid',
  PENDING: 'pending',
  OVERDUE: 'overdue',
  PARTIAL: 'partial',
} as const;

export const STUDENT_FEE_TYPES = {
  TUITION: 'tuition',
  LIBRARY: 'library',
  LAB: 'lab',
  TRANSPORT: 'transport',
  EXAM: 'exam',
  OTHER: 'other',
} as const;

export const STUDENT_GRADE_TYPES = {
  EXAM: 'exam',
  ASSIGNMENT: 'assignment',
  QUIZ: 'quiz',
  PROJECT: 'project',
} as const;

// Student Dashboard Constants
export const STUDENT_DASHBOARD_CONSTANTS = {
  MAX_RECENT_ASSIGNMENTS: 5,
  MAX_UPCOMING_EVENTS: 3,
  MAX_RECENT_ACTIVITIES: 4,
  DASHBOARD_REFRESH_INTERVAL: 300000, // 5 minutes
} as const;
