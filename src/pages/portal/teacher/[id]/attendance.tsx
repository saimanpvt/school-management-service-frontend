import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import PortalLayout from '../../../../components/PortalLayout/PortalLayout';
import { apiServices } from '../../../../services/api';
import {
  Users,
  CheckCircle,
  XCircle,
  Clock,
  Save,
} from 'lucide-react';
import styles from './teacher.module.css';
import LoadingDots from '../../../../components/LoadingDots/LoadingDots';
import {
  TEACHER_ATTENDANCE_STATUS,
} from '../../../../lib/constants';
import {
  TeacherAttendanceStudent,
} from '../../../../lib/types';
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
          console.error('Error fetching classes:', error);
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
          console.error('Error fetching students:', error);
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
      addNotification('Attendance saved successfully!', 'success');
    } catch (error) {
      console.error('Error saving attendance:', error);
      addNotification('Failed to save attendance. Please try again.', 'error');
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
      <div className={styles.container}>
        <header className={styles.header}>
          <div>
            <h1>Take Attendance</h1>
            <p>Mark student attendance for your classes</p>
          </div>
          <div className={styles.headerActions}>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className={styles.dateInput}
            />
            <button
              onClick={saveAttendance}
              disabled={saving || attendance.length === 0}
              className={styles.saveBtn}
            >
              <Save size={16} />
              {saving ? 'Saving...' : 'Save Attendance'}
            </button>
          </div>
        </header>

        <div className={styles.classSelector}>
          <label htmlFor="class-select">Select Class:</label>
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
                        <img src={student.profileImage} alt={student.name} />
                      ) : (
                        <Users size={24} />
                      )}
                    </div>
                    <div>
                      <h4>{student.name}</h4>
                      <p>Roll: {student.rollNumber}</p>
                    </div>
                  </div>
                  <div className={styles.attendanceButtons}>
                    <button
                      className={`${styles.attendanceBtn} ${attendanceRecord?.status === 'present'
                        ? styles.active
                        : ''
                        }`}
                      onClick={() => updateAttendance(student.id, 'present')}
                    >
                      <CheckCircle size={16} />
                      Present
                    </button>
                    <button
                      className={`${styles.attendanceBtn} ${attendanceRecord?.status === 'late' ? styles.active : ''
                        }`}
                      onClick={() => updateAttendance(student.id, 'late')}
                    >
                      <Clock size={16} />
                      Late
                    </button>
                    <button
                      className={`${styles.attendanceBtn} ${attendanceRecord?.status === 'absent'
                        ? styles.active
                        : ''
                        }`}
                      onClick={() => updateAttendance(student.id, 'absent')}
                    >
                      <XCircle size={16} />
                      Absent
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
