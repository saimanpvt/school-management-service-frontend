import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import PortalLayout from '../../../../components/PortalLayout';
import { apiServices } from '../../../../services/api';
import { BookOpen, Plus, Search, Edit, Trash2 } from 'lucide-react';
import CourseForm from '../../../../components/CourseForm';
import { ProtectedRoute } from '../../../../lib/auth';
import styles from './admin.module.css';
import LoadingDots from '../../../../components/LoadingDots';
import { CourseFormData } from '../../../../lib/types';

const AdminCourses = () => {
  const router = useRouter();
  const { id } = router.query;
  const [courses, setCourses] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<CourseFormData>({
    courseCode: '',
    courseName: '',
    description: '',
    duration: 1,
    teacherId: '',
    classId: '',
    academicYear: '2024-2025',
    isActive: true,
  });

  useEffect(() => {
    if (id) {
      // Fetch courses, teachers, and classes
      Promise.all([
        apiServices.courses.getAll(),
        apiServices.users.getByRole(2), // Teachers
        apiServices.classes.getAll(),
      ])
        .then(([coursesRes, teachersRes, classesRes]) => {
          if (coursesRes.success) {
            setCourses(coursesRes.data || []);
          }
          if (teachersRes.success) {
            setTeachers(teachersRes.data || []);
          }
          if (classesRes.success) {
            setClasses(classesRes.data || []);
          }
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
          setLoading(false);
        });
    }
  }, [id]);

  const filteredCourses = courses.filter(
    (course) =>
      course.courseName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.courseCode?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await apiServices.courses.create(formData);
      if (response.success) {
        setCourses([...courses, response.data]);
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
        alert('Course created successfully!');
      } else {
        alert(
          'Failed to create course: ' + (response.error || 'Unknown error')
        );
      }
    } catch (error) {
      console.error('Error creating course:', error);
      alert('Failed to create course');
    }
  };

  const handleDelete = async (courseId: string) => {
    if (confirm('Are you sure you want to delete this course?')) {
      try {
        await apiServices.courses.delete(courseId);
        setCourses(courses.filter((c) => c._id !== courseId));
      } catch (error) {
        console.error('Error deleting course:', error);
        alert('Failed to delete course');
      }
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
            onClick={() => setShowAddForm(true)}
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
          onClose={() => setShowAddForm(false)}
          teacherOptions={teachers.map((t: any) => ({
            value: t._id,
            label: `${t.firstName} ${t.lastName}${
              t.subject ? ' - ' + t.subject : ''
            }`,
          }))}
          classOptions={classes.map((c: any) => ({
            value: c._id,
            label: c.className,
          }))}
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

                // Find class name
                const classInfo = classes.find(
                  (c: any) => c._id === course.classId
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
                          course.isActive ? styles.active : styles.inactive
                        }`}
                      >
                        {course.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div className={styles.actionButtons}>
                        <button className={styles.editBtn}>
                          <Edit size={16} />
                        </button>
                        <button
                          className={styles.deleteBtn}
                          onClick={() => handleDelete(course._id || course.id)}
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
