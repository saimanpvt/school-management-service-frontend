import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import PortalLayout from '../../../../components/PortalLayout';
import { parentService } from '../../../../services/parent.service';
import { CalendarDays, CheckCircle, XCircle, TrendingUp } from 'lucide-react';
import styles from './parent.module.css';

interface AttendanceRecord {
  id: string;
  date: string;
  childId: string;
  childName: string;
  status: 'present' | 'absent' | 'late';
  course: string;
  teacher: string;
}

const ParentAttendance = () => {
  const router = useRouter();
  const { id } = router.query;
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedChild, setSelectedChild] = useState<string>('all');

  useEffect(() => {
    if (id) {
      // Mock data - replace with actual API call
      setTimeout(() => {
        const mockData: AttendanceRecord[] = [
          {
            id: '1',
            date: '2024-01-15',
            childId: 'c1',
            childName: 'John Doe',
            status: 'present',
            course: 'Mathematics',
            teacher: 'Mr. Smith',
          },
          {
            id: '2',
            date: '2024-01-16',
            childId: 'c1',
            childName: 'John Doe',
            status: 'present',
            course: 'Science',
            teacher: 'Ms. Johnson',
          },
          {
            id: '3',
            date: '2024-01-17',
            childId: 'c1',
            childName: 'John Doe',
            status: 'late',
            course: 'English',
            teacher: 'Mr. Brown',
          },
          {
            id: '4',
            date: '2024-01-18',
            childId: 'c1',
            childName: 'John Doe',
            status: 'absent',
            course: 'History',
            teacher: 'Ms. Davis',
          },
        ];
        setAttendance(mockData);
        setLoading(false);
      }, 1000);
    }
  }, [id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const children = Array.from(
    new Set(attendance.map((a) => ({ id: a.childId, name: a.childName })))
  );
  const filteredAttendance =
    selectedChild === 'all'
      ? attendance
      : attendance.filter((a) => a.childId === selectedChild);

  const calculateStats = () => {
    const total = filteredAttendance.length;
    const present = filteredAttendance.filter(
      (a) => a.status === 'present'
    ).length;
    const absent = filteredAttendance.filter(
      (a) => a.status === 'absent'
    ).length;
    const late = filteredAttendance.filter((a) => a.status === 'late').length;
    return {
      total,
      present,
      absent,
      late,
      percentage: total > 0 ? ((present / total) * 100).toFixed(1) : 0,
    };
  };

  const stats = calculateStats();

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

      <div className={styles.statsGrid}>
        <div className={styles.statsCard}>
          <h3>Total Classes</h3>
          <p className={styles.statNumber}>{stats.total}</p>
        </div>
        <div className={styles.statsCard}>
          <h3>Present</h3>
          <p className={styles.statNumber} style={{ color: '#059669' }}>
            {stats.present}
          </p>
        </div>
        <div className={styles.statsCard}>
          <h3>Absent</h3>
          <p className={styles.statNumber} style={{ color: '#dc2626' }}>
            {stats.absent}
          </p>
        </div>
        <div className={styles.statsCard}>
          <h3>Attendance %</h3>
          <p className={styles.statNumber} style={{ color: '#6366f1' }}>
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
                  <span>{formatDate(record.date)}</span>
                </div>
                <span
                  className={`${styles.attendanceStatus} ${
                    styles[record.status]
                  }`}
                >
                  {record.status === 'present' && <CheckCircle size={14} />}
                  {record.status === 'absent' && <XCircle size={14} />}
                  {record.status === 'late' && <TrendingUp size={14} />}
                  {record.status.charAt(0).toUpperCase() +
                    record.status.slice(1)}
                </span>
              </div>
              <div className={styles.attendanceInfo}>
                <div className={styles.childInfo}>
                  <strong>{record.childName}</strong>
                </div>
                <div className={styles.courseInfo}>
                  <span>{record.course}</span>
                  <span style={{ color: '#64748b' }}>• {record.teacher}</span>
                </div>
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
