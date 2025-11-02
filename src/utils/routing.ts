import { UserRole } from '../lib/types';

export const getDashboardUrl = (
  role: number | UserRole,
  uuid: string
): string => {
  if (typeof role === 'number') {
    switch (role) {
      case 1:
        return `/portal/admin/${uuid}/dashboard`;
      case 2:
        return `/portal/teacher/${uuid}/dashboard`;
      case 3:
        return `/portal/student/${uuid}/dashboard`;
      case 4:
        return `/portal/parent/${uuid}/dashboard`;
      default:
        return '/login';
    }
  }

  switch (role) {
    case 'admin':
      return `/portal/admin/${uuid}/dashboard`;
    case 'teacher':
      return `/portal/teacher/${uuid}/dashboard`;
    case 'student':
      return `/portal/student/${uuid}/dashboard`;
    case 'parent':
      return `/portal/parent/${uuid}/dashboard`;
    default:
      return '/login';
  }
};

export const getPortalBaseUrl = (
  role: UserRole,
  userId: string = '1'
): string => {
  return `/portal/${role}/${userId}`;
};
