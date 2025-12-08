import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import PortalLayout from '../../../../components/PortalLayout';
import {
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
  CalendarDays,
} from 'lucide-react';
import styles from './student.module.css';
import LoadingDots from '../../../../components/LoadingDots';

interface AttendanceRecord {
  id: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  course: string;
  teacher: string;
}

const StudentAttendance = () => {
  const router = useRouter();
  const { id } = router.query;
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCourse, setFilterCourse] = useState<string>('all');

  useEffect(() => {
    if (id) {
      // Mock data - replace with actual API call
      setTimeout(() => {
        const mockData: AttendanceRecord[] = [
          {
            id: '1',
            date: '2024-01-15',
            status: 'present',
            course: 'Mathematics',
            teacher: 'Mr. Smith',
          },
          {
            id: '2',
            date: '2024-01-16',
            status: 'present',
            course: 'Science',
            teacher: 'Ms. Johnson',
          },
          {
            id: '3',
            date: '2024-01-17',
            status: 'late',
            course: 'English',
            teacher: 'Mr. Brown',
          },
          {
            id: '4',
            date: '2024-01-18',
            status: 'absent',
            course: 'History',
            teacher: 'Ms. Davis',
          },
          {
            id: '5',
            date: '2024-01-19',
            status: 'present',
            course: 'Mathematics',
            teacher: 'Mr. Smith',
          },
        ];
        setAttendance(mockData);
        setLoading(false);
      }, 1000);
    }
  }, [id]);

  const courses = Array.from(new Set(attendance.map((a) => a.course)));
  const filteredAttendance =
    filterCourse === 'all'
      ? attendance
      : attendance.filter((a) => a.course === filterCourse);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present':
        return <CheckCircle size={18} />;
      case 'absent':
        return <XCircle size={18} />;
      case 'late':
        return <Clock size={18} />;
      default:
        return <Clock size={18} />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const calculateStats = () => {
    const total = attendance.length;
    const present = attendance.filter((a) => a.status === 'present').length;
    const absent = attendance.filter((a) => a.status === 'absent').length;
    const late = attendance.filter((a) => a.status === 'late').length;
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
      <PortalLayout userRole="student" userName="Student">
        <div className={styles.loading}>
          <LoadingDots />
        </div>
      </PortalLayout>
    );
  }

  return (
    <PortalLayout userRole="student" userId={id as string}>
      <header className={styles.pageHeader}>
        <h1>My Attendance</h1>
        <p>Track your attendance records across all courses</p>
      </header>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        <div
          className={styles.statCard}
          style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '1rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          }}
        >
          <div
            style={{
              color: '#64748b',
              fontSize: '0.875rem',
              marginBottom: '0.5rem',
            }}
          >
            Total Classes
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: '#6366f1' }}>
            {stats.total}
          </div>
        </div>
        <div
          className={styles.statCard}
          style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '1rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          }}
        >
          <div
            style={{
              color: '#64748b',
              fontSize: '0.875rem',
              marginBottom: '0.5rem',
            }}
          >
            Present
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: '#059669' }}>
            {stats.present}
          </div>
        </div>
        <div
          className={styles.statCard}
          style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '1rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          }}
        >
          <div
            style={{
              color: '#64748b',
              fontSize: '0.875rem',
              marginBottom: '0.5rem',
            }}
          >
            Absent
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: '#dc2626' }}>
            {stats.absent}
          </div>
        </div>
        <div
          className={styles.statCard}
          style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '1rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          }}
        >
          <div
            style={{
              color: '#64748b',
              fontSize: '0.875rem',
              marginBottom: '0.5rem',
            }}
          >
            Attendance %
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: '#6366f1' }}>
            {stats.percentage}%
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <select
          value={filterCourse}
          onChange={(e) => setFilterCourse(e.target.value)}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '0.5rem',
            border: '1px solid #e5e7eb',
            background: 'white',
            fontSize: '1rem',
            minWidth: '200px',
          }}
        >
          <option value="all">All Courses</option>
          {courses.map((course) => (
            <option key={course} value={course}>
              {course}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.attendanceGrid}>
        {filteredAttendance.length > 0 ? (
          filteredAttendance.map((record) => (
            <div key={record.id} className={styles.attendanceCard}>
              <div className={styles.attendanceHeader}>
                <div className={styles.attendanceDate}>
                  <CalendarDays size={18} style={{ marginRight: '0.5rem' }} />
                  {formatDate(record.date)}
                </div>
                <span
                  className={`${styles.attendanceStatus} ${
                    styles[record.status]
                  }`}
                >
                  {getStatusIcon(record.status)}
                  {record.status.charAt(0).toUpperCase() +
                    record.status.slice(1)}
                </span>
              </div>
              <div
                style={{
                  marginTop: '0.75rem',
                  paddingTop: '0.75rem',
                  borderTop: '1px solid #e5e7eb',
                }}
              >
                <div
                  style={{
                    fontWeight: 600,
                    color: '#111827',
                    marginBottom: '0.25rem',
                  }}
                >
                  {record.course}
                </div>
                <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
                  Teacher: {record.teacher}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.emptyState}>
            <CalendarDays size={48} />
            <h3>No attendance records</h3>
            <p>Your attendance records will appear here.</p>
          </div>
        )}
      </div>
    </PortalLayout>
  );
};

export default StudentAttendance;
