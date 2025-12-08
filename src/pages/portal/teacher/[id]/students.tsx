import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import PortalLayout from '../../../../components/PortalLayout';
import LoadingDots from '../../../../components/LoadingDots';
import { apiServices } from '../../../../services/api';
import { Users, Mail, Phone, Search } from 'lucide-react';
import styles from './teacher.module.css';

interface Student {
    id: string;
    name: string;
    email: string;
    phone?: string;
    grade: string;
    rollNumber: string;
    attendance: number;
    averageGrade: number;
}

const TeacherStudents = () => {
    const router = useRouter();
    const { id } = router.query;
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const loadStudents = async () => {
            if (id) {
                try {
                    const classesResponse = await apiServices.teacher.getTeacherClasses(id as string);
                    if (classesResponse.success && classesResponse.data) {
                        let allStudents: Student[] = [];
                        for (const cls of classesResponse.data) {
                            const studentsResponse = await apiServices.teacher.getStudentsByClass(cls.id);
                            if (studentsResponse.success && studentsResponse.data) {
                                allStudents = [...allStudents, ...studentsResponse.data];
                            }
                        }
                        // Remove duplicates based on student ID
                        const uniqueStudents = allStudents.filter((student, index, self) =>
                            index === self.findIndex(s => s.id === student.id)
                        );
                        setStudents(uniqueStudents);
                    }
                } catch (error) {
                    console.error('Error fetching students:', error);
                } finally {
                    setLoading(false);
                }
            }
        };
        loadStudents();
    }, [id]);

    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <PortalLayout userName="Teacher" userRole="teacher">
                <div className={styles.loading}><LoadingDots /></div>
            </PortalLayout>
        );
    }

    return (
        <PortalLayout userName="Teacher" userRole="teacher">
            <header className={styles.header}>
                <div>
                    <h1>My Students</h1>
                    <p>View and manage your students</p>
                </div>
                <div className={styles.searchBox}>
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Search students..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={styles.searchInput}
                    />
                </div>
            </header>

            <div className={styles.studentsGrid}>
                {filteredStudents.length > 0 ? (
                    filteredStudents.map(student => (
                        <div key={student.id} className={styles.studentCard}>
                            <div className={styles.studentAvatar}>
                                {student.name.charAt(0).toUpperCase()}
                            </div>
                            <div className={styles.studentInfo}>
                                <h3>{student.name}</h3>
                                <div className={styles.studentMeta}>
                                    <span>Roll #: {student.rollNumber}</span>
                                    <span>Grade: {student.grade}</span>
                                </div>
                                <div className={styles.studentContact}>
                                    {student.email && (
                                        <span className={styles.contactItem}>
                                            <Mail size={14} />
                                            {student.email}
                                        </span>
                                    )}
                                    {student.phone && (
                                        <span className={styles.contactItem}>
                                            <Phone size={14} />
                                            {student.phone}
                                        </span>
                                    )}
                                </div>
                                <div className={styles.studentStats}>
                                    <div className={styles.statItem}>
                                        <span className={styles.statLabel}>Attendance</span>
                                        <span className={styles.statValue}>{student.attendance}%</span>
                                    </div>
                                    <div className={styles.statItem}>
                                        <span className={styles.statLabel}>Average Grade</span>
                                        <span className={styles.statValue}>{student.averageGrade.toFixed(1)}%</span>
                                    </div>
                                </div>
                                <button
                                    className={styles.viewProfileBtn}
                                    onClick={() => router.push(`/portal/teacher/${id}/students/${student.id}`)}
                                >
                                    View Profile
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className={styles.emptyState}>
                        <Users size={48} />
                        <h3>No students found</h3>
                        <p>{searchTerm ? 'Try a different search term' : 'No students enrolled yet'}</p>
                    </div>
                )}
            </div>
        </PortalLayout>
    );
};

export default TeacherStudents;
