import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import PortalLayout from '../../../../components/PortalLayout';
import { teacherService, Class } from '../../../../services/teacher.service';
import { Users, Clock, TrendingUp, ArrowRight } from 'lucide-react';
import styles from './teacher.module.css';
import LoadingDots from '../../../../components/LoadingDots';

const TeacherClass = () => {
    const router = useRouter();
    const { id } = router.query;
    const [classes, setClasses] = useState<Class[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            teacherService.getClasses(id as string)
                .then(data => {
                    setClasses(data);
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Error fetching classes:', error);
                    setLoading(false);
                });
        }
    }, [id]);

    if (loading) {
        return (
            <PortalLayout userRole="teacher" userName="Teacher">
                <div className={styles.loading}><LoadingDots /></div>
            </PortalLayout>
        );
    }

    return (
        <PortalLayout userRole="teacher" userName="Teacher">
            <header className={styles.header}>
                <h1>My Classes</h1>
                <p>Manage your classes and track student performance</p>
            </header>

            <div className={styles.classesGrid}>
                {classes.length > 0 ? (
                    classes.map(classItem => (
                        <div key={classItem.id} className={styles.classCard}>
                            <div className={styles.classHeader}>
                                <div className={styles.classIcon}>
                                    <Users size={24} />
                                </div>
                                <div className={styles.classTitleSection}>
                                    <h3>{classItem.name}</h3>
                                    <div className={styles.classMeta}>
                                        <span className={styles.studentCount}>
                                            <Users size={14} />
                                            {classItem.totalStudents} Students
                                        </span>
                                        <span className={styles.scheduleInfo}>
                                            <Clock size={14} />
                                            {classItem.schedule}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.performanceSection}>
                                <div className={styles.performanceHeader}>
                                    <span>Average Performance</span>
                                    <span className={styles.performanceValue}>
                                        {classItem.averagePerformance}%
                                    </span>
                                </div>
                                <div className={styles.performanceBar}>
                                    <div
                                        className={styles.performanceFill}
                                        style={{ width: `${classItem.averagePerformance}%` }}
                                    />
                                </div>
                            </div>

                            <div className={styles.classActions}>
                                <button
                                    className={styles.viewBtn}
                                    onClick={() => router.push(`/portal/teacher/${id}/class/${classItem.id}`)}
                                >
                                    View Details
                                    <ArrowRight size={16} />
                                </button>
                                <button
                                    className={styles.secondaryBtn}
                                    onClick={() => router.push(`/portal/teacher/${id}/attendance?class=${classItem.id}`)}
                                >
                                    Take Attendance
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className={styles.emptyState}>
                        <Users size={48} />
                        <h3>No classes assigned</h3>
                        <p>Your classes will appear here once assigned.</p>
                    </div>
                )}
            </div>
        </PortalLayout>
    );
};

export default TeacherClass;
