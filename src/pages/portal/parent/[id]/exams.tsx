import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import PortalLayout from '../../../../components/PortalLayout/PortalLayout';
import { FileText, Calendar, Clock, TrendingUp, MapPin } from 'lucide-react';
import styles from './parent.module.css';
import LoadingDots from '../../../../components/LoadingDots/LoadingDots';
import { useNotification } from '../../../../components/Toaster/Toaster';
import { apiServices } from '../../../../services/api';
import { PARENT_FILTER_OPTIONS } from '../../../../lib/constants';
import { formatDateForParent } from '../../../../lib/helpers';
import { ParentChild, ParentExam } from '../../../../lib/types';

const ParentExams = () => {
  const router = useRouter();
  const { id } = router.query;
  const [exams, setExams] = useState<ParentExam[]>([]);
  const [children, setChildren] = useState<ParentChild[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedChild, setSelectedChild] = useState<string>(
    PARENT_FILTER_OPTIONS.ALL_CHILDREN
  );
  const { addNotification } = useNotification();

  useEffect(() => {
    const loadExamsData = async () => {
      if (id) {
        try {
          setLoading(true);

          // Load children data
          const childrenResponse = {
            success: false,
            data: null,
          };
          if (childrenResponse?.success && childrenResponse.data) {
            setChildren(childrenResponse.data);
          }

          // Load exams data
          const examsResponse = {
            success: false,
            data: null,
          };
          if (examsResponse?.success && examsResponse.data) {
            setExams(examsResponse.data);
          } else {
            setExams([]);
            addNotification({
              type: 'info',
              title: 'No exam data found',
              message: 'Exam schedules will appear here once available.',
            });
          }
        } catch (error) {
          console.error('Error loading exams data:', error);
          addNotification({
            type: 'error',
            title: 'Failed to load exam data',
            message: 'Please try again later.',
          });
        } finally {
          setLoading(false);
        }
      }
    };

    loadExamsData();
  }, [id, addNotification]);

  // Get unique children from exams data for filtering
  const childrenFromExams = Array.from(
    new Set(exams.map((e) => ({ id: e.childId, name: e.childName })))
  );

  const filteredExams =
    selectedChild === PARENT_FILTER_OPTIONS.ALL_CHILDREN
      ? exams
      : exams.filter((e) => e.childId === selectedChild);

  // Use all children (from state) or fallback to children from exams
  const availableChildren = children.length > 0 ? children : childrenFromExams;

  if (loading) {
    return (
      <PortalLayout userName="Parent" userRole="parent">
        <div className={styles.loading}>
          <LoadingDots />
        </div>
      </PortalLayout>
    );
  }

  return (
    <PortalLayout userName="Parent" userRole="parent">
      <div className={styles.main}>
        <header className={styles.header}>
          <div>
            <h1>Children&apos;s Exams</h1>
            <p>View exam schedules and results for your children</p>
          </div>
          {availableChildren.length > 1 && (
            <select
              value={selectedChild}
              onChange={(e) => setSelectedChild(e.target.value)}
              className={styles.childSelect}
            >
              <option value={PARENT_FILTER_OPTIONS.ALL_CHILDREN}>
                All Children
              </option>
              {availableChildren.map((child) => (
                <option key={child.id} value={child.id}>
                  {child.name}
                </option>
              ))}
            </select>
          )}
        </header>

        <div className={styles.examsContainer}>
          {filteredExams.length > 0 ? (
            filteredExams.map((exam) => (
              <div key={exam.id} className={styles.examCard}>
                <div className={styles.examHeader}>
                  <div className={styles.examIcon}>
                    <FileText size={24} />
                  </div>
                  <div className={styles.examTitleSection}>
                    <h3>{exam.title}</h3>
                    <div className={styles.examMeta}>
                      <span className={styles.childName}>{exam.childName}</span>
                      <span className={styles.subjectBadge}>
                        {exam.subject}
                      </span>
                      <span
                        className={`${styles.statusBadge} ${
                          styles[exam.status]
                        }`}
                      >
                        {exam.status.charAt(0).toUpperCase() +
                          exam.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className={styles.examDetails}>
                  <div className={styles.examDetailItem}>
                    <Calendar size={16} />
                    <span>{formatDateForParent(exam.date)}</span>
                  </div>
                  <div className={styles.examDetailItem}>
                    <Clock size={16} />
                    <span>
                      {exam.time} ({exam.duration})
                    </span>
                  </div>
                  <div className={styles.examDetailItem}>
                    <MapPin size={16} />
                    <span>{exam.location}</span>
                  </div>
                </div>
                {exam.grade && (
                  <div className={styles.gradeSection}>
                    <TrendingUp size={16} />
                    <span>
                      Grade: <strong>{exam.grade}</strong>
                    </span>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className={styles.emptyState}>
              <FileText size={48} />
              <h3>No exams found</h3>
              <p>
                {selectedChild !== PARENT_FILTER_OPTIONS.ALL_CHILDREN
                  ? 'No exams scheduled for this child'
                  : 'No exams scheduled for any children'}
              </p>
            </div>
          )}
        </div>
      </div>
    </PortalLayout>
  );
};

export default ParentExams;
