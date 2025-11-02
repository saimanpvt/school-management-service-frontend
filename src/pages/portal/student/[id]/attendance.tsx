import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import styles from './attendance.module.css';
import Sidebar from '../../../../components/Sidebar';
import { teacherService, Class } from '../../../../services/teacher.service';

interface StudentAttendance {
    id: string;
    name: string;
    present: boolean;
}

interface ClassWithStudents extends Class {
    students: StudentAttendance[];
}

const AttendancePage = () => {
    const router = useRouter();
    const { id } = router.query;
    const [classes, setClasses] = useState<ClassWithStudents[]>([]);
    const [selectedClass, setSelectedClass] = useState<string>('');
    const [attendance, setAttendance] = useState<{ [key: string]: boolean }>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [teacherName, setTeacherName] = useState('');

    const loadData = useCallback(async () => {
        try {
            setLoading(true);
            const [classesResponse, dashboardData] = await Promise.all([
                teacherService.getClasses(id as string),
                teacherService.getDashboardStats(id as string)
            ]);

            // Transform classes to include student data
            const classesWithStudents = classesResponse.map(cls => ({
                ...cls,
                students: [] // You would fetch students for each class here
            }));

            setClasses(classesWithStudents);
            setTeacherName(dashboardData.teacherName);

            if (classesResponse.length > 0) {
                setSelectedClass(classesResponse[0].id);
            }
        } catch (err) {
            setError('Failed to load data');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        if (id) {
            loadData();
        }
    }, [id, loadData]);

    const handleAttendanceChange = (studentId: string, present: boolean) => {
        setAttendance(prev => ({
            ...prev,
            [studentId]: present
        }));
    };

    const handleSubmit = async () => {
        if (!selectedClass) return;

        try {
            setSaving(true);
            await teacherService.submitAttendance(id as string, selectedClass, attendance);
            window.location.href = `/dashboard/teacher/${id}`;
        } catch (err) {
            setError('Failed to submit attendance');
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    const selectedClassData = classes.find(c => c.id === selectedClass);

    return (
        <div className={styles.container}>
            <Sidebar name={teacherName} role="teacher" />
            <main className={styles.main}>
                {loading ? (
                    <div className={styles.loading}>Loading...</div>
                ) : error ? (
                    <div className={styles.error}>{error}</div>
                ) : (
                    <>
                        <header className={styles.header}>
                            <h1>Take Attendance</h1>
                            <select
                                value={selectedClass}
                                onChange={(e) => setSelectedClass(e.target.value)}
                                className={styles.classSelect}
                            >
                                {classes.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </header>

                        <div className={styles.attendanceGrid}>
                            {selectedClassData?.students.map(student => (
                                <div key={student.id} className={styles.studentCard}>
                                    <span className={styles.studentName}>{student.name}</span>
                                    <div className={styles.attendanceButtons}>
                                        <button
                                            className={`${styles.button} ${attendance[student.id] ? styles.selected : ''}`}
                                            onClick={() => handleAttendanceChange(student.id, true)}
                                        >
                                            Present
                                        </button>
                                        <button
                                            className={`${styles.button} ${attendance[student.id] === false ? styles.selected : ''}`}
                                            onClick={() => handleAttendanceChange(student.id, false)}
                                        >
                                            Absent
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className={styles.actions}>
                            <button
                                className={styles.submitButton}
                                onClick={handleSubmit}
                                disabled={saving}
                            >
                                {saving ? 'Submitting...' : 'Submit Attendance'}
                            </button>
                            <button
                                className={styles.cancelButton}
                                onClick={() => window.location.href = `/dashboard/teacher/${id}`}
                                disabled={saving}
                            >
                                Cancel
                            </button>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
};

export default AttendancePage;