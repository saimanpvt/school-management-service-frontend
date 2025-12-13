import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import PortalLayout from '../../../../components/PortalLayout/PortalLayout';
import { apiServices } from '../../../../services/api';
import {
  Users,
  GraduationCap,
  Calendar,
  CheckCircle,
  XCircle,
  Search,
  Download,
  RefreshCw,
  TrendingUp,
  AlertTriangle,
  User,
} from 'lucide-react';
import { ProtectedRoute } from '../../../../lib/auth';
import {
  generateMockAttendanceData,
  filterAttendanceData,
  calculateAttendanceStats
} from '../../../../lib/helpers';
import { useNotification } from '../../../../components/Toaster';
import styles from './admin.module.css';
import LoadingDots from '../../../../components/LoadingDots/LoadingDots';

interface AttendanceRecord {
  _id: string;
  userId: string;
  firstName: string;
  lastName: string;
  userID: string;
  email: string;
  role: number;
  attendance: {
    present: number;
    total: number;
    percentage: number;
    lastPresent?: string;
    streak?: number;
  };
  recentAttendance: {
    date: string;
    status: 'present' | 'absent' | 'late';
  }[];
}

const AdminAttendance = () => {
  const router = useRouter();
  const { id } = router.query;
  const { addNotification } = useNotification();
  const [activeTab, setActiveTab] = useState<'students' | 'teachers'>(
    'students'
  );
  const [students, setStudents] = useState<AttendanceRecord[]>([]);
  const [teachers, setTeachers] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [filterStatus, setFilterStatus] = useState<
    'all' | 'present' | 'absent' | 'low'
  >('all');

  const fetchAttendanceData = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);

      // Fetch all users and filter by role
      const usersResponse = await apiServices.users.getAll();

      let studentsResponse: { success: boolean; data: AttendanceRecord[] } = { success: false, data: [] };
      let teachersResponse: { success: boolean; data: AttendanceRecord[] } = { success: false, data: [] };
      if (usersResponse.success && Array.isArray(usersResponse.data)) {
        studentsResponse = {
          success: true,
          data: usersResponse.data.filter(
            (user: { role: number }) => user.role === 3
          ),
        };
        teachersResponse = {
          success: true,
          data: usersResponse.data.filter(
            (user: { role: number }) => user.role === 2
          ),
        };
      }

      if (studentsResponse.success) {
        // Transform student data to include mock attendance
        const studentsWithAttendance = studentsResponse.data.map(generateMockAttendanceData);
        setStudents(studentsWithAttendance);
      }

      if (teachersResponse.success) {
        // Transform teacher data to include mock attendance  
        const teachersWithAttendance = teachersResponse.data.map(generateMockAttendanceData);
        setTeachers(teachersWithAttendance);
      }
    } catch (error) {
      console.error('Error fetching attendance data:', error);
      addNotification({
        type: 'error',
        title: 'Failed to fetch attendance data',
        message: 'Please try refreshing the page.'
      });
    } finally {
      setLoading(false);
    }
  }, [id, addNotification]);

  useEffect(() => {
    fetchAttendanceData();
  }, [fetchAttendanceData, selectedDate]);



  const getCurrentData = () => {
    return activeTab === 'students' ? students : teachers;
  };

  const filteredData = filterAttendanceData(getCurrentData(), searchTerm, filterStatus);

  const stats = calculateAttendanceStats(getCurrentData());

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present':
        return '#22c55e';
      case 'absent':
        return '#ef4444';
      case 'late':
        return '#f59e0b';
      default:
        return '#6b7280';
    }
  };

  const getAttendanceColor = (percentage: number) => {
    if (percentage >= 90) return '#22c55e';
    if (percentage >= 75) return '#f59e0b';
    return '#ef4444';
  };

  const handleMarkAttendance = (
    userId: string,
    status: 'present' | 'absent'
  ) => {
    // This would integrate with your attendance API
    console.log(`Marking ${userId} as ${status} for ${selectedDate}`);

    // Update local state for demo
    const updateData = activeTab === 'students' ? setStudents : setTeachers;
    updateData((prev) =>
      prev.map((record) =>
        record._id === userId
          ? {
            ...record,
            recentAttendance: [
              { date: selectedDate, status },
              ...(record.recentAttendance || []).slice(1),
            ],
          }
          : record
      )
    );
  };

  if (loading) {
    return (
      <PortalLayout userName="Admin" userRole="admin">
        <div className={styles.loading}>
          <LoadingDots />
        </div>
      </PortalLayout>
    );
  }

  return (
    <PortalLayout userName="Admin" userRole="admin">
      <div className={styles.pageContainer}>
        {/* Page Header */}
        <div className={styles.pageHeader}>
          <div className={styles.headerLeft}>
            <h1 className={styles.pageTitle}>
              <Calendar className={styles.pageIcon} />
              Attendance Management
            </h1>
            <p className={styles.pageSubtitle}>
              Monitor and manage attendance for students and teachers
            </p>
          </div>
          <div className={styles.headerActions}>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className={styles.dateInput}
            />
            <button className={styles.actionBtn}>
              <Download size={18} />
              Export Report
            </button>
            <button className={styles.actionBtn} onClick={fetchAttendanceData}>
              <RefreshCw size={18} />
              Refresh
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: '#dbeafe' }}>
              <Users size={24} style={{ color: '#3b82f6' }} />
            </div>
            <div className={styles.statInfo}>
              <h3>Total {activeTab}</h3>
              <p className={styles.statNumber}>{stats.totalUsers}</p>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: '#dcfce7' }}>
              <CheckCircle size={24} style={{ color: '#22c55e' }} />
            </div>
            <div className={styles.statInfo}>
              <h3>Present Today</h3>
              <p className={styles.statNumber}>{stats.presentToday}</p>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: '#fee2e2' }}>
              <XCircle size={24} style={{ color: '#ef4444' }} />
            </div>
            <div className={styles.statInfo}>
              <h3>Absent Today</h3>
              <p className={styles.statNumber}>{stats.absentToday}</p>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: '#fef3c7' }}>
              <TrendingUp size={24} style={{ color: '#d97706' }} />
            </div>
            <div className={styles.statInfo}>
              <h3>Average Attendance</h3>
              <p className={styles.statNumber}>
                {stats.avgAttendance.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        {/* Enhanced Tabs */}
        <div className={styles.tabsContainer}>
          <div className={styles.tabsHeader}>
            <button
              className={`${styles.tabBtn} ${activeTab === 'students' ? styles.tabBtnActive : ''
                }`}
              onClick={() => {
                setActiveTab('students');
                setSearchTerm(''); // Reset search when switching tabs
                setFilterStatus('all'); // Reset filter when switching tabs
              }}
            >
              <GraduationCap size={18} />
              Students ({students.length})
            </button>
            <button
              className={`${styles.tabBtn} ${activeTab === 'teachers' ? styles.tabBtnActive : ''
                }`}
              onClick={() => {
                setActiveTab('teachers');
                setSearchTerm(''); // Reset search when switching tabs
                setFilterStatus('all'); // Reset filter when switching tabs
              }}
            >
              <Users size={18} />
              Teachers ({teachers.length})
            </button>
          </div>

          {/* Tab Content */}
          <div className={styles.tabContent}>
            {/* Filters */}
            <div className={styles.filtersRow}>
              <div className={styles.searchContainer}>
                <Search className={styles.searchIcon} />
                <input
                  type="text"
                  placeholder={`Search ${activeTab}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={styles.searchInput}
                />
              </div>

              <select
                value={filterStatus}
                onChange={(e) =>
                  setFilterStatus(
                    e.target.value as 'all' | 'present' | 'absent' | 'low'
                  )
                }
                className={styles.filterSelect}
              >
                <option value="all">All Status</option>
                <option value="present">Excellent Attendance (90%+)</option>
                <option value="absent">Absent Today</option>
                <option value="low">Low Attendance (&lt;75%)</option>
              </select>
            </div>

            {/* Attendance Table */}
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>ID</th>
                    <th>Email</th>
                    <th>Overall %</th>
                    <th>Present/Total</th>
                    <th>Streak</th>
                    <th>Recent 7 Days</th>
                    <th>Today&apos;s Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((record) => (
                    <tr key={record._id}>
                      <td>
                        <div className={styles.userInfo}>
                          <div className={styles.userAvatar}>
                            {activeTab === 'students' ? (
                              <GraduationCap size={16} />
                            ) : (
                              <User size={16} />
                            )}
                          </div>
                          <div>
                            <div className={styles.userName}>
                              {record.firstName || ''} {record.lastName || ''}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>{record.userID || 'N/A'}</td>
                      <td>{record.email || 'N/A'}</td>
                      <td>
                        <span
                          className={styles.attendancePercentage}
                          style={{
                            color: getAttendanceColor(
                              record.attendance?.percentage || 0
                            ),
                          }}
                        >
                          {record.attendance?.percentage || 0}%
                        </span>
                      </td>
                      <td>
                        {record.attendance?.present || 0}/
                        {record.attendance?.total || 0}
                      </td>
                      <td>
                        <span className={styles.streak}>
                          🔥 {record.attendance?.streak || 0} days
                        </span>
                      </td>
                      <td>
                        <div className={styles.recentAttendance}>
                          {(record.recentAttendance || []).map((day: { date: string; status: string }, index: number) => (
                            <div
                              key={index}
                              className={styles.attendanceDay}
                              style={{
                                backgroundColor: getStatusColor(
                                  day?.status || 'unknown'
                                ),
                              }}
                              title={`${day?.date || 'N/A'}: ${day?.status || 'unknown'
                                }`}
                            />
                          ))}
                        </div>
                      </td>
                      <td>
                        <span
                          className={`${styles.statusBadge} ${styles[
                            record.recentAttendance?.[0]?.status || 'unknown'
                          ]
                            }`}
                        >
                          {record.recentAttendance?.[0]?.status || 'Not marked'}
                        </span>
                      </td>
                      <td>
                        <div className={styles.actionButtons}>
                          <button
                            className={`${styles.actionBtn} ${styles.presentBtn}`}
                            onClick={() =>
                              handleMarkAttendance(record._id, 'present')
                            }
                            title="Mark Present"
                          >
                            <CheckCircle size={16} />
                          </button>
                          <button
                            className={`${styles.actionBtn} ${styles.absentBtn}`}
                            onClick={() =>
                              handleMarkAttendance(record._id, 'absent')
                            }
                            title="Mark Absent"
                          >
                            <XCircle size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredData.length === 0 && (
                <div className={styles.emptyState}>
                  <AlertTriangle size={48} />
                  <h3>No {activeTab} found</h3>
                  <p>Try adjusting your search or filter criteria.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
};

export default function ProtectedAdminAttendance() {
  return (
    <ProtectedRoute roles={['Admin']}>
      <AdminAttendance />
    </ProtectedRoute>
  );
}
