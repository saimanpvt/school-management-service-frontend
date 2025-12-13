// Role-specific data filtering utilities
export const USER_ROLES = {
  ADMIN: 1,
  TEACHER: 2,
  STUDENT: 3,
  PARENT: 4,
} as const;

// Define which fields each role should see/send
export const ROLE_FIELDS = {
  [USER_ROLES.ADMIN]: {
    // Admin can see/edit everything
    basic: [
      'email',
      'firstName',
      'lastName',
      'userID',
      'phone',
      'address',
      'dob',
      'gender',
      'bloodGroup',
      'profileImage',
      'role',
      'isActive',
    ],
    student: ['admissionDate', 'studentId', 'classId', 'parentId'],
    teacher: ['employeeId', 'experience', 'DOJ', 'emergencyContact'],
    parent: ['childrenId'],
  },
  [USER_ROLES.TEACHER]: {
    // Teacher can only see/edit limited fields
    basic: [
      'firstName',
      'lastName',
      'phone',
      'address',
      'dob',
      'gender',
      'bloodGroup',
      'profileImage',
    ],
    teacher: ['emergencyContact', 'bio'],
    student: [], // No student-specific fields
    parent: [], // No parent-specific fields
  },
  [USER_ROLES.STUDENT]: {
    // Student can only see/edit very limited fields
    basic: ['firstName', 'lastName', 'phone', 'address', 'profileImage'],
    student: ['emergencyContact'],
    teacher: [], // No teacher-specific fields
    parent: [], // No parent-specific fields
  },
  [USER_ROLES.PARENT]: {
    // Parent can see their info and limited child info
    basic: [
      'firstName',
      'lastName',
      'phone',
      'address',
      'dob',
      'gender',
      'profileImage',
    ],
    parent: ['emergencyContact'],
    student: [], // Limited child access through specific endpoints
    teacher: [], // No teacher-specific fields
  },
} as const;

// Filter user data based on current user's role and target user's role
export const filterUserDataByRole = (
  userData: any,
  currentUserRole: number,
  targetUserRole?: number
): any => {
  if (!userData) return null;

  const allowedFields =
    ROLE_FIELDS[currentUserRole as keyof typeof ROLE_FIELDS];
  if (!allowedFields) return null;

  // Start with basic fields
  const filtered: any = {};

  // Add basic fields
  allowedFields.basic.forEach((field) => {
    if (userData[field] !== undefined) {
      filtered[field] = userData[field];
    }
  });

  // Add role-specific fields based on target user's role
  if (
    targetUserRole === USER_ROLES.STUDENT &&
    allowedFields.student.length > 0
  ) {
    allowedFields.student.forEach((field) => {
      if (userData[field] !== undefined) {
        filtered[field] = userData[field];
      }
    });
  }

  if (
    targetUserRole === USER_ROLES.TEACHER &&
    allowedFields.teacher.length > 0
  ) {
    allowedFields.teacher.forEach((field) => {
      if (userData[field] !== undefined) {
        filtered[field] = userData[field];
      }
    });
  }

  if (targetUserRole === USER_ROLES.PARENT && allowedFields.parent.length > 0) {
    allowedFields.parent.forEach((field) => {
      if (userData[field] !== undefined) {
        filtered[field] = userData[field];
      }
    });
  }

  return filtered;
};

// Get form fields that should be shown for a specific role
export const getFormFieldsForRole = (
  currentUserRole: number,
  targetRole: number
): {
  basic: string[];
  roleSpecific: string[];
} => {
  const allowedFields =
    ROLE_FIELDS[currentUserRole as keyof typeof ROLE_FIELDS];
  if (!allowedFields) {
    return { basic: [], roleSpecific: [] };
  }
  let roleSpecific: string[] = [];
  switch (targetRole) {
    case USER_ROLES.STUDENT:
      roleSpecific = Array.from(allowedFields.student);
      break;
    case USER_ROLES.TEACHER:
      roleSpecific = Array.from(allowedFields.teacher);
      break;
    case USER_ROLES.PARENT:
      roleSpecific = Array.from(allowedFields.parent);
      break;
    default:
      roleSpecific = [];
  }
  return {
    basic: Array.from(allowedFields.basic),
    roleSpecific,
  };
};

// Filter form data before sending to API (removes unauthorized fields)
export const filterFormDataForSubmission = (
  formData: any,
  currentUserRole: number,
  targetRole: number
): any => {
  const { basic, roleSpecific } = getFormFieldsForRole(
    currentUserRole,
    targetRole
  );
  const allowedFields = [...basic, ...roleSpecific];

  const filtered: any = {};
  allowedFields.forEach((field) => {
    if (formData[field] !== undefined && formData[field] !== '') {
      filtered[field] = formData[field];
    }
  });

  return filtered;
};
