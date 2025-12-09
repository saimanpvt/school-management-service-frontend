import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import PortalLayout from '../../../../components/PortalLayout/PortalLayout';
import { apiServices, Course } from '../../../../services/api';
import { BookOpen, Clock, User, TrendingUp, FileText } from 'lucide-react';
import styles from './student.module.css';
import LoadingDots from '../../../../components/LoadingDots/LoadingDots';

const StudentCourses = () => {
  const router = useRouter();
  const { id } = router.query;
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCourses = async () => {
      if (id) {
        try {
          // Use unified courses API - backend filters for student
          const response = await apiServices.courses.getAll();
          if (response.success && response.data) {
            setCourses(response.data);
          }
        } catch (error) {
          console.error('Error fetching courses:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    loadCourses();
  }, [id]);

  if (loading) {
    return (
      <PortalLayout userName="Student" userRole="student">
        <div className={styles.loading}>
          <LoadingDots />
        </div>
      </PortalLayout>
    );
  }

  return (
    <PortalLayout userName="Student" userRole="student">
      <header className={styles.pageHeader}>
        <h1>My Courses</h1>
        <p>View all your enrolled courses and progress</p>
      </header>

      <div className={styles.coursesGrid}>
        {courses.length > 0 ? (
          courses.map((course) => (
            <div key={course.id} className={styles.courseCard}>
              <div className={styles.courseHeader}>
                <div className={styles.courseIcon}>
                  <BookOpen size={24} />
                </div>
                <div className={styles.courseTitleSection}>
                  <h3>{course.name}</h3>
                  <div className={styles.courseMeta}>
                    <span className={styles.teacherInfo}>
                      <User size={14} />
                      {course.teacher}
                    </span>
                    <span className={styles.scheduleInfo}>
                      <Clock size={14} />
                      {course.schedule}
                    </span>
                  </div>
                </div>
              </div>

              <div className={styles.progressSection}>
                <div className={styles.progressHeader}>
                  <span>Progress</span>
                  <span className={styles.progressPercent}>
                    {course.progress}%
                  </span>
                </div>
                <div className={styles.progressBar}>
                  <div
                    className={styles.progressFill}
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
              </div>

              {course.grade && (
                <div className={styles.gradeBadge}>
                  <TrendingUp size={14} />
                  Grade: {course.grade}
                </div>
              )}

              <div className={styles.courseFooter}>
                <div className={styles.nextLesson}>
                  <span>Next Lesson:</span>
                  <span className={styles.lessonDate}>{course.nextLesson}</span>
                </div>
                <button
                  className={styles.viewCourseBtn}
                  onClick={() => {
                    const routerInstance = router as any;
                    routerInstance?.push(
                      `/portal/student/${id}/courses/${course.id}`
                    );
                  }}
                >
                  View Details
                </button>
              </div>

              {course.materials && course.materials.length > 0 && (
                <div className={styles.materialsPreview}>
                  <FileText size={14} />
                  <span>{course.materials.length} materials available</span>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className={styles.emptyState}>
            <BookOpen size={48} />
            <h3>No courses enrolled</h3>
            <p>You haven't enrolled in any courses yet.</p>
          </div>
        )}
      </div>
    </PortalLayout>
  );
};

export default StudentCourses;
