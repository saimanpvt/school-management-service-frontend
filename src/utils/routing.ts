import { UserRole } from '../lib/types';

export const getDashboardUrl = (role: UserRole, id: string): string => {
  switch (role) {
    case 'Admin':
      return `/portal/admin/${id}/dashboard`;
    case 'Teacher':
      return `/portal/teacher/${id}/dashboard`;
    case 'Student':
      return `/portal/student/${id}/dashboard`;
    case 'Parent':
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
