import { UserRole } from '../lib/types';

export const getDashboardUrl = (role: UserRole, userId: string = '1'): string => {
  switch (role) {
    case 'admin':
      return `/portal/admin/${userId}/dashboard`;
    case 'teacher':
      return `/portal/teacher/${userId}/dashboard`;
    case 'student':
      return `/portal/student/${userId}/dashboard`;
    case 'parent':
      return `/portal/parent/${userId}/dashboard`;
    default:
      return '/dashboard';
  }
};

export const getPortalBaseUrl = (role: UserRole, userId: string = '1'): string => {
  return `/portal/${role}/${userId}`;
};

