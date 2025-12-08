import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import PortalLayout from '../../../../components/PortalLayout';
import { apiServices, Assignment } from '../../../../services/api';
import { FileText, Calendar, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import styles from './student.module.css';
import LoadingDots from '../../../../components/LoadingDots';

const StudentAssignments = () => {
    const router = useRouter();
    const { id } = router.query;
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadAssignments = async () => {
            if (id) {
                try {
                    const response = await apiServices.student.getAssignments(id as string);
                    if (response.success && response.data) {
                        setAssignments(response.data);
                    }
                } catch (error) {
                    console.error('Error fetching assignments:', error);
                } finally {
                    setLoading(false);
                }
            }
        };
        loadAssignments();
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
            <PortalLayout userRole="student" userName="Student">
                <div className={styles.loading}><LoadingDots /></div>
            </PortalLayout>
        );
    }

    return (
        <PortalLayout userRole="student" userId={id as string}>
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
        </PortalLayout>
    );
};

export default StudentAssignments;