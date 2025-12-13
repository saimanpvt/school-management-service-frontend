import { ROLES, ROLE_NAMES, ROLE_COLORS, ATTENDANCE_COLORS, FEE_STATUS_COLORS } from './constants';

// Role helper functions
export const getRoleString = (roleNumber: number): string => {
  return ROLE_NAMES[roleNumber as keyof typeof ROLE_NAMES] || 'student';
};

export const getRoleColor = (role: number): string => {
  return ROLE_COLORS[role as keyof typeof ROLE_COLORS] || '#6b7280';
};

export const getRoleLabel = (roleNumber: number): string => {
  const roleMap = {
    [ROLES.ADMIN]: 'Admin',
    [ROLES.TEACHER]: 'Teacher',
    [ROLES.STUDENT]: 'Student',
    [ROLES.PARENT]: 'Parent',
  };
  return roleMap[roleNumber as keyof typeof roleMap] || 'Student';
};

// Display value helper
export const getDisplayValue = (value: unknown, defaultValue: string = '-'): string | number => {
  if (value === null || value === undefined || value === '') {
    return defaultValue;
  }
  return String(value);
};

// Percentage color helper
export const getPercentageColor = (percentage: number): string => {
  if (percentage >= 90) return ATTENDANCE_COLORS.EXCELLENT;
  if (percentage >= 75) return ATTENDANCE_COLORS.GOOD;
  return ATTENDANCE_COLORS.POOR;
};

// Navigation helper for user details
export const getUserDetailRoute = (adminId: string, userId: string, userRole: number): string => {
  const routeTemplates = {
    1: `/portal/admin/${adminId}/users/${userId}`, // Admin details
    2: `/portal/admin/${adminId}/teacher-details/${userId}`, // Teacher details
    3: `/portal/admin/${adminId}/student-details/${userId}`, // Student details
    4: `/portal/admin/${adminId}/parent-details/${userId}`, // Parent details
  };
  return routeTemplates[userRole as keyof typeof routeTemplates] || '#';
};

// Alert configuration helpers
export const createDeleteAlert = (
  userName: string,
  onConfirm: () => void
) => ({
  isOpen: true,
  title: 'Confirm Delete',
  message: `Are you sure you want to delete "${userName}"? This action cannot be undone.`,
  type: 'warning' as const,
  confirmText: 'Delete',
  cancelText: 'Cancel',
  showCancel: true,
  onConfirm,
});


// Form data preparation helper
export const prepareUserData = (
  formData: any,
  requiredFields: string[],
  optionalFields: string[],
  generatedPassword?: string
) => {
  const userData: Record<string, unknown> = {};

  // Add required fields
  requiredFields.forEach((field) => {
    userData[field] = formData[field] || '';
  });

  // Add optional fields (only if they have values)
  optionalFields.forEach((field) => {
    const value = formData[field];
    if (value !== undefined && value !== '' && value !== null) {
      userData[field] = value;
    }
  });

  // Add password if present
  if (generatedPassword) {
    userData.password = generatedPassword;
  }

  return userData;
};

// Role-based user count helper
export const getRoleBasedCount = (users: any[], userType: string): number => {
  const roleMap = {
    admin: 1,
    teacher: 2,
    student: 3,
    parent: 4,
  };
  return users.filter(u => u.role === roleMap[userType as keyof typeof roleMap]).length;
};

// Capitalize first letter helper
export const capitalizeFirstLetter = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Attendance helper functions
export const generateRecentAttendance = (days: number = 7) => {
  const statuses = ['present', 'absent', 'late'] as const;
  return Array.from({ length: days }, (_, i) => ({
    date: new Date(Date.now() - i * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0],
    status: statuses[Math.floor(Math.random() * (i === 0 ? 2 : 3))], // Today can't be late
  }));
};

export const generateMockAttendanceData = (user: any) => ({
  ...user,
  attendance: {
    present: Math.floor(Math.random() * 30) + 20,
    total: 50,
    percentage: Math.floor(Math.random() * 40) + 60,
    lastPresent: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0],
    streak: Math.floor(Math.random() * 15) + 5,
  },
  recentAttendance: generateRecentAttendance(),
});

export const filterAttendanceData = (
  records: any[],
  searchTerm: string,
  filterStatus: string
) => {
  return records.filter((record) => {
    const matchesSearch =
      (record.firstName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (record.lastName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (record.userID?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (record.email?.toLowerCase() || '').includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterStatus === 'all' ||
      (filterStatus === 'present' && (record.attendance?.percentage || 0) >= 90) ||
      (filterStatus === 'absent' && record.recentAttendance?.[0]?.status === 'absent') ||
      (filterStatus === 'low' && (record.attendance?.percentage || 0) < 75);

    return matchesSearch && matchesFilter;
  });
};

export const calculateAttendanceStats = (data: any[]) => {
  const totalUsers = data.length;
  const presentToday = data.filter(r => r.recentAttendance[0]?.status === 'present').length;
  const absentToday = data.filter(r => r.recentAttendance[0]?.status === 'absent').length;
  const lowAttendance = data.filter(r => r.attendance.percentage < 75).length;
  const avgAttendance = data.reduce((sum, r) => sum + r.attendance.percentage, 0) / totalUsers;

  return {
    totalUsers,
    presentToday,
    absentToday,
    lowAttendance,
    avgAttendance: totalUsers > 0 ? avgAttendance : 0,
  };
};

// Dashboard helper functions
export const processUsersData = (usersData: any) => {
  let totalStudents = 0;
  let totalTeachers = 0;
  let totalParents = 0;

  if (Array.isArray(usersData)) {
    totalStudents = usersData.filter(user => user.role === 3).length;
    totalTeachers = usersData.filter(user => user.role === 2).length;
    totalParents = usersData.filter(user => user.role === 4).length;
  } else if (typeof usersData === 'object' && usersData) {
    const { students = [], teachers = [], parents = [] } = usersData;
    totalStudents = students.length;
    totalTeachers = teachers.length;
    totalParents = parents.length;
  }

  return { totalStudents, totalTeachers, totalParents };
};

export const calculateTotalRevenue = (feesData: any) => {
  return Array.isArray(feesData)
    ? feesData.reduce((sum: number, fee: { amount?: number }) => sum + (fee.amount || 0), 0)
    : 0;
};

// Generic form reset helper
export const resetFormData = <T extends Record<string, any>>(defaultForm: T): T => {
  return { ...defaultForm };
};

// API response parser for different structures
export const parseApiResponse = (response: any, key?: string) => {
  if (!response.success) return [];
  
  if (key && response.data?.[key]) {
    return Array.isArray(response.data[key]) ? response.data[key] : [];
  }
  
  return Array.isArray(response.data) ? response.data : [];
};

// Fee status color helper
export const getFeeStatusColor = (status: 'paid' | 'pending' | 'overdue'): { background: string; color: string } => {
  return FEE_STATUS_COLORS[status] || FEE_STATUS_COLORS.overdue;
};

// Navigation helpers
export const getDetailRoutes = (adminId: string) => ({
  [ROLES.ADMIN]: (userId: string) => `/portal/admin/${adminId}/users/${userId}`,
  [ROLES.TEACHER]: (userId: string) => `/portal/admin/${adminId}/teacher-details/${userId}`,
  [ROLES.STUDENT]: (userId: string) => `/portal/admin/${adminId}/student-details/${userId}`,
  [ROLES.PARENT]: (userId: string) => `/portal/admin/${adminId}/parent-details/${userId}`,
});

export const getAttendanceRoute = (adminId: string, userId: string) => 
  `/portal/admin/${adminId}/attendance/${userId}`;

export const getFeesRoute = (adminId: string, userId: string) => 
  `/portal/admin/${adminId}/fees/${userId}`;

// Form reset helpers
export const resetClassForm = () => ({
  className: '',
  classCode: '',
  description: '',
  year: 0,
});

export const resetCourseForm = () => ({
  courseCode: '',
  courseName: '',
  description: '',
  duration: 1,
  teacherId: '',
  classId: '',
  academicYear: '2024-2025',
  isActive: true,
});

export const resetUserForm = () => ({
  email: '',
  firstName: '',
  lastName: '',
  role: 'student' as const,
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
});

// Filter helpers
export const filterUsers = (users: any[], searchTerm: string, activeUserType: string) => {
  const roleMap = {
    admin: ROLES.ADMIN,
    teacher: ROLES.TEACHER,
    student: ROLES.STUDENT,
    parent: ROLES.PARENT,
  };

  return Array.isArray(users) ? users.filter((user) => {
    // Filter by user type
    const typeMatch = user.role === roleMap[activeUserType as keyof typeof roleMap];

    // Filter by search term
    const searchMatch =
      user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.userID?.toLowerCase().includes(searchTerm.toLowerCase());

    return typeMatch && searchMatch;
  }) : [];
};

export const filterCourses = (courses: any[], searchTerm: string) => {
  return (Array.isArray(courses) ? courses : []).filter(
    (course) =>
      course.courseName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.courseCode?.toLowerCase().includes(searchTerm.toLowerCase())
  );
};

export const filterClasses = (classes: any[], searchTerm: string) => {
  return classes.filter(
    (cls) =>
      cls.className?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.classCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );
};

// Data parsing helpers
export const parseUsersResponse = (response: any) => {
  let userData: any[] = [];

  if (Array.isArray(response.data)) {
    userData = response.data;
  } else if (response.data && typeof response.data === 'object') {
    const data = response.data as Record<string, any[]>;

    // Parse students array
    if (data.students && Array.isArray(data.students)) {
      const students = data.students.map(student => ({
        _id: student.userId || student._id,
        email: student.userId?.email || '',
        firstName: student.fullName?.split(' ')[0] || '',
        lastName: student.fullName?.split(' ').slice(1).join(' ') || '',
        userID: student.userRefId || student.userId,
        role: ROLES.STUDENT,
        admissionDate: student.admissionDate,
        timeWithUs: student.timeWithUs,
        classes: student.classes,
        parentName: student.parentName,
        ...student
      }));
      userData = [...userData, ...students];
    }

    // Parse teachers array
    if (data.teachers && Array.isArray(data.teachers)) {
      const teachers = data.teachers.map(teacher => ({
        _id: teacher.dbId || teacher._id,
        email: teacher.userId?.email || '',
        firstName: teacher.fullName?.split(' ')[0] || '',
        lastName: teacher.fullName?.split(' ').slice(1).join(' ') || '',
        userID: teacher.userId || teacher.userRefId,
        role: ROLES.TEACHER,
        experience: teacher.experience,
        empId: teacher.empId,
        ...teacher
      }));
      userData = [...userData, ...teachers];
    }

    // Parse parent array
    if (data.parent && Array.isArray(data.parent)) {
      const parents = data.parent.map(parent => ({
        _id: parent._id,
        email: parent.email || '',
        firstName: parent.firstName || '',
        lastName: parent.lastName || '',
        userID: parent.userID || parent.uuid,
        role: ROLES.PARENT,
        ...parent
      }));
      userData = [...userData, ...parents];
    }
  }

  return userData;
};

export const parseCoursesResponse = (coursesRes: any) => {
  let allCourses: any[] = [];

  // Check if data has nested structure: { data: { Active: [...], Completed: [...], Inactive: [...] } }
  if (coursesRes.data.data && typeof coursesRes.data.data === 'object') {
    const { Active = [], Completed = [], Inactive = [] } = coursesRes.data.data;
    allCourses = [...Active, ...Completed, ...Inactive];
  }
  // Check if data is directly the courses object: { Active: [...], Completed: [...], Inactive: [...] }
  else if (coursesRes.data.Active || coursesRes.data.Completed || coursesRes.data.Inactive) {
    const { Active = [], Completed = [], Inactive = [] } = coursesRes.data;
    allCourses = [...Active, ...Completed, ...Inactive];
  }
  // Fallback: if data is already an array
  else if (Array.isArray(coursesRes.data)) {
    allCourses = coursesRes.data;
  }

  return allCourses;
};

export const parseClassesResponse = (classesRes: any) => {
  const { ongoing = [], completed = [], inactive = [] } = classesRes.data || classesRes;
  return [...ongoing, ...completed, ...inactive];
};

// Alert configuration helpers
export const createSuccessAlert = (message: string) => ({
  isOpen: true,
  title: 'Success',
  message,
  type: 'success' as const,
  confirmText: 'OK',
  showCancel: false,
  onConfirm: () => {},
});

export const createErrorAlert = (message: string) => ({
  isOpen: true,
  title: 'Error',
  message,
  type: 'error' as const,
  confirmText: 'OK',
  showCancel: false,
  onConfirm: () => {},
});

export const createDeleteConfirmAlert = (
  title: string,
  message: string,
  onConfirm: () => void,
  onCancel: () => void
) => ({
  isOpen: true,
  title,
  message,
  type: 'warning' as const,
  confirmText: 'Delete',
  cancelText: 'Cancel',
  showCancel: true,
  onConfirm,
  onCancel,
});

// Validation helpers
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
  return phoneRegex.test(phone) && phone.length >= 10;
};

export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0;
};

// Count helpers for user tabs
export const getUserCount = (users: any[], roleNumber: number): number => {
  return users.filter(user => user.role === roleNumber).length;
};

// Get role options for a specific user type
export const getUserRoleOptions = (activeUserType: string) => {
  const options = {
    admin: [{ value: 'admin', label: 'Admin', color: '#7c3aed' }],
    teacher: [{ value: 'teacher', label: 'Teacher', color: '#059669' }],
    student: [{ value: 'student', label: 'Student', color: '#2563eb' }],
    parent: [{ value: 'parent', label: 'Parent', color: '#f59e0b' }],
  };
  return options[activeUserType as keyof typeof options] || [];
};

// Teacher function - Date formatting helper
export const formatDateForTeacher = (date: string | Date): string => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// Teacher function - Time formatting helper
export const formatTimeForTeacher = (time: string): string => {
  if (!time) return '';
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
};

// Teacher function - Grade calculation helper
export const calculateGradeForTeacher = (marks: number, totalMarks: number): string => {
  const percentage = (marks / totalMarks) * 100;
  
  if (percentage >= 90) return 'A+';
  if (percentage >= 80) return 'A';
  if (percentage >= 70) return 'B+';
  if (percentage >= 60) return 'B';
  if (percentage >= 50) return 'C+';
  if (percentage >= 40) return 'C';
  if (percentage >= 30) return 'D';
  return 'F';
};

// Teacher function - Attendance percentage calculator
export const calculateAttendancePercentageForTeacher = (
  presentDays: number,
  totalDays: number
): number => {
  if (totalDays === 0) return 0;
  return Math.round((presentDays / totalDays) * 100);
};

// Teacher function - Due date checker
export const isDueSoonForTeacher = (dueDate: string, daysThreshold: number = 3): boolean => {
  if (!dueDate) return false;
  const due = new Date(dueDate);
  const now = new Date();
  const diffTime = due.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= daysThreshold && diffDays >= 0;
};

// Teacher function - Assignment status helper
export const getAssignmentStatusForTeacher = (dueDate: string, submittedDate?: string): string => {
  if (!dueDate) return 'pending';
  
  const due = new Date(dueDate);
  const now = new Date();
  
  if (submittedDate) {
    const submitted = new Date(submittedDate);
    return submitted > due ? 'late' : 'submitted';
  }
  
  return now > due ? 'overdue' : 'pending';
};

// Teacher function - Filter students by performance
export const filterStudentsByPerformanceForTeacher = (
  students: any[],
  performanceLevel: string
): any[] => {
  return students.filter(student => {
    const avgMarks = student.averageMarks || 0;
    switch (performanceLevel) {
      case 'excellent':
        return avgMarks >= 90;
      case 'good':
        return avgMarks >= 75 && avgMarks < 90;
      case 'average':
        return avgMarks >= 60 && avgMarks < 75;
      case 'needs_improvement':
        return avgMarks < 60;
      default:
        return true;
    }
  });
};

// Teacher function - Sort assignments by due date
export const sortAssignmentsByDueDateForTeacher = (assignments: any[]): any[] => {
  return [...assignments].sort((a, b) => {
    const dateA = new Date(a.dueDate).getTime();
    const dateB = new Date(b.dueDate).getTime();
    return dateA - dateB;
  });
};

// Teacher function - Get exam statistics
export const getExamStatisticsForTeacher = (results: any[]) => {
  if (!Array.isArray(results) || results.length === 0) {
    return {
      totalStudents: 0,
      averageMarks: 0,
      highestMarks: 0,
      lowestMarks: 0,
      passRate: 0,
    };
  }

  const totalStudents = results.length;
  const totalMarks = results.reduce((sum, result) => sum + (result.marks || 0), 0);
  const averageMarks = Math.round(totalMarks / totalStudents);
  const highestMarks = Math.max(...results.map(r => r.marks || 0));
  const lowestMarks = Math.min(...results.map(r => r.marks || 0));
  const passedStudents = results.filter(r => (r.marks || 0) >= (r.passingMarks || 40)).length;
  const passRate = Math.round((passedStudents / totalStudents) * 100);

  return {
    totalStudents,
    averageMarks,
    highestMarks,
    lowestMarks,
    passRate,
  };
};
// Student Portal Helper Functions

/**
 * Get status badge class for assignments
 */
export const getAssignmentStatusClass = (status: string): string => {
  const statusClasses = {
    'pending': 'warning',
    'submitted': 'info',
    'graded': 'success',
    'overdue': 'danger',
  };
  return statusClasses[status as keyof typeof statusClasses] || 'warning';
};

/**
 * Get status badge class for exams
 */
export const getExamStatusClass = (status: string): string => {
  const statusClasses = {
    'upcoming': 'info',
    'completed': 'success',
    'missed': 'danger',
  };
  return statusClasses[status as keyof typeof statusClasses] || 'info';
};

/**
 * Get status badge class for fees
 */
export const getFeeStatusClass = (status: string): string => {
  const statusClasses = {
    'paid': 'success',
    'pending': 'warning',
    'overdue': 'danger',
    'partial': 'info',
  };
  return statusClasses[status as keyof typeof statusClasses] || 'warning';
};

/**
 * Get attendance status badge class
 */
export const getAttendanceStatusClass = (status: string): string => {
  const statusClasses = {
    'present': 'success',
    'absent': 'danger',
    'late': 'warning',
    'excused': 'info',
  };
  return statusClasses[status as keyof typeof statusClasses] || 'info';
};

/**
 * Calculate grade percentage
 */
export const calculateGradePercentage = (grade: number, maxMarks: number): number => {
  if (!maxMarks || maxMarks === 0) return 0;
  return Math.round((grade / maxMarks) * 100);
};

/**
 * Get grade letter based on percentage
 */
export const getGradeLetter = (percentage: number): string => {
  if (percentage >= 90) return 'A+';
  if (percentage >= 80) return 'A';
  if (percentage >= 70) return 'B+';
  if (percentage >= 60) return 'B';
  if (percentage >= 50) return 'C+';
  if (percentage >= 40) return 'C';
  return 'F';
};

/**
 * Format date for student portal
 */
export const formatDateForStudent = (dateString: string): string => {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateString;
  }
};

/**
 * Format time for student portal
 */
export const formatTimeForStudent = (timeString: string): string => {
  if (!timeString) return '-';
  try {
    const time = new Date(`1970-01-01T${timeString}`);
    return time.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return timeString;
  }
};

/**
 * Check if assignment is overdue
 */
export const isAssignmentOverdue = (dueDate: string): boolean => {
  if (!dueDate) return false;
  const due = new Date(dueDate);
  const now = new Date();
  return due < now;
};

/**
 * Get days until due date
 */
export const getDaysUntilDue = (dueDate: string): number => {
  if (!dueDate) return 0;
  const due = new Date(dueDate);
  const now = new Date();
  const diffTime = due.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};
