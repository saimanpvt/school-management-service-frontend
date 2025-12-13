import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import PortalLayout from '../../../../components/PortalLayout/PortalLayout';
import { apiServices } from '../../../../services/api';
import {
  FileText,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import styles from './student.module.css';
import LoadingDots from '../../../../components/LoadingDots/LoadingDots';
import { useNotification } from '../../../../components/Toaster/Toaster';
import {
  formatDateForStudent,
  getAssignmentStatusClass,
  isAssignmentOverdue,
} from '../../../../lib/helpers';
import { StudentAssignment } from '../../../../lib/types';

const StudentAssignments = () => {
  const router = useRouter();
  const { id } = router.query;
  const [assignments, setAssignments] = useState<StudentAssignment[]>([]);
  const { addNotification } = useNotification();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAssignments = async () => {
      if (id) {
        try {
          // Use unified assignments API - backend filters for student
          const response = await apiServices.assignments.getAll();
          if (response.success && response.data) {
            setAssignments(response.data);
          }
        } catch (error) {
          addNotification({
            type: 'error',
            title: 'Error fetching assignments:',
            message: 'Please try again later.',
          });
        } finally {
          setLoading(false);
        }
      }
    };
    loadAssignments();
  }, [id]);

  if (loading) {
    return (
      <PortalLayout userRole="student" userName="Student">
        <div className={styles.loading}>
          <LoadingDots />
        </div>
      </PortalLayout>
    );
  }

  return (
    <PortalLayout userRole="student" userName="Student">
      <header className={styles.pageHeader}>
        <h1>My Assignments</h1>
        <p>Track and manage your assignments</p>
      </header>

      <div className={styles.assignmentsGrid}>
        {assignments.length > 0 ? (
          assignments.map((assignment) => {
            const overdue = isAssignmentOverdue(assignment.dueDate);
            return (
              <div key={assignment.id} className={styles.assignmentCard}>
                <div className={styles.assignmentHeader}>
                  <div>
                    <h3 className={styles.assignmentTitle}>
                      {assignment.title}
                    </h3>
                    <span className={styles.subjectBadge}>
                      {assignment.subject}
                    </span>
                  </div>
                </div>

                <div className={styles.assignmentMeta}>
                  <div className={styles.dueDate}>
                    <Calendar size={14} />
                    Due: {formatDateForStudent(assignment.dueDate)}
                    {overdue && (
                      <span className={styles.overdueText}>
                        <AlertCircle size={14} /> Overdue
                      </span>
                    )}
                  </div>
                  <div>
                    <span
                      className={`${styles.statusBadge} ${
                        styles[getAssignmentStatusClass(assignment.status)]
                      }`}
                    >
                      {assignment.status === 'pending' && <Clock size={14} />}
                      {assignment.status === 'submitted' && (
                        <CheckCircle size={14} />
                      )}
                      {assignment.status === 'graded' && (
                        <CheckCircle size={14} />
                      )}
                      {assignment.status.charAt(0).toUpperCase() +
                        assignment.status.slice(1)}
                    </span>
                  </div>
                  {assignment.grade && (
                    <div className={styles.assignmentGrade}>
                      Grade: {assignment.grade}
                    </div>
                  )}
                </div>

                <div className={styles.assignmentActions}>
                  {assignment.status === 'pending' && (
                    <button
                      className={`${styles.actionBtn} ${styles.primary}`}
                      onClick={() => {
                        const routerInstance = router as any;
                        routerInstance?.push(
                          `/portal/student/${id}/assignments/${assignment.id}`
                        );
                      }}
                    >
                      Submit Assignment
                    </button>
                  )}
                  <button
                    className={styles.actionBtn}
                    onClick={() => {
                      const routerInstance = router as any;
                      routerInstance?.push(
                        `/portal/student/${id}/assignments/${assignment.id}`
                      );
                    }}
                  >
                    View Details
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className={styles.emptyState}>
            <FileText size={48} />
            <h3>No assignments</h3>
            <p>You don't have any assignments at the moment.</p>
          </div>
        )}
      </div>
    </PortalLayout>
  );
};

export default StudentAssignments;
