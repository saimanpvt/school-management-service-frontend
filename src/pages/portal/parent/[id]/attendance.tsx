import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import PortalLayout from '../../../../components/PortalLayout/PortalLayout';
import { CalendarDays, CheckCircle, XCircle, Clock } from 'lucide-react';
import styles from './parent.module.css';
import LoadingDots from '../../../../components/LoadingDots/LoadingDots';
import { useNotification } from '../../../../components/Toaster/Toaster';
import { apiServices } from '../../../../services/api';
import {
  PARENT_ATTENDANCE_STATUS,
  PARENT_FILTER_OPTIONS,
} from '../../../../lib/constants';
import {
  formatDateForParent,
  getParentAttendanceStatusClass,
  calculateParentAttendanceStats,
} from '../../../../lib/helpers';
import {
  ParentAttendance as ParentAttendanceType,
  ParentChild,
} from '../../../../lib/types';

const ParentAttendance = () => {
  const router = useRouter();
  const { id } = router.query;
  const [attendance, setAttendance] = useState<ParentAttendanceType[]>([]);
  const [children, setChildren] = useState<ParentChild[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedChild, setSelectedChild] = useState<string>(
    PARENT_FILTER_OPTIONS.ALL_CHILDREN
  );
  const { addNotification } = useNotification();

  useEffect(() => {
    const loadAttendanceData = async () => {
      if (id) {
        try {
          setLoading(true);

          // Load children data first
          const childrenResponse = {
            success: false,
            data: null,
          };
          if (childrenResponse?.success && childrenResponse.data) {
            setChildren(childrenResponse.data);
          }

          // Load attendance data
          const attendanceResponse = {
            success: false,
            data: null,
          };
          if (attendanceResponse?.success && attendanceResponse.data) {
            setAttendance(attendanceResponse.data);
          } else {
            setAttendance([]);
            addNotification({
              type: 'info',
              title: 'No attendance data found',
              message: 'Attendance records will appear here once available.',
            });
          }
        } catch (error) {
          console.error('Error loading attendance data:', error);
          addNotification({
            type: 'error',
            title: 'Failed to load attendance data',
            message: 'Please try again later.',
          });
        } finally {
          setLoading(false);
        }
      }
    };

    loadAttendanceData();
  }, [id, addNotification]);

  // Get unique children from attendance data
  const childrenFromAttendance = Array.from(
    new Set(attendance.map((a) => ({ id: a.childId, name: a.childName })))
  );

  const filteredAttendance =
    selectedChild === PARENT_FILTER_OPTIONS.ALL_CHILDREN
      ? attendance
      : attendance.filter((a) => a.childId === selectedChild);

  // Calculate attendance statistics using helper function
  const stats = calculateParentAttendanceStats(
    filteredAttendance,
    PARENT_ATTENDANCE_STATUS
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case PARENT_ATTENDANCE_STATUS.PRESENT:
        return <CheckCircle size={18} />;
      case PARENT_ATTENDANCE_STATUS.ABSENT:
        return <XCircle size={18} />;
      case PARENT_ATTENDANCE_STATUS.LATE:
        return <Clock size={18} />;
      case PARENT_ATTENDANCE_STATUS.EXCUSED:
        return <CheckCircle size={18} />;
      default:
        return <Clock size={18} />;
    }
  };

  if (loading) {
    return (
      <PortalLayout userRole="parent" userName="Parent">
        <div className={styles.loading}>
          <LoadingDots />
        </div>
      </PortalLayout>
    );
  }

  return (
    <PortalLayout userRole="parent" userName="Parent">
      <header className={styles.header}>
        <div>
          <h1>Children&apos;s Attendance</h1>
          <p>Track your children&apos;s attendance records</p>
        </div>
        {childrenFromAttendance.length > 1 && (
          <select
            value={selectedChild}
            onChange={(e) => setSelectedChild(e.target.value)}
            className={styles.childSelect}
          >
            <option value={PARENT_FILTER_OPTIONS.ALL_CHILDREN}>
              All Children
            </option>
            {childrenFromAttendance.map((child) => (
              <option key={child.id} value={child.id}>
                {child.name}
              </option>
            ))}
          </select>
        )}
      </header>

      <div className={styles.statsGrid}>
        <div className={styles.statsCard}>
          <h3>📚 Total Classes</h3>
          <p className={styles.statNumber}>{stats.total}</p>
        </div>
        <div className={styles.statsCard}>
          <h3>✅ Present</h3>
          <p className={styles.statNumber} style={{ color: '#059669' }}>
            {stats.present}
          </p>
        </div>
        <div className={styles.statsCard}>
          <h3>❌ Absent</h3>
          <p className={styles.statNumber} style={{ color: '#dc2626' }}>
            {stats.absent}
          </p>
        </div>
        <div className={styles.statsCard}>
          <h3>⏰ Late</h3>
          <p className={styles.statNumber} style={{ color: '#f59e0b' }}>
            {stats.late}
          </p>
        </div>
        <div className={styles.statsCard}>
          <h3>📋 Excused</h3>
          <p className={styles.statNumber} style={{ color: '#6366f1' }}>
            {stats.excused}
          </p>
        </div>
        <div className={styles.statsCard}>
          <h3>📊 Attendance %</h3>
          <p className={styles.statNumber} style={{ color: '#10b981' }}>
            {stats.percentage}%
          </p>
        </div>
      </div>

      <div className={styles.attendanceContainer}>
        {filteredAttendance.length > 0 ? (
          filteredAttendance.map((record) => (
            <div key={record.id} className={styles.attendanceCard}>
              <div className={styles.attendanceHeader}>
                <div className={styles.dateSection}>
                  <CalendarDays size={18} />
                  <span>{formatDateForParent(record.date)}</span>
                </div>
                <span
                  className={`${styles.attendanceStatus} ${
                    styles[getParentAttendanceStatusClass(record.status)]
                  }`}
                >
                  {getStatusIcon(record.status)}
                  {record.status.charAt(0).toUpperCase() +
                    record.status.slice(1)}
                </span>
              </div>
              <div className={styles.attendanceInfo}>
                <div className={styles.childInfo}>
                  <strong>{record.childName}</strong>
                  {record.className && (
                    <span className={styles.className}>
                      • {record.className}
                    </span>
                  )}
                </div>
                <div className={styles.courseInfo}>
                  <span>{record.subject}</span>
                  <span style={{ color: '#64748b' }}>• {record.teacher}</span>
                </div>
                {record.notes && (
                  <div className={styles.recordNotes}>
                    <span>📝 {record.notes}</span>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className={styles.emptyState}>
            <CalendarDays size={48} />
            <h3>No attendance records</h3>
            <p>Attendance records will appear here</p>
          </div>
        )}
      </div>
    </PortalLayout>
  );
};

export default ParentAttendance;
