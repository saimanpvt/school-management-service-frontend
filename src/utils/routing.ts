import { UserRole } from '../lib/types';

export const getDashboardUrl = (role: UserRole, id: string): string => {
  switch (role) {
    case 'admin':
      return `/portal/admin/${id}/dashboard`;
    case 'teacher':
      return `/portal/teacher/${id}/dashboard`;
    case 'student':
      return `/portal/student/${id}/dashboard`;
    case 'parent':
      return `/portal/parent/${id}/dashboard`;
    default:
      return '/login';
  }
};

export const getPortalBaseUrl = (
  role: UserRole,
  userID: string = '1'
): string => {
  return `/portal/${role}/${userID}`;
};
