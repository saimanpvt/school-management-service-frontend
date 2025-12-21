import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import PortalLayout from '../../../../components/PortalLayout/PortalLayout';
import Link from 'next/link';
import { apiServices } from '../../../../services/api';
import { ProtectedRoute } from '../../../../lib/auth';
import styles from '../../../../styles/Dashboard.module.css';
import LoadingDots from '../../../../components/LoadingDots/LoadingDots';
import { useNotification } from '../../../../components/Toaster/Toaster';
import { STUDENT_DASHBOARD_CONSTANTS } from '../../../../lib/constants';
import {
  formatDateForStudent,
  getAssignmentStatusClass,
} from '../../../../lib/helpers';
import {
  StudentDashboardStats,
  StudentAssignment,
} from '../../../../lib/types';

const StudentDashboard = () => {
  const router = useRouter();
  const { id } = router.query;
  const [stats, setStats] = useState<StudentDashboardStats | null>(null);
  const [recentAssignments, setRecentAssignments] = useState<
    StudentAssignment[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('Student');
  const { addNotification } = useNotification();

  useEffect(() => {
    const loadDashboardData = async () => {
      if (id) {
        try {
          // Load dashboard stats
          const statsResponse = (await apiServices.dashboard?.getStats?.()) || {
            success: false,
            data: null,
          };
          if (statsResponse.success && statsResponse.data) {
            setStats(statsResponse.data as StudentDashboardStats);
          }

          // Load recent assignments
          const assignmentsResponse = await apiServices.assignments.getAll();
          if (assignmentsResponse.success && assignmentsResponse.data) {
            const assignments = Array.isArray(assignmentsResponse.data)
              ? assignmentsResponse.data.slice(
                  0,
                  STUDENT_DASHBOARD_CONSTANTS.MAX_RECENT_ASSIGNMENTS
                )
              : [];
            setRecentAssignments(assignments);
          }
          // Set user name (will be loaded from profile when auth API is available)
          setUserName('Student');
        } catch (error) {
          console.error('Error fetching dashboard data:', error);
          addNotification({
            type: 'error',
            title: 'Error loading dashboard',
            message: 'Please try again later.',
          });
        } finally {
          setLoading(false);
        }
      }
    };
    loadDashboardData();
  }, [id, addNotification]);

  if (loading) {
    return (
      <PortalLayout userName={userName} userRole="student">
        <div className={styles.loading_spinner}>
          <LoadingDots />
        </div>
      </PortalLayout>
    );
  }

  return (
    <PortalLayout userName={userName} userRole="student">
      <header className={styles.dashboard_header}>
        <h2>Welcome back, {userName}! 👋</h2>
        <p>Track your academic progress and upcoming tasks</p>
      </header>

      <section className={styles.stats_grid}>
        <div className={styles.stat_card}>
          <h3>Courses Enrolled</h3>
          <p>{stats?.coursesEnrolled || 0}</p>
        </div>
        <div className={styles.stat_card}>
          <h3>Assignments Due</h3>
          <p>{stats?.pendingAssignments || 0}</p>
        </div>
        <div className={styles.stat_card}>
          <h3>Average Grade</h3>
          <p>{stats?.averageGrade || 'N/A'}</p>
        </div>
        <div className={styles.stat_card}>
          <h3>Attendance</h3>
          <p>{stats?.attendance || 0}%</p>
        </div>
      </section>

      <div className={styles.grid_layout}>
        <section className={styles.table_section}>
          <h3 className={styles.section_title}>Upcoming Assignments</h3>
          <table className={styles.data_table}>
            <thead>
              <tr>
                <th>Subject</th>
                <th>Assignment</th>
                <th>Due Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentAssignments.length > 0 ? (
                recentAssignments.map((assignment) => (
                  <tr key={assignment.id}>
                    <td>{assignment.subject}</td>
                    <td>{assignment.title}</td>
                    <td>{formatDateForStudent(assignment.dueDate)}</td>
                    <td>
                      <span
                        className={`${styles.status_badge} ${
                          styles[getAssignmentStatusClass(assignment.status)]
                        }`}
                      >
                        {assignment.status.charAt(0).toUpperCase() +
                          assignment.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className={styles.emptyTableCell}>
                    No assignments found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      </div>

      <section className={styles.quick_links}>
        <h3>Quick Links</h3>
        <div className={styles.links_grid}>
          <Link href={`/portal/student/${id}/courses`}>
            <div className={styles.link_card}>
              <h4>My Courses</h4>
              <p>View your enrolled courses</p>
            </div>
          </Link>
          <Link href={`/portal/student/${id}/assignments`}>
            <div className={styles.link_card}>
              <h4>Assignments</h4>
              <p>Check pending assignments</p>
            </div>
          </Link>
          <Link href={`/portal/student/${id}/grades`}>
            <div className={styles.link_card}>
              <h4>Grades</h4>
              <p>View your academic performance</p>
            </div>
          </Link>
          <Link href={`/portal/student/${id}/attendance`}>
            <div className={styles.link_card}>
              <h4>Attendance</h4>
              <p>Check your attendance records</p>
            </div>
          </Link>
        </div>
      </section>

      <div className={styles.flex_layout}>
        <section className={styles.activity_section}>
          <h3 className={styles.section_title}>Recent Activity</h3>
          <div className={styles.activity_list}>
            <div className={styles.activity_item}>
              <div className={styles.activity_icon}>📘</div>
              <div className={styles.activity_content}>
                <div className={styles.activity_title}>
                  Submitted Math Assignment 3
                </div>
                <div className={styles.activity_time}>2 hours ago</div>
              </div>
            </div>
            <div className={styles.activity_item}>
              <div className={styles.activity_icon}>📝</div>
              <div className={styles.activity_content}>
                <div className={styles.activity_title}>
                  New quiz available in Science
                </div>
                <div className={styles.activity_time}>5 hours ago</div>
              </div>
            </div>
            <div className={styles.activity_item}>
              <div className={styles.activity_icon}>📊</div>
              <div className={styles.activity_content}>
                <div className={styles.activity_title}>
                  Physics test results updated
                </div>
                <div className={styles.activity_time}>Yesterday</div>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.calendar_section}>
          <h3 className={styles.section_title}>Schedule</h3>
          <div className={styles.calendar_grid}>
            {Array.from({ length: 7 }, (_, i) => (
              <div
                key={i}
                className={`${styles.calendar_day} ${
                  i === 3 ? styles.active : ''
                }`}
              >
                {24 + i}
              </div>
            ))}
          </div>
          <div className={styles.upcoming_events}>
            <div className={styles.event_item}>
              <span className={styles.event_time}>09:00 AM</span>
              <span className={styles.event_title}>Mathematics Class</span>
            </div>
            <div className={styles.event_item}>
              <span className={styles.event_time}>11:30 AM</span>
              <span className={styles.event_title}>Physics Lab</span>
            </div>
            <div className={styles.event_item}>
              <span className={styles.event_time}>02:00 PM</span>
              <span className={styles.event_title}>Chemistry Tutorial</span>
            </div>
          </div>
        </section>
      </div>

      <section className={styles.chart_section}>
        <h3 className={styles.section_title}>Academic Performance</h3>
        <div className={styles.chart_container}>
          <div className={styles.chart_legend}>
            <div className={styles.legend_item}>
              <span
                className={`${styles.legend_color} ${styles.legendColorPrimary}`}
              ></span>
              <span>Current Semester</span>
            </div>
            <div className={styles.legend_item}>
              <span
                className={`${styles.legend_color} ${styles.legendColorSecondary}`}
              ></span>
              <span>Class Average</span>
            </div>
          </div>
        </div>
      </section>
    </PortalLayout>
  );
};

export default function ProtectedStudentDashboard() {
  return (
    <ProtectedRoute roles={['Student']}>
      <StudentDashboard />
    </ProtectedRoute>
  );
}
