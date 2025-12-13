import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import PortalLayout from '../../../../components/PortalLayout/PortalLayout';
import { apiServices } from '../../../../services/api';
import {
  Users,
  Clock,
  ArrowRight,
} from 'lucide-react';
import styles from './teacher.module.css';
import LoadingDots from '../../../../components/LoadingDots/LoadingDots';
import { useNotification } from '../../../../components/Toaster/Toaster';
import type { TeacherClass } from '../../../../lib/types';

const TeacherClass = () => {
  const router = useRouter();
  const { id } = router.query;
  const [classes, setClasses] = useState<TeacherClass[]>([]);
  const [loading, setLoading] = useState(true);
  const { addNotification } = useNotification();

  useEffect(() => {
    const loadClasses = async () => {
      if (id) {
        try {
          // Use unified classes API - backend filters for teacher
          const response = await apiServices.classes.getAll();
          if (response.success && response.data) {
            setClasses(response.data);
          } else {
            addNotification('Failed to load classes', 'error');
          }
        } catch (error) {
          console.error('Error fetching classes:', error);
          addNotification('Failed to load classes', 'error');
        } finally {
          setLoading(false);
        }
      }
    };
    loadClasses();
  }, [id]);

  if (loading) {
    return (
      <PortalLayout userRole="teacher" userName="Teacher">
        <div className={styles.loading}>
          <LoadingDots />
        </div>
      </PortalLayout>
    );
  }

  return (
    <PortalLayout userRole="teacher" userName="Teacher">
      <header className={styles.header}>
        <h1>My Classes</h1>
        <p>Manage your classes and track student performance</p>
      </header>

      <div className={styles.classesGrid}>
        {classes.length > 0 ? (
          classes.map((classItem) => (
            <div key={classItem.id} className={styles.classCard}>
              <div className={styles.classHeader}>
                <div className={styles.classIcon}>
                  <Users size={24} />
                </div>
                <div className={styles.classTitleSection}>
                  <h3>{classItem.name}</h3>
                  <div className={styles.classMeta}>
                    <span className={styles.studentCount}>
                      <Users size={14} />
                      {classItem.totalStudents} Students
                    </span>
                    <span className={styles.scheduleInfo}>
                      <Clock size={14} />
                      {classItem.schedule}
                    </span>
                  </div>
                </div>
              </div>

              <div className={styles.performanceSection}>
                <div className={styles.performanceHeader}>
                  <span>Average Performance</span>
                  <span className={styles.performanceValue}>
                    {classItem.averagePerformance}%
                  </span>
                </div>
                <div className={styles.performanceBar}>
                  <div
                    className={styles.performanceFill}
                    style={{ width: `${classItem.averagePerformance}%` }}
                  />
                </div>
              </div>

              <div className={styles.classActions}>
                <button
                  className={styles.viewBtn}
                  onClick={() =>
                    router.push(`/portal/teacher/${id}/class/${classItem.id}`)
                  }
                >
                  View Details
                  <ArrowRight size={16} />
                </button>
                <button
                  className={styles.secondaryBtn}
                  onClick={() =>
                    router.push(
                      `/portal/teacher/${id}/attendance?class=${classItem.id}`
                    )
                  }
                >
                  Take Attendance
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.emptyState}>
            <Users size={48} />
            <h3>No classes assigned</h3>
            <p>Your classes will appear here once assigned.</p>
          </div>
        )}
      </div>
    </PortalLayout>
  );
};

export default TeacherClass;
