import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import PortalLayout from '../../../../components/PortalLayout/PortalLayout';
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
import { apiServices } from '../../../../services/api';
// import {
//   STUDENT_EXAM_STATUS,
// } from '../../../../lib/constants';
import {
  formatDateForStudent,
  getExamStatusClass,
} from '../../../../lib/helpers';
import { StudentExam } from '../../../../lib/types';

const StudentExams = () => {
  const router = useRouter();
  const { id } = router.query;
  const [exams, setExams] = useState<StudentExam[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>('all');
  const { addNotification } = useNotification();

  useEffect(() => {
    const loadExams = async () => {
      if (id) {
        try {
          const response = await apiServices.exams.getAll();
          if (response.success && response.data) {
            const examsData = Array.isArray(response.data) ? response.data : [];
            setExams(examsData);
          } else {
            setExams([]);
            addNotification({
              type: 'error',
              title: 'Failed to load exams',
              message: 'Please try again later.',
            });
          }
        } catch (error) {
          addNotification({
            type: 'error',
            title: 'Error loading exams',
            message: 'Please try again later.',
          });
          setExams([]);
        } finally {
          setLoading(false);
        }
      }
    };
    loadExams();
  }, [id]);

  const filteredExams =
    filterType === 'all'
      ? exams
      : exams.filter((exam) => exam.status === filterType);

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
        <h1>Exams</h1>
        <p>View and manage your exam schedule</p>
      </header>

      <div className={styles.filterContainer}>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="all">All Exams</option>
          <option value="upcoming">Upcoming</option>
          <option value="completed">Completed</option>
          <option value="missed">Missed</option>
        </select>
      </div>

      <div className={styles.examsGrid}>
        {filteredExams.length > 0 ? (
          filteredExams.map((exam) => (
            <div key={exam.id} className={styles.examCard}>
              <div className={styles.examHeader}>
                <div>
                  <h3 className={styles.examTitle}>{exam.title}</h3>
                  <span className={styles.subjectBadge}>{exam.subject}</span>
                </div>
                <span
                  className={`${styles.statusBadge} ${
                    styles[getExamStatusClass(exam.status)]
                  }`}
                >
                  {exam.status === 'upcoming' && <Clock size={14} />}
                  {exam.status === 'completed' && <CheckCircle size={14} />}
                  {exam.status === 'missed' && <AlertCircle size={14} />}
                  {exam.status.charAt(0).toUpperCase() + exam.status.slice(1)}
                </span>
              </div>

              <div className={styles.examMeta}>
                <div className={styles.examDate}>
                  <Calendar size={14} />
                  Date: {formatDateForStudent(exam.date)}
                </div>
                {exam.duration && (
                  <div className={styles.examDuration}>
                    <Clock size={14} />
                    Duration: {exam.duration} minutes
                  </div>
                )}
                {exam.maxMarks && (
                  <div className={styles.examMarks}>
                    <FileText size={14} />
                    Max Marks: {exam.maxMarks}
                  </div>
                )}
              </div>

              {exam.grade && (
                <div className={styles.examGrade}>
                  <strong>Grade: {exam.grade}</strong>
                  {exam.result && (
                    <span
                      className={`${styles.resultBadge} ${
                        exam.result === 'pass' ? styles.pass : styles.fail
                      }`}
                    >
                      {exam.result.toUpperCase()}
                    </span>
                  )}
                </div>
              )}

              {exam.feedback && (
                <div className={styles.examFeedback}>
                  <p>{exam.feedback}</p>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className={styles.noExams}>
            <p>No exams found for the selected filter.</p>
          </div>
        )}
      </div>
    </PortalLayout>
  );
};

export default StudentExams;
