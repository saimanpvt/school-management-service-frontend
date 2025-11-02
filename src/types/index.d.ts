export type Role = 'admin' | 'teacher' | 'student' | 'parent'

export interface User {
  id: string
  name: string
  email: string
  role: Role
}
