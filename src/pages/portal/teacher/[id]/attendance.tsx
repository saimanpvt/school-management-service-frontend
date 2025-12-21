import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import PortalLayout from '../../../../components/PortalLayout/PortalLayout';
import { apiServices } from '../../../../services/api';
import { Users, CheckCircle, XCircle, Clock, Save } from 'lucide-react';
import styles from './teacher.module.css';
import LoadingDots from '../../../../components/LoadingDots/LoadingDots';
import { TEACHER_ATTENDANCE_STATUS } from '../../../../lib/constants';
import { TeacherAttendanceStudent } from '../../../../lib/types';
import { useNotification } from '../../../../components/Toaster';

const TeacherAttendance = () => {
  const router = useRouter();
  const { id } = router.query;
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [students, setStudents] = useState<TeacherAttendanceStudent[]>([]);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const { addNotification } = useNotification();

  useEffect(() => {
    const loadClasses = async () => {
      if (id) {
        try {
          // Use unified classes API - backend filters for teacher
          const response = await apiServices.classes.getAll();
          if (response.success && response.data) {
            setClasses(response.data);
            if (response.data.length > 0) {
              setSelectedClass(response.data[0].id);
            }
          }
        } catch (error) {
          addNotification({
            type: 'error',
            title: 'Failed to delete assignment',
            message: 'Please try again later.',
          });
        } finally {
          setLoading(false);
        }
      }
    };
    loadClasses();
  }, [id]);

  useEffect(() => {
    const loadStudents = async () => {
      if (selectedClass) {
        try {
          // Use unified users API to get students
          const response = await apiServices.users.getAll();
          if (response.success && response.data) {
            setStudents(response.data);
            // Initialize attendance records
            const initialAttendance = response.data.map((student: Student) => ({
              studentId: student.id,
              status: 'PRESENT' as keyof typeof TEACHER_ATTENDANCE_STATUS,
            }));
            setAttendance(initialAttendance);
          }
        } catch (error) {
          addNotification({
            type: 'error',
            title: 'Failed to delete attendance',
            message: 'Please try again later.',
          });
        }
      }
    };
    loadStudents();
  }, [selectedClass]);

  const updateAttendance = (
    studentId: string,
    status: keyof typeof TEACHER_ATTENDANCE_STATUS
  ) => {
    setAttendance((prev) =>
      prev.map((record) =>
        record.studentId === studentId ? { ...record, status } : record
      )
    );
  };

  const saveAttendance = async () => {
    if (!selectedClass || attendance.length === 0) return;

    setSaving(true);
    try {
      await apiServices.attendance?.mark({
        classId: selectedClass,
        date: selectedDate,
        attendance,
      });
      addNotification({
        type: 'success',
        title: 'Attendance saved successfully!',
        message: 'Student attendance has been recorded.',
      });
    } catch (error) {
      console.error('Error saving attendance:', error);
      addNotification({
        type: 'error',
        title: 'Failed to save attendance',
        message: 'Please try again later.',
      });
    } finally {
      setSaving(false);
    }
  };

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
      <div className={styles.pageContainer}>
        <header className={styles.pageHeader}>
          <div className={styles.headerContent}>
            <h1>Take Attendance</h1>
            <p>Mark student attendance for your classes</p>
          </div>
          <div className={styles.headerActions}>
            <div className={styles.dateContainer}>
              <input
                id="attendance-date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className={styles.dateInput}
              />
            </div>
            <button
              onClick={saveAttendance}
              disabled={saving || attendance.length === 0}
              className={`${styles.saveBtn} ${saving ? styles.saving : ''}`}
            >
              <Save size={16} />
              {saving ? 'Saving...' : 'Save Attendance'}
            </button>
          </div>
        </header>

        <div className={styles.controlsSection}>
          <div className={styles.classSelector}>
            <label htmlFor="class-select" className={styles.selectorLabel}>
              <Users size={18} />
              Select Class:
            </label>
            <select
              id="class-select"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className={styles.selectInput}
            >
              <option value="">Choose a class</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name} ({cls.code})
                </option>
              ))}
            </select>
          </div>
        </div>

        {students.length > 0 ? (
          <div className={styles.attendanceList}>
            {students.map((student) => {
              const attendanceRecord = attendance.find(
                (record) => record.studentId === student.id
              );
              return (
                <div key={student.id} className={styles.studentCard}>
                  <div className={styles.studentInfo}>
                    <div className={styles.studentAvatar}>
                      {student.profileImage ? (
                        <img
                          src={student.profileImage}
                          alt={student.name}
                          className={styles.avatarImage}
                        />
                      ) : (
                        <div className={styles.avatarPlaceholder}>
                          <Users size={24} />
                        </div>
                      )}
                    </div>
                    <div className={styles.studentDetails}>
                      <h4 className={styles.studentName}>{student.name}</h4>
                      <p className={styles.studentRoll}>
                        Roll No: {student.rollNumber}
                      </p>
                    </div>
                  </div>
                  <div className={styles.attendanceButtons}>
                    <button
                      className={`${styles.attendanceBtn} ${
                        styles.presentBtn
                      } ${
                        attendanceRecord?.status === 'present'
                          ? styles.active
                          : ''
                      }`}
                      onClick={() => updateAttendance(student.id, 'present')}
                    >
                      <CheckCircle size={16} />
                      <span>Present</span>
                    </button>
                    <button
                      className={`${styles.attendanceBtn} ${styles.lateBtn} ${
                        attendanceRecord?.status === 'late' ? styles.active : ''
                      }`}
                      onClick={() => updateAttendance(student.id, 'late')}
                    >
                      <Clock size={16} />
                      <span>Late</span>
                    </button>
                    <button
                      className={`${styles.attendanceBtn} ${styles.absentBtn} ${
                        attendanceRecord?.status === 'absent'
                          ? styles.active
                          : ''
                      }`}
                      onClick={() => updateAttendance(student.id, 'absent')}
                    >
                      <XCircle size={16} />
                      <span>Absent</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <Users size={48} />
            <h3>No students found</h3>
            <p>Select a class to view students</p>
          </div>
        )}
      </div>
    </PortalLayout>
  );
};

export default TeacherAttendance;
