export type UserRole = 'admin' | 'teacher' | 'student' | 'parent';

export interface User {
  id: string;
  uuid: string;
  email: string;
  firstName: string;
  role: UserRole;
  avatar?: string;
  roleName?: string;
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
