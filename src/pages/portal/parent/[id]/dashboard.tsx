import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import styles from './parent.module.css';
import PortalLayout from '../../../../components/PortalLayout';
import { parentService } from '../../../../services/parent.service';
import LoadingDots from '../../../../components/LoadingDots';

const ParentDashboard = () => {
  const router = useRouter();
  const { id } = router.query;
  const [stats, setStats] = useState<null>(null);
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
    return stats?.childrenStats.find((child) => child.id === selectedChild);
  }, [stats, selectedChild]);

  const handleChildSelect = useCallback((childId: string) => {
    setSelectedChild(childId);
  }, []);

  const renderChildrenSelector = () => (
    <div className={styles.childrenSelector}>
      {stats?.childrenStats.map((child) => (
        <button
          key={child.id}
          className={`${styles.childButton} ${
            selectedChild === child.id ? styles.active : ''
          }`}
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
          <p className={styles.dueDate}>
            Due: {stats?.financialSummary.nextPaymentDue}
          </p>
          <span
            className={`${styles.status} ${
              styles[stats?.financialSummary.paymentStatus || '']
            }`}
          >
            {stats?.financialSummary.paymentStatus}
          </span>
        </div>
        <button
          className={styles.payButton}
          onClick={() => {
            const routerInstance = router as any;
            routerInstance?.push(`/portal/parent/${id}/fees`);
          }}
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
        {stats?.recentActivities.map((activity) => (
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
          { icon: '📈', label: 'View Progress', path: 'progress' },
          { icon: '📅', label: 'View Exams', path: 'exams' },
        ].map((action) => (
          <button
            key={action.path}
            className={styles.actionButton}
            onClick={() => {
              const routerInstance = router as any;
              routerInstance?.push(`/portal/parent/${id}/${action.path}`);
            }}
          >
            <span className={styles.actionIcon}>{action.icon}</span>
            <span className={styles.actionLabel}>{action.label}</span>
          </button>
        ))}
      </div>
    </section>
  );

  return (
    <PortalLayout userName={stats?.parentName || 'Parent'} userRole="parent">
      <div className={styles.main}>
        {loading ? (
          <div className={styles.loading}>
            <LoadingDots />
          </div>
        ) : (
          <>
            <header className={styles.header}>
              <h2>Welcome, {stats?.parentName || 'Parent'}! 👋</h2>
              <p>Monitor your children's academic progress</p>
            </header>

            {renderChildrenSelector()}
            {renderChildStats()}

            <div className={styles.gridLayout}>
              {renderFinancialSection()}

              <section className={styles.calendarSection}>
                <h2 className={styles.sectionTitle}>Academic Calendar</h2>
                <div className={styles.eventsList}>
                  {stats?.academicCalendar.map((event) => (
                    <div
                      key={event.id}
                      className={`${styles.eventCard} ${styles[event.type]}`}
                    >
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
      </div>
    </PortalLayout>
  );
};

export default ParentDashboard;
