import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Sidebar from '../../../../components/Sidebar';
import { studentService, Assignment } from '../../../../services/student.service';
import { FileText, Calendar, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import styles from './student.module.css';

const StudentAssignments = () => {
    const router = useRouter();
    const { id } = router.query;
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            studentService.getAssignments(id as string)
                .then(data => {
                    setAssignments(data);
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Error fetching assignments:', error);
                    setLoading(false);
                });
        }
    }, [id]);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'graded':
                return 'graded';
            case 'submitted':
                return 'submitted';
            default:
                return 'pending';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const isOverdue = (dueDate: string, status: string) => {
        if (status !== 'pending') return false;
        return new Date(dueDate) < new Date();
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <Sidebar name="Student" role="student" />
                <main className={styles.main}>
                    <div className={styles.loading}>Loading assignments...</div>
                </main>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <Sidebar name="Student" role="student" />
            <main className={styles.main}>
                <header className={styles.pageHeader}>
                    <h1>My Assignments</h1>
                    <p>Track and manage your assignments</p>
                </header>

                <div className={styles.assignmentsGrid}>
                    {assignments.length > 0 ? (
                        assignments.map(assignment => {
                            const overdue = isOverdue(assignment.dueDate, assignment.status);
                            return (
                                <div key={assignment.id} className={styles.assignmentCard}>
                                    <div className={styles.assignmentHeader}>
                                        <div>
                                            <h3 className={styles.assignmentTitle}>{assignment.title}</h3>
                                            <span className={styles.subjectBadge}>{assignment.subject}</span>
                                        </div>
                                    </div>
                                    
                                    <div className={styles.assignmentMeta}>
                                        <div className={styles.dueDate}>
                                            <Calendar size={14} />
                                            Due: {formatDate(assignment.dueDate)}
                                            {overdue && (
                                                <span style={{ color: '#dc2626', marginLeft: '0.5rem' }}>
                                                    <AlertCircle size={14} /> Overdue
                                                </span>
                                            )}
                                        </div>
                                        <div>
                                            <span className={`${styles.statusBadge} ${styles[getStatusBadge(assignment.status)]}`}>
                                                {assignment.status === 'pending' && <Clock size={14} />}
                                                {assignment.status === 'submitted' && <CheckCircle size={14} />}
                                                {assignment.status === 'graded' && <CheckCircle size={14} />}
                                                {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                                            </span>
                                        </div>
                                        {assignment.grade && (
                                            <div style={{ fontWeight: 600, color: '#6366f1' }}>
                                                Grade: {assignment.grade}
                                            </div>
                                        )}
                                    </div>

                                    <div className={styles.assignmentActions}>
                                        {assignment.status === 'pending' && (
                                            <button 
                                                className={`${styles.actionBtn} ${styles.primary}`}
                                                onClick={() => {
                                                    const routerInstance = router as any;
                                                    routerInstance?.push(`/portal/student/${id}/assignments/${assignment.id}`);
                                                }}
                                            >
                                                Submit Assignment
                                            </button>
                                        )}
                                        <button 
                                            className={styles.actionBtn}
                                            onClick={() => {
                                                const routerInstance = router as any;
                                                routerInstance?.push(`/portal/student/${id}/assignments/${assignment.id}`);
                                            }}
                                        >
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className={styles.emptyState}>
                            <FileText size={48} />
                            <h3>No assignments</h3>
                            <p>You don't have any assignments at the moment.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default StudentAssignments;