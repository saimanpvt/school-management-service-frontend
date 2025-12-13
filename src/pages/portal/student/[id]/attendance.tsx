import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import PortalLayout from '../../../../components/PortalLayout/PortalLayout';
import { Calendar, Clock, CheckCircle, XCircle } from 'lucide-react';
import styles from './student.module.css';
import LoadingDots from '../../../../components/LoadingDots/LoadingDots';
import { useNotification } from '../../../../components/Toaster/Toaster';
import { STUDENT_ATTENDANCE_STATUS } from '../../../../lib/constants';
import {
  formatDateForStudent,
  getAttendanceStatusClass,
} from '../../../../lib/helpers';
import { StudentAttendance as StudentAttendanceType } from '../../../../lib/types';

const StudentAttendance = () => {
  const router = useRouter();
  const { id } = router.query;
  const [attendance, setAttendance] = useState<StudentAttendanceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCourse, setFilterCourse] = useState<string>('all');
  const { addNotification } = useNotification();

  useEffect(() => {
    const loadAttendance = async () => {
      if (id) {
        try {
          const response = { success: true, data: [] }; // Replace with actual API when available
          if (response.success && response.data) {
            const attendanceData = Array.isArray(response.data)
              ? response.data
              : [];
            setAttendance(attendanceData);
          } else {
            setAttendance([]);
            addNotification({
              type: 'error',
              title: 'Failed to load attendance records',
              message: 'Please try again later.',
            });
          }
        } catch (error) {
          console.error('Error fetching attendance:', error);
          addNotification({
            type: 'error',
            title: 'Error loading attendance',
            message: 'Please try again later.',
          });
          setAttendance([]);
        } finally {
          setLoading(false);
        }
      }
    };
    loadAttendance();
  }, [id, addNotification]);

  const filteredAttendance =
    filterCourse === 'all'
      ? attendance
      : attendance.filter((record) => record.subject === filterCourse);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case STUDENT_ATTENDANCE_STATUS.PRESENT:
        return <CheckCircle size={18} />;
      case STUDENT_ATTENDANCE_STATUS.ABSENT:
        return <XCircle size={18} />;
      case STUDENT_ATTENDANCE_STATUS.LATE:
        return <Clock size={18} />;
      case STUDENT_ATTENDANCE_STATUS.EXCUSED:
        return <CheckCircle size={18} />;
      default:
        return <Clock size={18} />;
    }
  };

  const calculateStats = () => {
    const total = attendance.length;
    if (total === 0)
      return { present: 0, absent: 0, late: 0, excused: 0, percentage: 0 };

    const present = attendance.filter(
      (a) => a.status === STUDENT_ATTENDANCE_STATUS.PRESENT
    ).length;
    const absent = attendance.filter(
      (a) => a.status === STUDENT_ATTENDANCE_STATUS.ABSENT
    ).length;
    const late = attendance.filter(
      (a) => a.status === STUDENT_ATTENDANCE_STATUS.LATE
    ).length;
    const excused = attendance.filter(
      (a) => a.status === STUDENT_ATTENDANCE_STATUS.EXCUSED
    ).length;
    const percentage = Math.round((present / total) * 100);

    return { present, absent, late, excused, percentage };
  };

  const stats = calculateStats();
  const courses = Array.from(new Set(attendance.map((a) => a.subject)));

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
        <h1>My Attendance</h1>
        <p>Track your attendance across all subjects</p>
      </header>

      <div className={styles.attendanceStats}>
        <div className={styles.statCard}>
          <h3>📊 Overall Attendance Rate</h3>
          <div className={styles.percentage}>{stats.percentage}%</div>
          <p
            style={{
              color: '#64748b',
              fontSize: '0.875rem',
              margin: '0.5rem 0 1rem',
            }}
          >
            Out of {attendance.length} total classes
          </p>
          <div className={styles.statDetails}>
            <span className={styles.present}>✅ Present: {stats.present}</span>
            <span className={styles.absent}>❌ Absent: {stats.absent}</span>
            <span className={styles.late}>⏰ Late: {stats.late}</span>
            <span className={styles.excused}>📋 Excused: {stats.excused}</span>
          </div>
        </div>
      </div>

      <div className={styles.filterContainer}>
        <select
          value={filterCourse}
          onChange={(e) => setFilterCourse(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="all">All Subjects</option>
          {courses.map((course) => (
            <option key={course} value={course}>
              {course}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.attendanceList}>
        {filteredAttendance.length > 0 ? (
          filteredAttendance.map((record) => (
            <div key={record.id} className={styles.attendanceRecord}>
              <div className={styles.recordDate}>
                <Calendar size={16} />
                {formatDateForStudent(record.date)}
              </div>
              <div className={styles.recordSubject}>{record.subject}</div>
              <div className={styles.recordTeacher}>{record.teacher}</div>
              <div
                className={`${styles.recordStatus} ${
                  styles[getAttendanceStatusClass(record.status)]
                }`}
              >
                {getStatusIcon(record.status)}
                {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
              </div>
              {record.notes && (
                <div className={styles.recordNotes}>{record.notes}</div>
              )}
            </div>
          ))
        ) : (
          <div className={styles.noRecords}>
            <Calendar size={48} color="#94a3b8" />
            <h3>No Attendance Records</h3>
            <p>Your attendance records will appear here once classes begin.</p>
          </div>
        )}
      </div>
    </PortalLayout>
  );
};

export default StudentAttendance;
