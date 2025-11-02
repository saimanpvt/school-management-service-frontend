import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Sidebar from '../../../../components/Sidebar';
import { FileText, Calendar, Clock, MapPin, AlertCircle, CheckCircle } from 'lucide-react';
import styles from './student.module.css';

interface Exam {
    id: string;
    title: string;
    subject: string;
    date: string;
    time: string;
    duration: string;
    location: string;
    type: 'midterm' | 'final' | 'quiz';
    status: 'upcoming' | 'completed' | 'ongoing';
    grade?: string;
}

const StudentExams = () => {
    const router = useRouter();
    const { id } = router.query;
    const [exams, setExams] = useState<Exam[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterType, setFilterType] = useState<string>('all');

    useEffect(() => {
        if (id) {
            // Mock data - replace with actual API call
            setTimeout(() => {
                const mockData: Exam[] = [
                    {
                        id: '1',
                        title: 'Mathematics Midterm',
                        subject: 'Mathematics',
                        date: '2024-02-15',
                        time: '09:00 AM',
                        duration: '2 hours',
                        location: 'Hall A',
                        type: 'midterm',
                        status: 'upcoming'
                    },
                    {
                        id: '2',
                        title: 'Science Final',
                        subject: 'Science',
                        date: '2024-02-20',
                        time: '10:00 AM',
                        duration: '3 hours',
                        location: 'Hall B',
                        type: 'final',
                        status: 'upcoming'
                    },
                    {
                        id: '3',
                        title: 'English Quiz',
                        subject: 'English',
                        date: '2024-01-10',
                        time: '11:00 AM',
                        duration: '1 hour',
                        location: 'Room 101',
                        type: 'quiz',
                        status: 'completed',
                        grade: 'A'
                    }
                ];
                setExams(mockData);
                setLoading(false);
            }, 1000);
        }
    }, [id]);

    const filteredExams = filterType === 'all' 
        ? exams 
        : exams.filter(e => e.type === filterType);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const isUpcoming = (dateString: string) => {
        return new Date(dateString) > new Date();
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <Sidebar name="Student" role="student" />
                <main className={styles.main}>
                    <div className={styles.loading}>Loading exams...</div>
                </main>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <Sidebar name="Student" role="student" />
            <main className={styles.main}>
                <header className={styles.pageHeader}>
                    <h1>Exams</h1>
                    <p>View and manage your exam schedule</p>
                </header>

                <div style={{ marginBottom: '1.5rem' }}>
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '0.5rem',
                            border: '1px solid #e5e7eb',
                            background: 'white',
                            fontSize: '1rem',
                            minWidth: '200px'
                        }}
                    >
                        <option value="all">All Types</option>
                        <option value="quiz">Quiz</option>
                        <option value="midterm">Midterm</option>
                        <option value="final">Final</option>
                    </select>
                </div>

                <div className={styles.examsGrid}>
                    {filteredExams.length > 0 ? (
                        filteredExams.map(exam => {
                            const upcoming = isUpcoming(exam.date);
                            return (
                                <div key={exam.id} className={styles.examCard}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                        <h3 className={styles.examTitle}>{exam.title}</h3>
                                        <span style={{
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '0.375rem',
                                            fontSize: '0.75rem',
                                            fontWeight: 500,
                                            background: exam.status === 'completed' ? '#d1fae5' : exam.status === 'ongoing' ? '#fef3c7' : '#dbeafe',
                                            color: exam.status === 'completed' ? '#059669' : exam.status === 'ongoing' ? '#d97706' : '#2563eb'
                                        }}>
                                            {exam.status === 'completed' && <CheckCircle size={12} style={{ marginRight: '0.25rem' }} />}
                                            {exam.status === 'upcoming' && upcoming && <AlertCircle size={12} style={{ marginRight: '0.25rem' }} />}
                                            {exam.status.charAt(0).toUpperCase() + exam.status.slice(1)}
                                        </span>
                                    </div>
                                    
                                    <div className={styles.examMeta}>
                                        <div className={styles.examDate}>
                                            <Calendar size={14} />
                                            {formatDate(exam.date)}
                                        </div>
                                        <div className={styles.examTime}>
                                            <Clock size={14} />
                                            {exam.time} ({exam.duration})
                                        </div>
                                        <div className={styles.examLocation}>
                                            <MapPin size={14} />
                                            {exam.location}
                                        </div>
                                        <div style={{ marginTop: '0.5rem', padding: '0.5rem', background: '#f3f4f6', borderRadius: '0.375rem', fontSize: '0.875rem' }}>
                                            <span style={{ fontWeight: 600 }}>Subject:</span> {exam.subject}
                                        </div>
                                        {exam.grade && (
                                            <div style={{ marginTop: '0.5rem', padding: '0.5rem', background: '#eef2ff', borderRadius: '0.375rem', fontSize: '0.875rem', color: '#6366f1', fontWeight: 600 }}>
                                                Grade: {exam.grade}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className={styles.emptyState}>
                            <FileText size={48} />
                            <h3>No exams scheduled</h3>
                            <p>Your upcoming exams will appear here.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default StudentExams;
