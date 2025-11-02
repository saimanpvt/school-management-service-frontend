import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Sidebar from '../../../../components/Sidebar';
import { teacherService, Assignment } from '../../../../services/teacher.service';
import { ClipboardList, Plus, Calendar, Users, FileCheck } from 'lucide-react';
import styles from './teacher.module.css';

const TeacherAssignments = () => {
    const router = useRouter();
    const { id } = router.query;
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            teacherService.getPendingAssignments(id as string)
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

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <Sidebar name="Teacher" role="teacher" />
                <main className={styles.main}>
                    <div className={styles.loading}>Loading assignments...</div>
                </main>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <Sidebar name="Teacher" role="teacher" />
            <main className={styles.main}>
                <header className={styles.header}>
                    <div>
                        <h1>Manage Assignments</h1>
                        <p>Create and manage assignments for your classes</p>
                    </div>
                    <button
                        className={styles.createBtn}
                        onClick={() => router.push(`/portal/teacher/${id}/assignments/create`)}
                    >
                        <Plus size={18} />
                        Create Assignment
                    </button>
                </header>

                <div className={styles.assignmentsContainer}>
                    {assignments.length > 0 ? (
                        assignments.map(assignment => (
                            <div key={assignment.id} className={styles.assignmentCard}>
                                <div className={styles.assignmentHeader}>
                                    <div className={styles.assignmentIcon}>
                                        <ClipboardList size={24} />
                                    </div>
                                    <div className={styles.assignmentTitleSection}>
                                        <h3>{assignment.title}</h3>
                                        <p className={styles.assignmentDescription}>{assignment.description}</p>
                                        <div className={styles.assignmentMeta}>
                                            <span className={styles.classBadge}>
                                                <Users size={14} />
                                                {assignment.className}
                                            </span>
                                            <span className={styles.dateInfo}>
                                                <Calendar size={14} />
                                                Due: {formatDate(assignment.dueDate)}
                                            </span>
                                            <span className={styles.scoreInfo}>
                                                Max Score: {assignment.maxScore}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.assignmentActions}>
                                    <button
                                        className={styles.primaryBtn}
                                        onClick={() => router.push(`/portal/teacher/${id}/assignments/${assignment.id}/grade`)}
                                    >
                                        <FileCheck size={16} />
                                        Grade Submissions
                                    </button>
                                    <button
                                        className={styles.secondaryBtn}
                                        onClick={() => router.push(`/portal/teacher/${id}/assignments/${assignment.id}`)}
                                    >
                                        View Details
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className={styles.emptyState}>
                            <ClipboardList size={48} />
                            <h3>No assignments</h3>
                            <p>Create your first assignment to get started</p>
                            <button
                                className={styles.createBtn}
                                onClick={() => router.push(`/portal/teacher/${id}/assignments/create`)}
                            >
                                <Plus size={18} />
                                Create Assignment
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default TeacherAssignments;
