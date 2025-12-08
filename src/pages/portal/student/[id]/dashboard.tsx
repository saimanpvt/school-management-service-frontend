import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import PortalLayout from '../../../../components/PortalLayout';
import Link from 'next/link';
import { apiServices, StudentDashboardStats } from '../../../../services/api';
import { ProtectedRoute } from '../../../../lib/auth';
import styles from '../../../../styles/Dashboard.module.css';
import LoadingDots from '../../../../components/LoadingDots';

const StudentDashboard = () => {
  const router = useRouter();
  const { id } = router.query;
  const [stats, setStats] = useState<StudentDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardStats = async () => {
      if (id) {
        try {
          const response = await apiServices.student.getDashboardStats(
            id as string
          );
          if (response.success && response.data) {
            setStats(response.data);
          } else {
            console.error('Failed to load dashboard stats');
          }
        } catch (error) {
          console.error('Error fetching dashboard stats:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    loadDashboardStats();
  }, [id]);

  if (loading) {
    return (
      <PortalLayout userName="Alex Johnson" userRole="student">
        <div className={styles.loading_spinner}>
          <LoadingDots />
        </div>
      </PortalLayout>
    );
  }

  return (
    <PortalLayout userName="Alex Johnson" userRole="student">
      <header className={styles.dashboard_header}>
        <h2>Welcome back, Alex! 👋</h2>
        <p>Track your academic progress and upcoming tasks</p>
      </header>

      <section className={styles.stats_grid}>
        <div className={styles.stat_card}>
          <h3>Courses Enrolled</h3>
          <p>{stats?.coursesEnrolled || 6}</p>
          <div className={`${styles.trend} ${styles.up}`}>
            <span>↑ 2 new this semester</span>
          </div>
        </div>
        <div className={styles.stat_card}>
          <h3>Assignments Due</h3>
          <p>{stats?.pendingAssignments || 3}</p>
          <div className={`${styles.trend} ${styles.warning}`}>
            <span>Due within 48 hours</span>
          </div>
        </div>
        <div className={styles.stat_card}>
          <h3>Average Grade</h3>
          <p>{stats?.averageGrade || 'A-'}</p>
          <div className={`${styles.trend} ${styles.up}`}>
            <span>↑ 5% improvement</span>
          </div>
        </div>
        <div className={styles.stat_card}>
          <h3>Attendance</h3>
          <p>{stats?.attendance || 95}%</p>
          <div className={`${styles.trend} ${styles.up}`}>
            <span>Above class average</span>
          </div>
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
              <tr>
                <td>Mathematics</td>
                <td>Linear Algebra Quiz</td>
                <td>Oct 26, 2025</td>
                <td>
                  <span className={`${styles.status_badge} ${styles.warning}`}>
                    Pending
                  </span>
                </td>
              </tr>
              <tr>
                <td>Physics</td>
                <td>Lab Report</td>
                <td>Oct 28, 2025</td>
                <td>
                  <span className={`${styles.status_badge} ${styles.danger}`}>
                    Overdue
                  </span>
                </td>
              </tr>
              <tr>
                <td>Chemistry</td>
                <td>Molecular Structure</td>
                <td>Oct 25, 2025</td>
                <td>
                  <span className={`${styles.status_badge} ${styles.success}`}>
                    Submitted
                  </span>
                </td>
              </tr>
              <tr>
                <td>Physics</td>
                <td>Lab Report</td>
                <td>Oct 28, 2025</td>
                <td>
                  <span className={`${styles.status_badge} ${styles.danger}`}>
                    Overdue
                  </span>
                </td>
              </tr>
              <tr>
                <td>Chemistry</td>
                <td>Molecular Structure</td>
                <td>Oct 25, 2025</td>
                <td>
                  <span className={`${styles.status_badge} ${styles.success}`}>
                    Submitted
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>

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
              <tr>
                <td>Mathematics</td>
                <td>Linear Algebra Quiz</td>
                <td>Oct 26, 2025</td>
                <td>
                  <span className={`${styles.status_badge} ${styles.warning}`}>
                    Pending
                  </span>
                </td>
              </tr>
              <tr>
                <td>Physics</td>
                <td>Lab Report</td>
                <td>Oct 28, 2025</td>
                <td>
                  <span className={`${styles.status_badge} ${styles.danger}`}>
                    Overdue
                  </span>
                </td>
              </tr>
              <tr>
                <td>Chemistry</td>
                <td>Molecular Structure</td>
                <td>Oct 25, 2025</td>
                <td>
                  <span className={`${styles.status_badge} ${styles.success}`}>
                    Submitted
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>

      <section className={styles.quick_links}>
        <h3>Quick Links</h3>
        <div className={styles.links_grid}>
          <Link href={`/dashboard/student/${id}/courses`}>
            <div className={styles.link_card}>
              <h4>My Courses</h4>
              <p>View your enrolled courses</p>
            </div>
          </Link>
          <Link href={`/dashboard/student/${id}/assignments`}>
            <div className={styles.link_card}>
              <h4>Assignments</h4>
              <p>Check pending assignments</p>
            </div>
          </Link>
          <Link href={`/dashboard/student/${id}/grades`}>
            <div className={styles.link_card}>
              <h4>Grades</h4>
              <p>View your academic performance</p>
            </div>
          </Link>
          <Link href={`/dashboard/student/${id}/schedule`}>
            <div className={styles.link_card}>
              <h4>Schedule</h4>
              <p>Check your class timetable</p>
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
                className={styles.legend_color}
                style={{ background: '#3b82f6' }}
              ></span>
              <span>Current Semester</span>
            </div>
            <div className={styles.legend_item}>
              <span
                className={styles.legend_color}
                style={{ background: '#e2e8f0' }}
              ></span>
              <span>Class Average</span>
            </div>
          </div>
          {/* Chart will be integrated with a charting library like Chart.js or Recharts */}
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
