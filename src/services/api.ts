import { makeHttpRequest, httpClient } from '../lib/httpClient';
import { ExamFormData, FeeStructureFormData } from '../lib/types';

// Users APIs
export const getAllUsers = async () => makeHttpRequest('get', '/auth/users');

export const getUserProfile = async (id: string) =>
  makeHttpRequest('get', `/auth/${id}`);

export const registerUser = async (userData: any) =>
  makeHttpRequest('post', '/auth/register', userData);

export const updateUser = async (id: string, data: any) =>
  makeHttpRequest('put', `/auth/update/${id}`, data);

export const removeUser = async (id: string) =>
  makeHttpRequest('delete', `/auth/delete/${id}`);

// Courses APIs
export const listCourses = async () => makeHttpRequest('get', '/courses');

export const getCourse = async (id: string) =>
  makeHttpRequest('get', `/courses/${id}`);

export const addCourse = async (courseData: any) =>
  makeHttpRequest('post', '/courses/add', courseData);

export const updateCourse = async (id: string, data: any) =>
  makeHttpRequest('put', `/courses/${id}`, data);

export const deleteCourse = async (id: string) =>
  makeHttpRequest('delete', `/courses/${id}`);

// Classes APIs
export const getAllClasses = async () => makeHttpRequest('get', '/classes');

export const getClass = async (id: string) =>
  makeHttpRequest('get', `/classes/${id}`);

export const createClass = async (classData: any) =>
  makeHttpRequest('post', '/classes', classData);

export const editClass = async (id: string, data: any) =>
  makeHttpRequest('put', `/classes/${id}`, data);

export const removeClass = async (id: string) =>
  makeHttpRequest('delete', `/classes/${id}`);

// Exams APIs
export const getAllExams = async () => makeHttpRequest('get', '/exams');

export const getExam = async (id: string) =>
  makeHttpRequest('get', `/exams/${id}`);

export const createExam = async (examData: ExamFormData) =>
  makeHttpRequest('post', '/exams', examData);

export const updateExam = async (id: string, data: Partial<ExamFormData>) =>
  makeHttpRequest('put', `/exams/update/${id}`, data);

export const deleteExam = async (id: string) =>
  makeHttpRequest('delete', `/exams/${id}`);

// Fees APIs
export const getAllFees = async () => makeHttpRequest('get', '/fees');

export const getFee = async (id: string) =>
  makeHttpRequest('get', `/fees/${id}`);

export const createFee = async (feeData: FeeStructureFormData) =>
  makeHttpRequest('post', '/fees', feeData);

export const updateFee = async (
  id: string,
  data: Partial<FeeStructureFormData>
) => makeHttpRequest('put', `/fees/${id}`, data);

export const deleteFee = async (id: string) =>
  makeHttpRequest('delete', `/fees/${id}`);

// Marks APIs
export const getAllMarks = async () => makeHttpRequest('get', '/marks');

export const getMark = async (id: string) =>
  makeHttpRequest('get', `/marks/${id}`);

export const getMarksList = async () => makeHttpRequest('get', '/marks/list');

export const createMark = async (markData: any) =>
  makeHttpRequest('post', '/marks', markData);

export const updateMark = async (id: string, data: any) =>
  makeHttpRequest('put', `/marks/${id}`, data);

export const deleteMark = async (id: string) =>
  makeHttpRequest('delete', `/marks/${id}`);

// References APIs
export const getAllReferences = async () =>
  makeHttpRequest('get', '/references');

export const getReference = async (id: string) =>
  makeHttpRequest('get', `/references/${id}`);

export const createReference = async (refData: any) =>
  makeHttpRequest('post', '/references', refData);

export const updateReference = async (id: string, data: any) =>
  makeHttpRequest('put', `/references/${id}`, data);

export const deleteReference = async (id: string) =>
  makeHttpRequest('delete', `/references/${id}`);

// Attendance APIs
export const markAttendance = async (attendanceData: {
  classId: string;
  date: string;
  attendance: Array<{
    studentId: string;
    status: 'present' | 'absent' | 'late';
  }>;
}) => makeHttpRequest('post', '/attendance', attendanceData);

// Assignment APIs
export const getAllAssignments = async () =>
  makeHttpRequest('get', '/assignments');

export const createAssignment = async (assignmentData: {
  title: string;
  description: string;
  classId: string;
  dueDate: string;
  maxMarks: number;
}) => makeHttpRequest('post', '/assignments', assignmentData);

// Export all APIs -insead of this we can directly import functions where needed
export const apiServices = {
  users: {
    getAll: getAllUsers,
    getById: getUserProfile,
    create: registerUser,
    update: updateUser,
    delete: removeUser,
  },
  courses: {
    getAll: listCourses,
    getById: getCourse,
    create: addCourse,
    update: updateCourse,
    delete: deleteCourse,
  },
  classes: {
    getAll: getAllClasses,
    getById: getClass,
    create: createClass,
    update: editClass,
    delete: removeClass,
  },
  exams: {
    getAll: getAllExams,
    getById: getExam,
    create: createExam,
    update: updateExam,
    delete: deleteExam,
  },
  fees: {
    getAll: getAllFees,
    getById: getFee,
    create: createFee,
    update: updateFee,
    delete: deleteFee,
  },
  marks: {
    getAll: getAllMarks,
    getById: getMark,
    getList: getMarksList,
    create: createMark,
    update: updateMark,
    delete: deleteMark,
  },
  references: {
    getAll: getAllReferences,
    getById: getReference,
    create: createReference,
    update: updateReference,
    delete: deleteReference,
  },

  attendance: {
    mark: markAttendance,
  },
  assignments: {
    getAll: getAllAssignments,
    create: createAssignment,
  },
};

export default httpClient;
