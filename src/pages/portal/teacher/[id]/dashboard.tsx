import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import styles from './teacher.module.css';
import PortalLayout from '../../../../components/PortalLayout/PortalLayout';
import { apiServices } from '../../../../services/api';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import LoadingDots from '../../../../components/LoadingDots/LoadingDots';
import { useNotification } from '../../../../components/Toaster/Toaster';

const TeacherDashboard = () => {
  const router = useRouter();
  const { id } = router.query;
  const { addNotification } = useNotification();
  const [stats, setStats] = useState<null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDashboardStats = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      // Use unified dashboard API - backend handles role-based stats
      const response = (await apiServices.dashboard?.getStats()) || {
        success: false,
        data: null,
      };
      if (response.success && response.data) {
        setStats(response.data);
      } else {
        setError('Failed to load dashboard data');
        addNotification({
          type: 'error',
          title: 'Failed to load dashboard data',
          message: 'Please try again later.',
        });
      }
    } catch (err) {
      console.error('Error loading dashboard stats:', err);
      setError('Failed to load dashboard data');
      addNotification({
        type: 'error',
        title: 'Failed to load dashboard data',
        message: 'Please try again later.',
      });
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadDashboardStats();
  }, [loadDashboardStats]);

  const renderStatsGrid = () => (
    <div className={styles.statsGrid}>
      <div className={styles.statsCard}>
        <h3>My Students</h3>
        <p className={styles.statNumber}>{stats?.totalStudents || 0}</p>
        <small>Total enrolled students</small>
      </div>
      <div className={styles.statsCard}>
        <h3>Courses Teaching</h3>
        <p className={styles.statNumber}>{stats?.totalCourses || 0}</p>
        <small>Active courses</small>
      </div>
      <div className={styles.statsCard}>
        <h3>Assignments to Grade</h3>
        <p className={styles.statNumber}>
          {stats?.quickStats?.assignmentsToGrade || 0}
        </p>
        <small>Pending reviews</small>
      </div>
      <div className={styles.statsCard}>
        <h3>Class Performance</h3>
        <p className={styles.statNumber}>
          {stats?.quickStats?.averageClassPerformance || 0}%
        </p>
        <small>Average score</small>
      </div>
    </div>
  );

  const renderSchedule = () => (
    <section className={styles.scheduleSection}>
      <h2 className={styles.sectionTitle}>Today&apos;s Schedule</h2>
      <div className={styles.scheduleGrid}>
        {stats?.upcomingSchedule?.length ? (
          stats.upcomingSchedule.map((schedule) => (
            <div key={schedule.id} className={styles.scheduleCard}>
              <p className={styles.scheduleTime}>
                {schedule.startTime} - {schedule.endTime}
              </p>
              <h4 className={styles.className}>{schedule.className}</h4>
              <span
                className={`${styles.scheduleType} ${styles[schedule.type]}`}
              >
                {schedule.type}
              </span>
            </div>
          ))
        ) : (
          <p>No scheduled classes for today</p>
        )}
      </div>
    </section>
  );

  const renderPerformanceChart = () => (
    <section className={styles.performanceSection}>
      <h2 className={styles.sectionTitle}>Class Performance Overview</h2>
      <div className={styles.chartContainer}>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={stats?.classPerformance || []}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="className" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="averageScore"
              stroke="#6366f1"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );

  const renderActivities = () => (
    <section className={styles.activitySection}>
      <h2 className={styles.sectionTitle}>Recent Activities</h2>
      <div className={styles.activityList}>
        {stats?.recentActivities?.length ? (
          stats.recentActivities.map((activity) => (
            <div key={activity.id} className={styles.activityItem}>
              <div
                className={`${styles.activityIcon} ${styles[activity.type]}`}
              >
                {activity.type === 'grade' && '📝'}
                {activity.type === 'attendance' && '📊'}
                {activity.type === 'assignment' && '📚'}
                {activity.type === 'message' && '💬'}
              </div>
              <div className={styles.activityContent}>
                <p className={styles.activityTitle}>{activity.description}</p>
                <p className={styles.activityMeta}>
                  {activity.date}{' '}
                  {activity.className && `• ${activity.className}`}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p>No recent activities</p>
        )}
      </div>
    </section>
  );

  const renderQuickActions = () => {
    const actions = [
      { icon: '📊', label: 'Take Attendance', path: '/attendance' },
      { icon: '📝', label: 'Enter Grades', path: '/grades' },
      { icon: '📚', label: 'Create Assignment', path: '/assignments' },
      { icon: '💬', label: 'Send Messages', path: '/messages' },
    ];

    const handleActionClick = (path: string) => {
      router.push(`/teacher/${id}${path}`);
    };

    return (
      <section className={styles.quickActions}>
        <h2 className={styles.sectionTitle}>Quick Actions</h2>
        <div className={styles.actionGrid}>
          {actions.map((action) => (
            <button
              key={action.path}
              className={styles.actionButton}
              onClick={() => handleActionClick(action.path)}
            >
              <span className={styles.actionIcon}>{action.icon}</span>
              <span className={styles.actionLabel}>{action.label}</span>
            </button>
          ))}
        </div>
      </section>
    );
  };

  return (
    <PortalLayout userName={stats?.teacherName || 'Teacher'} userRole="teacher">
      {loading ? (
        <div className={styles.loading}>
          <LoadingDots />
        </div>
      ) : error ? (
        <div className={styles.error}>{error}</div>
      ) : (
        <>
          <header className={styles.header}>
            <h2>Welcome back, {stats?.teacherName || 'Teacher'}! 👋</h2>
            <p>Manage your classes and students efficiently</p>
          </header>

          {renderStatsGrid()}

          <div className={styles.gridLayout}>
            {renderSchedule()}
            {renderPerformanceChart()}
          </div>

          {renderActivities()}
          {renderQuickActions()}
        </>
      )}
    </PortalLayout>
  );
};

export default TeacherDashboard;
