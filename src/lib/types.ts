export type UserRole = 'admin' | 'teacher' | 'student' | 'parent';

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
