import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import styles from "./parent.module.css";
import Sidebar from "../../../../components/Sidebar";
import Link from "next/link";
import { parentService, ParentDashboardStats } from "../../../../services/parent.service";

const ParentDashboard = () => {
    const router = useRouter();
    const { id } = router.query;
    const [stats, setStats] = useState<ParentDashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedChild, setSelectedChild] = useState<string | null>(null);

    const loadDashboardStats = useCallback(async () => {
        if (!id) return;

        try {
            setLoading(true);
            const data = await parentService.getDashboardStats(id as string);
            setStats(data);
            if (data.childrenStats.length > 0) {
                setSelectedChild(data.childrenStats[0].id);
            }
        } catch (error) {
            console.error('Error loading dashboard stats:', error);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        loadDashboardStats();
    }, [loadDashboardStats]);

    const getSelectedChildStats = useCallback(() => {
        return stats?.childrenStats.find(child => child.id === selectedChild);
    }, [stats, selectedChild]);

    const handleChildSelect = useCallback((childId: string) => {
        setSelectedChild(childId);
    }, []);

    const renderChildrenSelector = () => (
        <div className={styles.childrenSelector}>
            {stats?.childrenStats.map(child => (
                <button
                    key={child.id}
                    className={`${styles.childButton} ${selectedChild === child.id ? styles.active : ''}`}
                    onClick={() => handleChildSelect(child.id)}
                >
                    {child.name}
                </button>
            ))}
        </div>
    );

    const renderChildStats = () => {
        const childStats = getSelectedChildStats();
        if (!childStats) return null;

        return (
            <div className={styles.statsGrid}>
                <div className={styles.statsCard}>
                    <h3>Current Average</h3>
                    <p className={styles.statNumber}>{childStats.currentAverage}%</p>
                </div>
                <div className={styles.statsCard}>
                    <h3>Attendance</h3>
                    <p className={styles.statNumber}>{childStats.attendance}%</p>
                </div>
                <div className={styles.statsCard}>
                    <h3>Upcoming Tests</h3>
                    <p className={styles.statNumber}>{childStats.upcomingTests}</p>
                </div>
                <div className={styles.statsCard}>
                    <h3>Pending Tasks</h3>
                    <p className={styles.statNumber}>{childStats.pendingAssignments}</p>
                </div>
            </div>
        );
    };

    const renderFinancialSection = () => (
        <section className={styles.financialSection}>
            <h2 className={styles.sectionTitle}>Financial Overview</h2>
            <div className={styles.financeCard}>
                <div className={styles.paymentInfo}>
                    <h3>Next Payment Due</h3>
                    <p className={styles.amount}>${stats?.financialSummary.amountDue}</p>
                    <p className={styles.dueDate}>Due: {stats?.financialSummary.nextPaymentDue}</p>
                    <span className={`${styles.status} ${styles[stats?.financialSummary.paymentStatus || '']}`}>
                        {stats?.financialSummary.paymentStatus}
                    </span>
                </div>
                <button
                    className={styles.payButton}
                    onClick={() => router.push(`/dashboard/parent/${id}/payments`)}
                >
                    Make Payment
                </button>
            </div>
        </section>
    );

    const renderActivities = () => (
        <section className={styles.activitySection}>
            <h2 className={styles.sectionTitle}>Recent Activities</h2>
            <div className={styles.activityList}>
                {stats?.recentActivities.map(activity => (
                    <div key={activity.id} className={styles.activityItem}>
                        <div className={`${styles.activityIcon} ${styles[activity.type]}`}>
                            {activity.type === 'grade' && '📝'}
                            {activity.type === 'attendance' && '📊'}
                            {activity.type === 'behavior' && '🎯'}
                            {activity.type === 'message' && '💬'}
                        </div>
                        <div className={styles.activityContent}>
                            <p className={styles.activityTitle}>{activity.description}</p>
                            <p className={styles.activityMeta}>
                                {activity.date} • {activity.childName}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );

    const renderQuickActions = () => (
        <section className={styles.quickActions}>
            <h2 className={styles.sectionTitle}>Quick Actions</h2>
            <div className={styles.actionGrid}>
                {[
                    { icon: '💬', label: 'Message Teachers', path: 'messages' },
                    { icon: '📊', label: 'View Attendance', path: 'attendance' },
                    { icon: '📝', label: 'View Grades', path: 'grades' },
                    { icon: '📅', label: 'View Schedule', path: 'schedule' }
                ].map(action => (
                    <button
                        key={action.path}
                        className={styles.actionButton}
                        onClick={() => router.push(`/dashboard/parent/${id}/${action.path}`)}
                    >
                        <span className={styles.actionIcon}>{action.icon}</span>
                        <span className={styles.actionLabel}>{action.label}</span>
                    </button>
                ))}
            </div>
        </section>
    );

    return (
        <div className={styles.container}>
            <Sidebar name={stats?.parentName || "Parent"} role="parent" />
            <main className={styles.main}>
                {loading ? (
                    <div className={styles.loading}>Loading...</div>
                ) : (
                    <>
                        <header className={styles.header}>
                            <h2>Welcome, {stats?.parentName || "Parent"}! 👋</h2>
                            <p>Monitor your children's academic progress</p>
                        </header>

                        {renderChildrenSelector()}
                        {renderChildStats()}

                        <div className={styles.gridLayout}>
                            {renderFinancialSection()}

                            <section className={styles.calendarSection}>
                                <h2 className={styles.sectionTitle}>Academic Calendar</h2>
                                <div className={styles.eventsList}>
                                    {stats?.academicCalendar.map(event => (
                                        <div key={event.id} className={`${styles.eventCard} ${styles[event.type]}`}>
                                            <span className={styles.eventDate}>{event.date}</span>
                                            <p className={styles.eventTitle}>{event.event}</p>
                                            <span className={styles.eventType}>{event.type}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>

                        {renderActivities()}
                        {renderQuickActions()}
                    </>
                )}
            </main>
        </div>
    );
};

export default ParentDashboard;

<div className={styles.childrenSelector}>
    {stats?.childrenStats.map(child => (
        <button
            key={child.id}
            className={`${styles.childButton} ${selectedChild === child.id ? styles.active : ''}`}
            onClick={() => setSelectedChild(child.id)}
        >
            {child.name}
        </button>
    ))}
</div>

{
    getSelectedChildStats() && (
        <div className={styles.statsGrid}>
            <div className={styles.statsCard}>
                <h3>Current Average</h3>
                <p className={styles.statNumber}>{getSelectedChildStats()?.currentAverage}%</p>
            </div>
            <div className={styles.statsCard}>
                <h3>Attendance</h3>
                <p className={styles.statNumber}>{getSelectedChildStats()?.attendance}%</p>
            </div>
            <div className={styles.statsCard}>
                <h3>Upcoming Tests</h3>
                <p className={styles.statNumber}>{getSelectedChildStats()?.upcomingTests}</p>
            </div>
            <div className={styles.statsCard}>
                <h3>Pending Assignments</h3>
                <p className={styles.statNumber}>{getSelectedChildStats()?.pendingAssignments}</p>
            </div>
        </div>
    )
}

                <section className={styles.quickLinks}>
                    <h3>Quick Links</h3>
                    <div className={styles.linkGrid}>
                        <Link href={`/dashboard/parent/${id}/children`}>
                            <div className={styles.linkCard}>
                                <h4>My Children</h4>
                                <p>View academic progress</p>
                            </div>
                        </Link>
                        <Link href={`/dashboard/parent/${id}/attendance`}>
                            <div className={styles.linkCard}>
                                <h4>Attendance</h4>
                                <p>Check attendance records</p>
                            </div>
                        </Link>
                        <Link href={`/dashboard/parent/${id}/fees`}>
                            <div className={styles.linkCard}>
                                <h4>Fees</h4>
                                <p>Manage fee payments</p>
                            </div>
                        </Link>
                        <Link href={`/dashboard/parent/${id}/messages`}>
                            <div className={styles.linkCard}>
                                <h4>Messages</h4>
                                <p>Communicate with teachers</p>
                            </div>
                        </Link>
                    </div>
                </section>

                <section className={styles.activity}>
                    <h3>Recent Updates</h3>
                    <ul>
                        <li>📊 John&apos;s Math test results available</li>
                        <li>📅 Parent-Teacher meeting next week</li>
                        <li>💬 New message from Class Teacher</li>
                        <li>📝 Sarah&apos;s Science project due soon</li>
                    </ul>
                </section>
            </main >
        </div >
    );
};

export default ParentDashboard;