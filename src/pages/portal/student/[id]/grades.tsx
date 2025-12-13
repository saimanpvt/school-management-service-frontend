import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import PortalLayout from '../../../../components/PortalLayout/PortalLayout';
import { apiServices } from '../../../../services/api';
import { BarChart2 } from 'lucide-react';
import styles from './student.module.css';
import LoadingDots from '../../../../components/LoadingDots/LoadingDots';
import { useNotification } from '../../../../components/Toaster/Toaster';
import { calculateGradePercentage } from '../../../../lib/helpers';
import { StudentGrade } from '../../../../lib/types';

const StudentGrades = () => {
  const router = useRouter();
  const { id } = router.query;
  const [grades, setGrades] = useState<StudentGrade[]>([]);
  const [loading, setLoading] = useState(true);
  const { addNotification } = useNotification();

  useEffect(() => {
    const loadGrades = async () => {
      if (id) {
        try {
          const response = await apiServices.grades.getStudentGrades(
            id as string
          );
          if (response.success && response.data) {
            const gradesData = Array.isArray(response.data)
              ? response.data
              : [];
            setGrades(gradesData);
          } else {
            setGrades([]);
            addNotification({
              type: 'error',
              title: 'Failed to load grade records',
              message: 'Please try again later.',
            });
          }
        } catch (error) {
          console.error('Error fetching grades:', error);
          addNotification({
            type: 'error',
            title: 'Error loading grades',
            message: 'Please try again later.',
          });
          setGrades([]);
        } finally {
          setLoading(false);
        }
      }
    };
    loadGrades();
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
        <h1>My Grades</h1>
        <p>View your academic performance across all courses</p>
      </header>

      <div className={styles.gradesContainer}>
        {grades.length > 0 ? (
          grades.map((course) => (
            <div key={course.id} className={styles.gradeCard}>
              <div className={styles.courseName}>{course.subject}</div>

              <div className={styles.gradeSection}>
                <h4 className={styles.sectionTitle}>Course Grade</h4>
                <div className={styles.gradeDisplay}>
                  <div className={styles.gradeValue}>
                    {course.score} / {course.maxScore}
                  </div>
                  <div
                    className={`${styles.gradePercentage} ${
                      styles[getGradeClass(course.score, course.maxScore)]
                    }`}
                  >
                    {calculateGradePercentage(course.score, course.maxScore)}%
                  </div>
                </div>
                <div className={styles.gradeDetails}>
                  <div>Subject: {course.subject}</div>
                  <div>Teacher: {course.teacher}</div>
                  <div>Type: {course.gradeType}</div>
                  {course.comments && <div>Comments: {course.comments}</div>}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.emptyState}>
            <BarChart2 size={48} />
            <h3>No grades available</h3>
            <p>Your grades will appear here once they are published.</p>
          </div>
        )}
      </div>
    </PortalLayout>
  );
};

export default StudentGrades;
