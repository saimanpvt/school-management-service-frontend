import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import PortalLayout from '../../../../components/PortalLayout/PortalLayout';
import { FileText, Calendar, Clock, TrendingUp } from 'lucide-react';
import styles from './parent.module.css';
import LoadingDots from '../../../../components/LoadingDots/LoadingDots';

interface Exam {
  id: string;
  title: string;
  subject: string;
  childId: string;
  childName: string;
  date: string;
  time: string;
  duration: string;
  location: string;
  status: 'upcoming' | 'completed';
  grade?: string;
}

const ParentExams = () => {
  const router = useRouter();
  const { id } = router.query;
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedChild, setSelectedChild] = useState<string>('all');

  useEffect(() => {
    if (id) {
      // Mock data - replace with actual API call
      setTimeout(() => {
        const mockData: Exam[] = [
          {
            id: '1',
            title: 'Mathematics Midterm',
            subject: 'Mathematics',
            childId: 'c1',
            childName: 'John Doe',
            date: '2024-02-15',
            time: '09:00 AM',
            duration: '2 hours',
            location: 'Hall A',
            status: 'upcoming',
          },
          {
            id: '2',
            title: 'Science Final',
            subject: 'Science',
            childId: 'c1',
            childName: 'John Doe',
            date: '2024-01-20',
            time: '10:00 AM',
            duration: '3 hours',
            location: 'Hall B',
            status: 'completed',
            grade: 'A',
          },
        ];
        setExams(mockData);
        setLoading(false);
      }, 1000);
    }
  }, [id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const children = Array.from(
    new Set(exams.map((e) => ({ id: e.childId, name: e.childName })))
  );
  const filteredExams =
    selectedChild === 'all'
      ? exams
      : exams.filter((e) => e.childId === selectedChild);

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
          {children.length > 1 && (
            <select
              value={selectedChild}
              onChange={(e) => setSelectedChild(e.target.value)}
              className={styles.childSelect}
            >
              <option value="all">All Children</option>
              {children.map((child) => (
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
                    <span>{formatDate(exam.date)}</span>
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
                {selectedChild !== 'all'
                  ? 'No exams for this child'
                  : 'No exams scheduled'}
              </p>
            </div>
          )}
        </div>
      </div>
    </PortalLayout>
  );
};

export default ParentExams;
