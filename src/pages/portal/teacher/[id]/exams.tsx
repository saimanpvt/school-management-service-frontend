import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import PortalLayout from '../../../../components/PortalLayout';
import { FileText, Plus, Calendar, Clock, MapPin, Users } from 'lucide-react';
import styles from './teacher.module.css';
import LoadingDots from '../../../../components/LoadingDots';

interface Exam {
    id: string;
    title: string;
    subject: string;
    classId: string;
    className: string;
    date: string;
    time: string;
    duration: string;
    location: string;
    totalStudents: number;
    status: 'upcoming' | 'completed' | 'ongoing';
}

const TeacherExams = () => {
    const router = useRouter();
    const { id } = router.query;
    const [exams, setExams] = useState<Exam[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            // Mock data - replace with actual API call
            setTimeout(() => {
                const mockData: Exam[] = [
                    {
                        id: '1',
                        title: 'Mathematics Midterm',
                        subject: 'Mathematics',
                        classId: 'c1',
                        className: 'Grade 10A',
                        date: '2024-02-15',
                        time: '09:00 AM',
                        duration: '2 hours',
                        location: 'Hall A',
                        totalStudents: 30,
                        status: 'upcoming'
                    },
                    {
                        id: '2',
                        title: 'Science Quiz',
                        subject: 'Science',
                        classId: 'c2',
                        className: 'Grade 9B',
                        date: '2024-01-20',
                        time: '11:00 AM',
                        duration: '1 hour',
                        location: 'Room 201',
                        totalStudents: 25,
                        status: 'completed'
                    }
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
            year: 'numeric'
        });
    };

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
                    <h1>Manage Exams</h1>
                    <p>Schedule and manage exams for your classes</p>
                </div>
                <button
                    className={styles.createBtn}
                    onClick={() => router.push(`/portal/teacher/${id}/exams/create`)}
                >
                    <Plus size={18} />
                    Create Exam
                </button>
            </header>

            <div className={styles.examsContainer}>
                {exams.length > 0 ? (
                    exams.map(exam => (
                        <div key={exam.id} className={styles.examCard}>
                            <div className={styles.examHeader}>
                                <div className={styles.examIcon}>
                                    <FileText size={24} />
                                </div>
                                <div className={styles.examTitleSection}>
                                    <h3>{exam.title}</h3>
                                    <div className={styles.examMeta}>
                                        <span className={styles.classBadge}>
                                            <Users size={14} />
                                            {exam.className}
                                        </span>
                                        <span className={styles.subjectBadge}>{exam.subject}</span>
                                        <span className={styles.statusBadge} data-status={exam.status}>
                                            {exam.status.charAt(0).toUpperCase() + exam.status.slice(1)}
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
                                    <span>{exam.time} ({exam.duration})</span>
                                </div>
                                <div className={styles.examDetailItem}>
                                    <MapPin size={16} />
                                    <span>{exam.location}</span>
                                </div>
                                <div className={styles.examDetailItem}>
                                    <Users size={16} />
                                    <span>{exam.totalStudents} Students</span>
                                </div>
                            </div>
                            <div className={styles.examActions}>
                                <button
                                    className={styles.primaryBtn}
                                    onClick={() => router.push(`/portal/teacher/${id}/exams/${exam.id}`)}
                                >
                                    View Details
                                </button>
                                {exam.status === 'upcoming' && (
                                    <button
                                        className={styles.secondaryBtn}
                                        onClick={() => router.push(`/portal/teacher/${id}/exams/${exam.id}/edit`)}
                                    >
                                        Edit Exam
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className={styles.emptyState}>
                        <FileText size={48} />
                        <h3>No exams scheduled</h3>
                        <p>Create your first exam to get started</p>
                        <button
                            className={styles.createBtn}
                            onClick={() => router.push(`/portal/teacher/${id}/exams/create`)}
                        >
                            <Plus size={18} />
                            Create Exam
                        </button>
                    </div>
                )}
            </div>
        </PortalLayout>
    );
};

export default TeacherExams;
