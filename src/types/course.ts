export interface CourseFormData {
  courseCode: string;
  courseName: string;
  description?: string;
  duration: number;
  teacherId: string;
  classId: string;
  academicYear: string;
  isActive?: boolean;
}
