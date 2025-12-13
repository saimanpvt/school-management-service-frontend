import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import PortalLayout from '../../../../components/PortalLayout/PortalLayout';
import { apiServices } from '../../../../services/api';
import { BookOpen, Plus, Search, Edit, Trash2 } from 'lucide-react';
import CourseForm from '../../../../components/CourseForm/CourseForm';
import AlertModal from '../../../../components/AlertModal';
import { useNotification } from '../../../../components/Toaster';
import { ProtectedRoute } from '../../../../lib/auth';
import { DEFAULT_COURSE_FORM } from '../../../../lib/constants';
import { resetCourseForm, filterCourses } from '../../../../lib/helpers';
import styles from './admin.module.css';
import LoadingDots from '../../../../components/LoadingDots/LoadingDots';
import { CourseFormData } from '../../../../lib/types';

const AdminCourses = () => {
  const router = useRouter();
  const { id } = router.query;
  const { addNotification } = useNotification();
  const [courses, setCourses] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [formData, setFormData] = useState<CourseFormData>(DEFAULT_COURSE_FORM);

  // Delete modal state
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    courseId: '',
    courseName: '',
  });

  useEffect(() => {
    if (id) {
      // Fetch courses, teachers, and classes
      Promise.all([
        apiServices.courses.getAll(),
        apiServices.users.getAll(), // All users - we'll filter teachers
        apiServices.classes.getAll(),
      ])
        .then(([coursesRes, usersRes, classesRes]) => {
          console.log('API Responses:', { coursesRes, usersRes, classesRes });

          // Filter teachers from users response

          let teachersRes = { success: false, data: [] as any[] };
          if (usersRes.success && usersRes.data) {
            console.log('Users response:', usersRes.data);
            // Handle different user response structures
            let allUsers: any[] = [];
            if (
              (usersRes.data as any)?.teachers &&
              Array.isArray((usersRes.data as any).teachers)
            ) {
              // If users response has teachers array directly
              allUsers = (usersRes.data as any).teachers;
            } else if (Array.isArray(usersRes.data)) {
              // If users response is direct array, filter for role 2 (teachers)
              allUsers = usersRes.data.filter((user: any) => user.role === 2);
            }
            teachersRes = { success: true, data: allUsers };
            console.log('Filtered teachers:', allUsers);
          }

          if (coursesRes.success && coursesRes.data) {
            console.log('Courses data:', coursesRes.data);
            // Handle different courses API structures
            let allCourses: any[] = [];

            // Check if data has nested structure: { data: { Active: [...], Completed: [...], Inactive: [...] } }
            if (
              (coursesRes.data as any).data &&
              typeof (coursesRes.data as any).data === 'object'
            ) {
              const {
                Active = [],
                Completed = [],
                Inactive = [],
              } = (coursesRes.data as any).data;
              allCourses = [...Active, ...Completed, ...Inactive];
            }
            // Check if data is directly the courses object: { Active: [...], Completed: [...], Inactive: [...] }
            else if (
              typeof coursesRes.data === 'object' &&
              coursesRes.data !== null &&
              ('Active' in coursesRes.data ||
                'Completed' in coursesRes.data ||
                'Inactive' in coursesRes.data)
            ) {
              const {
                Active = [],
                Completed = [],
                Inactive = [],
              } = coursesRes.data as {
                Active?: any[];
                Completed?: any[];
                Inactive?: any[];
              };
              allCourses = [...Active, ...Completed, ...Inactive];
            }
            // Fallback: if data is already an array
            else if (Array.isArray(coursesRes.data)) {
              allCourses = coursesRes.data;
            }

            console.log('Final courses array:', allCourses);
            setCourses(allCourses);
          }

          if (teachersRes.success) {
            const teacherData = Array.isArray(teachersRes.data)
              ? teachersRes.data
              : [];
            setTeachers(teacherData);
          }

          if (classesRes.success && classesRes.data) {
            console.log('Classes data:', classesRes.data);
            // Handle classes API structure: { ongoing: [...], completed: [...], inactive: [...] }
            let allClasses: any[] = [];
            const data =
              classesRes.data && typeof classesRes.data === 'object'
                ? (classesRes.data as {
                    ongoing?: any[];
                    completed?: any[];
                    inactive?: any[];
                  })
                : {};
            const { ongoing = [], completed = [], inactive = [] } = data;
            allClasses = [...ongoing, ...completed, ...inactive];
            console.log('Setting classes to:', allClasses);
            setClasses(allClasses);
          }
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
          setLoading(false);
        });
    }
  }, [id]);

  const filteredCourses = filterCourses(courses, searchTerm);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let response;
      if (isEditMode && editingCourseId) {
        // Update existing course
        response = await apiServices.courses.update(editingCourseId, formData);
        if (response.success) {
          const currentCourses = Array.isArray(courses) ? courses : [];
          setCourses(
            currentCourses.map((course) =>
              (course._id || course.id) === editingCourseId
                ? { ...course, ...formData, _id: course._id || course.id }
                : course
            )
          );
          addNotification({
            type: 'success',
            title: 'Course updated successfully!',
            message: `${formData.courseName} has been updated.`,
          });
        } else {
          addNotification({
            type: 'error',
            title: 'Failed to update course',
            message: response.error || 'Please try again later.',
          });
        }
      } else {
        // Create new course
        response = await apiServices.courses.create(formData);
        if (response.success) {
          const currentCourses = Array.isArray(courses) ? courses : [];
          setCourses([...currentCourses, response.data]);
          addNotification({
            type: 'success',
            title: 'Course created successfully!',
            message: `${formData.courseName} has been created.`,
          });
        } else {
          addNotification({
            type: 'error',
            title: 'Failed to create course',
            message: response.error || 'Please try again later.',
          });
        }
      }

      if (response.success) {
        // Reset form
        setFormData({
          courseCode: '',
          courseName: '',
          description: '',
          duration: 1,
          teacherId: '',
          classId: '',
          academicYear: '2024-2025',
          isActive: true,
        });
        setShowAddForm(false);
        setIsEditMode(false);
        setEditingCourseId(null);
      }
    } catch (error) {
      console.error('Error saving course:', error);
      addNotification({
        type: 'error',
        title: 'Error saving course',
        message: 'An unexpected error occurred. Please try again.',
      });
    }
  };

  const handleEdit = (course: any) => {
    setFormData({
      courseCode: course.courseCode || '',
      courseName: course.courseName || '',
      description: course.description || '',
      duration: course.duration || 1,
      teacherId: course?.teacherId || '',
      classId: course.classId || '',
      academicYear: course.academicYear || '2024-2025',
      isActive: course.isActive !== undefined ? course.isActive : true,
    });
    setIsEditMode(true);
    setEditingCourseId(course._id || course.id);
    setShowAddForm(true);
  };

  const openDeleteModal = (courseId: string, courseName: string) => {
    setDeleteModal({ isOpen: true, courseId, courseName });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, courseId: '', courseName: '' });
  };

  const confirmDelete = async () => {
    try {
      await apiServices.courses.delete(deleteModal.courseId);
      const currentCourses = Array.isArray(courses) ? courses : [];
      setCourses(currentCourses.filter((c) => c._id !== deleteModal.courseId));
      addNotification({
        type: 'success',
        title: 'Course deleted successfully!',
        message: `${deleteModal.courseName} has been removed.`,
      });
    } catch (error) {
      console.error('Error deleting course:', error);
      addNotification({
        type: 'error',
        title: 'Failed to delete course',
        message: 'Please try again later.',
      });
    } finally {
      closeDeleteModal();
    }
  };

  if (loading) {
    return (
      <PortalLayout userRole="admin" userName="Admin">
        <div className={styles.loading}>
          <LoadingDots />
        </div>
      </PortalLayout>
    );
  }

  return (
    <PortalLayout userRole="admin" userName="Admin">
      <header className={styles.pageHeader}>
        <div>
          <h1>Manage Courses</h1>
          <p>View and manage all courses in the system</p>
        </div>
        <div className={styles.headerActions}>
          <div className={styles.searchBox}>
            <Search size={18} />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          <button
            className={styles.createBtn}
            onClick={() => {
              setIsEditMode(false);
              setEditingCourseId(null);
              setFormData({
                courseCode: '',
                courseName: '',
                description: '',
                duration: 1,
                teacherId: '',
                classId: '',
                academicYear: '2024-2025',
                isActive: true,
              });
              setShowAddForm(true);
            }}
          >
            <Plus size={18} />
            Add Course
          </button>
        </div>
      </header>

      {showAddForm && (
        <CourseForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
          onClose={() => {
            setShowAddForm(false);
            setIsEditMode(false);
            setEditingCourseId(null);
            setFormData(resetCourseForm());
          }}
          isEdit={isEditMode}
        />
      )}

      <div className={styles.tableContainer}>
        <table className={styles.dataTable}>
          <thead>
            <tr>
              <th>Course Code</th>
              <th>Course Name</th>
              <th>Academic Year</th>
              <th>Duration</th>
              <th>Teacher</th>
              <th>Class</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCourses.length > 0 ? (
              filteredCourses.map((course) => {
                // Find teacher name
                const teacher = teachers.find(
                  (t: any) => t._id === course.teacherId
                );
                const teacherName = teacher
                  ? `${teacher.firstName} ${teacher.lastName}`
                  : 'Not Assigned';

                // Find class name (using classID from your API response)
                const classInfo = classes.find(
                  (c: any) =>
                    c._id === course.classId || c.classID === course.classID
                );
                const className = classInfo
                  ? classInfo.className
                  : 'Not Assigned';

                return (
                  <tr key={course._id || course.id}>
                    <td>{course.courseCode || 'N/A'}</td>
                    <td>{course.courseName || 'N/A'}</td>
                    <td>{course.academicYear || 'N/A'}</td>
                    <td>
                      {course.duration ? `${course.duration} weeks` : 'N/A'}
                    </td>
                    <td>{teacherName}</td>
                    <td>{className}</td>
                    <td>
                      <span
                        className={`${styles.statusBadge} ${
                          course.status === 'Active' || course.isActive
                            ? styles.active
                            : styles.inactive
                        }`}
                      >
                        {course.status ||
                          (course.isActive ? 'Active' : 'Inactive')}
                      </span>
                    </td>
                    <td>
                      <div className={styles.actionButtons}>
                        <button
                          className={styles.editBtn}
                          onClick={() => handleEdit(course)}
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          className={styles.deleteBtn}
                          onClick={() =>
                            openDeleteModal(
                              course.courseCode,
                              course.courseName || course.name
                            )
                          }
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={8} className={styles.emptyState}>
                  <BookOpen size={48} />
                  <h3>No courses found</h3>
                  <p>
                    {searchTerm
                      ? 'Try a different search term'
                      : 'No courses in the system'}
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <AlertModal
          usage="delete"
          mainText="Delete Course"
          subText={`Are you sure you want to delete "${deleteModal.courseName}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={confirmDelete}
          onCancel={closeDeleteModal}
          onClose={closeDeleteModal}
        />
      )}
    </PortalLayout>
  );
};

export default function ProtectedAdminCourses() {
  return (
    <ProtectedRoute roles={['Admin']}>
      <AdminCourses />
    </ProtectedRoute>
  );
}
