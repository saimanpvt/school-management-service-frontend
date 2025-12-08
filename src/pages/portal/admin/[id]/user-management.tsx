import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import PortalLayout from '../../../../components/PortalLayout';
import { apiServices } from '../../../../services/api';
import {
  Users,
  Plus,
  Search,
  Edit,
  Trash2,
  UserCheck,
  GraduationCap,
  BookOpen,
  Heart,
  MoreVertical,
  Eye,
  Award,
  DollarSign,
  User2,
  CalendarDays,
  TrendingUp,
} from 'lucide-react';
import UserForm, { UserFormData } from '../../../../components/UserForm';
import Alert from '../../../../components/Alert';
import { ProtectedRoute } from '../../../../lib/auth';
import styles from './admin.module.css';
import LoadingDots from '../../../../components/LoadingDots';

type UserType = 'student' | 'teacher' | 'parent' | 'admin';

interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  userID: string;
  role: number;
  phone?: string;
  address?: any;
  dob?: string;
  gender?: string;
  bloodGroup?: string;
  isActive: boolean;

  // Extended fields for comprehensive user data
  attendance?: {
    present: number;
    total: number;
    percentage: number;
  };
  exams?: {
    taken: number;
    passed: number;
    average: number;
  };
  progress?: {
    overall: number;
    currentLevel: string;
  };

  // Teacher specific
  courses?: string[];
  experience?: number;
  joinedDate?: string;
  expWithUs?: number;

  // Student specific
  classes?: string[];
  currentClassId?: string;
  timeWithUs?: number;
  feeStatus?: {
    status: 'paid' | 'pending' | 'overdue';
    amount: number;
    dueDate?: string;
  };
  parent?: {
    name: string;
    id: string;
    phone: string;
  };
  results?: {
    lastExam: string;
    grade: string;
    rank?: number;
  };
}

const UserManagement = () => {
  const router = useRouter();
  const { id } = router.query;
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeUserType, setActiveUserType] = useState<UserType>('student');
  const [showAddForm, setShowAddForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // Alert states
  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info' as 'info' | 'success' | 'warning' | 'error',
    confirmText: 'OK',
    cancelText: 'Cancel',
    showCancel: false,
    onConfirm: () => {},
  });
  const [formData, setFormData] = useState<UserFormData>({
    email: '',
    firstName: '',
    lastName: '',
    role: 'student', // Default to Student
    phone: '',
    userID: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
    },
    dob: '',
    gender: '',
    bloodGroup: '',
    // Role-specific fields
    employeeId: '',
    experience: '',
    DOJ: '',
    admissionDate: '',
    studentId: '',
    childrenId: '',
    classId: '',
  });

  // Role mappings
  const roleMap = {
    1: 'Admin',
    2: 'Teacher',
    3: 'Student',
    4: 'Parent',
  };

  const userTypeFilters = [
    {
      key: 'student' as UserType,
      label: 'Students',
      icon: GraduationCap,
      color: '#2563eb',
    },
    {
      key: 'teacher' as UserType,
      label: 'Teachers',
      icon: BookOpen,
      color: '#059669',
    },
    {
      key: 'parent' as UserType,
      label: 'Parents',
      icon: Heart,
      color: '#f59e0b',
    },
    {
      key: 'admin' as UserType,
      label: 'Admins',
      icon: UserCheck,
      color: '#7c3aed',
    },
  ];

  // Dynamic role options based on active user type
  const getRoleOptions = () => {
    const roleMap = {
      admin: [{ value: 'admin', label: 'Admin', color: '#7c3aed' }],
      teacher: [{ value: 'teacher', label: 'Teacher', color: '#059669' }],
      student: [{ value: 'student', label: 'Student', color: '#2563eb' }],
      parent: [{ value: 'parent', label: 'Parent', color: '#f59e0b' }],
    };
    return roleMap[activeUserType] || [];
  };

  const genderOptions = ['Male', 'Female', 'Other'];
  const bloodGroupOptions = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  useEffect(() => {
    if (id) {
      fetchUsers();
    }
  }, [id]);

  const fetchUsers = async () => {
    try {
      const response = await apiServices.users.getAll();
      console.log('API Response:', response); // Debug log

      if (response.success && response.data) {
        // Handle the backend response structure
        let allUsers: User[] = [];
        const responseData = response.data as any;

        // Collect users from different arrays in the response
        if (responseData.teachers) {
          allUsers = [...allUsers, ...responseData.teachers];
        }
        if (responseData.students) {
          allUsers = [...allUsers, ...responseData.students];
        }
        if (responseData.parents) {
          allUsers = [...allUsers, ...responseData.parents];
        }
        if (responseData.admins) {
          allUsers = [...allUsers, ...responseData.admins];
        }

        // Fallback to direct users array if available
        if (allUsers.length === 0 && responseData.users) {
          allUsers = responseData.users;
        }

        console.log('Processed user data:', allUsers); // Debug log
        setUsers(allUsers);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = (users || []).filter((user) => {
    // Filter by user type
    const roleMapping = {
      admin: 1,
      teacher: 2,
      student: 3,
      parent: 4,
    };
    const typeMatch = user.role === roleMapping[activeUserType];

    // Filter by search term
    const searchMatch =
      user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.userID?.toLowerCase().includes(searchTerm.toLowerCase());

    return typeMatch && searchMatch;
  });

  const handleDelete = async (userId: string, userName: string) => {
    setAlertConfig({
      isOpen: true,
      title: 'Confirm Delete',
      message: `Are you sure you want to delete "${userName}"? This action cannot be undone.`,
      type: 'warning',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      showCancel: true,
      onConfirm: async () => {
        try {
          await apiServices.users.delete(userId);
          setUsers(users.filter((u) => u._id !== userId));
          showSuccessAlert('User deleted successfully!');
        } catch (error) {
          console.error('Error deleting user:', error);
          showErrorAlert('Failed to delete user. Please try again.');
        }
        closeAlert();
      },
    });
  };

  // Helper functions for alerts
  const showSuccessAlert = (message: string) => {
    setAlertConfig({
      isOpen: true,
      title: 'Success',
      message,
      type: 'success',
      confirmText: 'OK',
      cancelText: 'Cancel',
      showCancel: false,
      onConfirm: () => {},
    });
  };

  const showErrorAlert = (message: string) => {
    setAlertConfig({
      isOpen: true,
      title: 'Error',
      message,
      type: 'error',
      confirmText: 'OK',
      cancelText: 'Cancel',
      showCancel: false,
      onConfirm: () => {},
    });
  };

  const closeAlert = () => {
    setAlertConfig((prev) => ({ ...prev, isOpen: false }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // For edit mode, password is not required
    if (!isEditMode && !generatedPassword) {
      showErrorAlert('Please generate a password first');
      return;
    }

    try {
      const userData = {
        ...formData,
        ...(generatedPassword && { password: generatedPassword }), // Only include password if present
        role: formData.role, // Send role as string directly (student, teacher, parent, admin)
      };

      console.log('Sending user data with role as string:', userData);
      console.log('Role being sent:', userData.role, typeof userData.role);

      let response: any;
      if (isEditMode && editingUserId) {
        // Update existing user
        response = await apiServices.users.update(editingUserId, userData);
        if (response.success) {
          showSuccessAlert('User updated successfully!');
          // Update the user in the local state
          setUsers(
            users.map((user) =>
              user._id === editingUserId ? { ...user, ...response.data } : user
            )
          );
          setShowAddForm(false);
          resetForm();
        }
      } else {
        // Create new user
        response = await apiServices.users.create(userData);
        if (response.success) {
          await apiServices.admin.sendCredentialsEmail({
            email: formData.email,
            password: generatedPassword,
            userID: formData.userID,
            firstName: formData.firstName,
          });
          showSuccessAlert(
            'User created successfully and credentials sent via email!'
          );
          setUsers([...users, response.data]);
          setShowAddForm(false);
          resetForm();
        }
      }
    } catch (error) {
      console.error('Error saving user:', error);
      showErrorAlert(
        `Failed to ${isEditMode ? 'update' : 'create'} user. Please try again.`
      );
    }
  };

  const resetForm = () => {
    setFormData({
      email: '',
      firstName: '',
      lastName: '',
      role: 'student',
      phone: '',
      userID: '',
      address: { street: '', city: '', state: '', zipCode: '', country: '' },
      dob: '',
      gender: '',
      bloodGroup: '',
      // Role-specific fields
      employeeId: '',
      experience: '',
      DOJ: '',
      admissionDate: '',
      studentId: '',
      childrenId: '',
      classId: '',
    });
    setGeneratedPassword('');
    setShowPassword(false);
    setIsEditMode(false);
    setEditingUserId(null);
  };

  // Handle edit user
  const handleEditUser = (user: User) => {
    // Convert user data to form format
    setFormData({
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: getRoleString(user.role),
      phone: user.phone || '',
      userID: user.userID,
      address: {
        street: user.address?.street || '',
        city: user.address?.city || '',
        state: user.address?.state || '',
        zipCode: user.address?.zipCode || '',
        country: user.address?.country || '',
      },
      dob: user.dob || '',
      gender: user.gender || '',
      bloodGroup: user.bloodGroup || '',
      // Role-specific fields - you may need to adjust based on your user data structure
      employeeId: (user as any).employeeId || '',
      experience: (user as any).experience || '',
      DOJ: (user as any).DOJ || '',
      admissionDate: (user as any).admissionDate || '',
      studentId: (user as any).studentId || '',
      childrenId: (user as any).childrenId || '',
      classId: (user as any).classId || '',
    });
    setIsEditMode(true);
    setEditingUserId(user._id);
    setShowAddForm(true);
    setOpenDropdown(null);
  };

  // Helper function to convert role number to string
  const getRoleString = (roleNumber: number): string => {
    const roleMapping = {
      1: 'admin',
      2: 'teacher',
      3: 'student',
      4: 'parent',
    };
    return roleMapping[roleNumber as keyof typeof roleMapping] || 'student';
  };

  const getRoleColor = (role: number) => {
    const colors: Record<number, string> = {
      1: '#7c3aed', // Admin - Red
      2: '#059669', // Teacher - Green
      3: '#2563eb', // Student - Blue
      4: '#f59e0b', // Parent - Yellow
    };
    return colors[role] || '#6b7280';
  };

  // Helper function to get display value or dash
  const getDisplayValue = (value: any, defaultValue: string = '-') => {
    return value ? value : defaultValue;
  };

  const getPercentageColor = (percentage: number) => {
    if (percentage >= 90) return '#059669'; // Green
    if (percentage >= 75) return '#f59e0b'; // Yellow
    return '#dc2626'; // Red
  };

  // Navigation handlers
  const handleViewDetails = (userId: string, userRole: number) => {
    const roleRoutes = {
      1: `/portal/admin/${id}/users/${userId}`, // Admin details
      2: `/portal/admin/${id}/teacher-details/${userId}`, // Teacher details
      3: `/portal/admin/${id}/student-details/${userId}`, // Student details
      4: `/portal/admin/${id}/parent-details/${userId}`, // Parent details
    };
    router.push(roleRoutes[userRole as keyof typeof roleRoutes] || '#');
  };

  const handleViewAttendance = (userId: string) => {
    router.push(`/portal/admin/${id}/attendance/${userId}`);
  };

  const handleViewExams = (userId: string) => {
    router.push(`/portal/admin/${id}/exams/${userId}`);
  };

  const handleViewProgress = (userId: string) => {
    router.push(`/portal/admin/${id}/progress/${userId}`);
  };

  const handleViewFees = (userId: string) => {
    router.push(`/portal/admin/${id}/fees/${userId}`);
  };

  const handleViewParent = (parentId: string) => {
    router.push(`/portal/admin/${id}/parent-details/${parentId}`);
  };

  const handleViewResults = (userId: string) => {
    router.push(`/portal/admin/${id}/results/${userId}`);
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
      {showAddForm && (
        <UserForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
          onClose={() => {
            setShowAddForm(false);
            resetForm();
          }}
          generatedPassword={generatedPassword}
          setGeneratedPassword={setGeneratedPassword}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          roleOptions={getRoleOptions()}
          genderOptions={genderOptions}
          bloodGroupOptions={bloodGroupOptions}
          activeUserType={activeUserType}
          isEdit={isEditMode}
        />
      )}

      <header className={styles.pageHeader}>
        <div>
          <h1>User Management</h1>
          <p>
            Manage all users in the system - admins, teachers, students, and
            parents
          </p>
        </div>
      </header>

      {/* User Type Filter Tabs - At the top */}
      <div className={styles.filterTabs}>
        {userTypeFilters.map((filter) => {
          const Icon = filter.icon;
          const isActive = activeUserType === filter.key;
          const count = users.filter(
            (u) =>
              u.role ===
              (filter.key === 'admin'
                ? 1
                : filter.key === 'teacher'
                ? 2
                : filter.key === 'student'
                ? 3
                : 4)
          ).length;

          return (
            <button
              key={filter.key}
              className={`${styles.filterTab} ${isActive ? styles.active : ''}`}
              onClick={() => setActiveUserType(filter.key)}
              style={{
                borderColor: isActive ? filter.color : '#e5e7eb',
                color: isActive ? filter.color : '#6b7280',
              }}
            >
              <Icon size={18} />
              <span>{filter.label}</span>
              <span className={styles.count}>{count}</span>
            </button>
          );
        })}
      </div>

      {/* Action bar below tabs */}
      <div className={styles.actionBar}>
        <div className={styles.searchBox}>
          <Search size={18} />
          <input
            type="text"
            placeholder={`Search ${activeUserType}s...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        <div className={styles.addButtons}>
          <button
            className={`${styles.createBtn} ${styles[activeUserType]}`}
            onClick={() => {
              // Reset form and set the role based on active tab
              resetForm();
              setFormData((prev) => ({ ...prev, role: activeUserType }));
              setShowAddForm(true);
            }}
          >
            <Plus size={18} />
            Add{' '}
            {activeUserType.charAt(0).toUpperCase() + activeUserType.slice(1)}
          </button>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.dataTable}>
          <thead>
            <tr>
              <th style={{ textAlign: 'center' }}>ID</th>
              <th>Name</th>
              <th style={{ textAlign: 'center' }}>Exams</th>
              <th style={{ textAlign: 'center' }}>Progress</th>
              <th style={{ textAlign: 'center' }}>Attendance</th>
              {activeUserType === 'teacher' && <th>Courses</th>}
              {activeUserType === 'student' && (
                <>
                  <th>Class</th>
                  <th>Fee Status</th>
                </>
              )}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => {
                return (
                  <tr key={user._id}>
                    {/* Essential columns for all users */}
                    <td style={{ textAlign: 'center' }}>
                      <span
                        className={styles.clickable}
                        onClick={() => handleViewDetails(user._id, user.role)}
                        style={{
                          color: getRoleColor(user.role),
                          fontWeight: '600',
                        }}
                      >
                        {user.userID || 'N/A'}
                      </span>
                    </td>

                    <td>
                      <div className={styles.userInfo}>
                        <span
                          className={styles.clickable}
                          onClick={() => handleViewDetails(user._id, user.role)}
                          style={{ fontWeight: '600' }}
                        >
                          {user.firstName} {user.lastName}
                        </span>
                        <small style={{ color: '#6b7280', display: 'block' }}>
                          {user.email}
                        </small>
                      </div>
                    </td>

                    <td>
                      <div
                        className={styles.clickable}
                        onClick={() => handleViewExams(user._id)}
                        style={{ textAlign: 'center' }}
                      >
                        <div style={{ fontWeight: '600', color: '#059669' }}>
                          {getDisplayValue(user.exams?.taken)}
                        </div>
                        <small style={{ color: '#6b7280' }}>
                          Avg:{' '}
                          {getDisplayValue(
                            user.exams?.average
                              ? `${user.exams.average}%`
                              : null
                          )}
                        </small>
                      </div>
                    </td>

                    <td>
                      <div
                        className={styles.clickable}
                        onClick={() => handleViewProgress(user._id)}
                        style={{ textAlign: 'center' }}
                      >
                        <div
                          style={{
                            fontWeight: '600',
                            color: user.progress?.overall
                              ? getPercentageColor(user.progress.overall)
                              : '#6b7280',
                          }}
                        >
                          {getDisplayValue(
                            user.progress?.overall
                              ? `${user.progress.overall}%`
                              : null
                          )}
                        </div>
                        <small style={{ color: '#6b7280' }}>
                          {getDisplayValue(user.progress?.currentLevel)}
                        </small>
                      </div>
                    </td>

                    <td>
                      <div
                        className={styles.clickable}
                        onClick={() => handleViewAttendance(user._id)}
                        style={{ textAlign: 'center' }}
                      >
                        <div
                          style={{
                            fontWeight: '600',
                            color: user.attendance?.percentage
                              ? getPercentageColor(user.attendance.percentage)
                              : '#6b7280',
                          }}
                        >
                          {getDisplayValue(
                            user.attendance?.percentage
                              ? `${user.attendance.percentage}%`
                              : null
                          )}
                        </div>
                        <small style={{ color: '#6b7280' }}>
                          {user.attendance?.present && user.attendance?.total
                            ? `${user.attendance.present}/${user.attendance.total}`
                            : '-/-'}
                        </small>
                      </div>
                    </td>

                    {/* Teacher-specific columns */}
                    {activeUserType === 'teacher' && (
                      <td>
                        <div
                          className={styles.clickable}
                          onClick={() => handleViewDetails(user._id, user.role)}
                          style={{ fontSize: '0.875rem' }}
                        >
                          <strong style={{ color: getRoleColor(user.role) }}>
                            ({getDisplayValue(user.courses?.length, '0')})
                          </strong>
                          <div
                            style={{ color: '#6b7280', fontSize: '0.75rem' }}
                          >
                            {user.courses?.length
                              ? user.courses.slice(0, 2).join(', ')
                              : 'No courses'}
                            {(user.courses?.length || 0) > 2 && '...'}
                          </div>
                        </div>
                      </td>
                    )}

                    {/* Student-specific columns */}
                    {activeUserType === 'student' && (
                      <>
                        <td>
                          <div
                            className={styles.clickable}
                            onClick={() =>
                              handleViewDetails(user._id, user.role)
                            }
                            style={{ fontSize: '0.875rem' }}
                          >
                            <div
                              style={{
                                fontWeight: '600',
                                color: getRoleColor(user.role),
                              }}
                            >
                              {getDisplayValue(user.currentClassId)}
                            </div>
                            <div
                              style={{ color: '#6b7280', fontSize: '0.75rem' }}
                            >
                              {getDisplayValue(user.classes?.[0], 'No class')}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div
                            className={styles.clickable}
                            onClick={() => handleViewFees(user._id)}
                            style={{ textAlign: 'center' }}
                          >
                            <span
                              className={styles.statusBadge}
                              style={{
                                backgroundColor:
                                  user.feeStatus?.status === 'paid'
                                    ? '#dcfce7'
                                    : user.feeStatus?.status === 'pending'
                                    ? '#fef3c7'
                                    : '#fee2e2',
                                color:
                                  user.feeStatus?.status === 'paid'
                                    ? '#166534'
                                    : user.feeStatus?.status === 'pending'
                                    ? '#92400e'
                                    : '#991b1b',
                                padding: '2px 8px',
                                borderRadius: '12px',
                                fontSize: '0.75rem',
                                fontWeight: '600',
                              }}
                            >
                              {getDisplayValue(
                                user.feeStatus?.status,
                                'Unknown'
                              )}
                            </span>
                          </div>
                        </td>
                      </>
                    )}

                    {/* Actions dropdown */}
                    <td>
                      <div className={styles.actionDropdown}>
                        <button
                          className={styles.moreBtn}
                          onClick={() =>
                            setOpenDropdown(
                              openDropdown === user._id ? null : user._id
                            )
                          }
                        >
                          <MoreVertical size={16} />
                        </button>

                        {openDropdown === user._id && (
                          <div className={styles.dropdownMenu}>
                            <button
                              onClick={() => {
                                handleViewDetails(user._id, user.role);
                                setOpenDropdown(null);
                              }}
                            >
                              <Eye size={14} />
                              View Details
                            </button>

                            <button
                              onClick={() => {
                                handleEditUser(user);
                                setOpenDropdown(null);
                              }}
                            >
                              <Edit size={14} />
                              Edit User
                            </button>

                            <button
                              onClick={() => {
                                handleViewAttendance(user._id);
                                setOpenDropdown(null);
                              }}
                            >
                              <CalendarDays size={14} />
                              View Attendance
                            </button>

                            <button
                              onClick={() => {
                                handleViewExams(user._id);
                                setOpenDropdown(null);
                              }}
                            >
                              <Award size={14} />
                              View Exams
                            </button>

                            <button
                              onClick={() => {
                                handleViewProgress(user._id);
                                setOpenDropdown(null);
                              }}
                            >
                              <TrendingUp size={14} />
                              View Progress
                            </button>

                            {activeUserType === 'student' && (
                              <>
                                <button
                                  onClick={() => {
                                    handleViewFees(user._id);
                                    setOpenDropdown(null);
                                  }}
                                >
                                  <DollarSign size={14} />
                                  View Fees
                                </button>

                                <button
                                  onClick={() => {
                                    handleViewParent(user.parent?.id || '');
                                    setOpenDropdown(null);
                                  }}
                                >
                                  <User2 size={14} />
                                  View Parent
                                </button>

                                <button
                                  onClick={() => {
                                    handleViewResults(user._id);
                                    setOpenDropdown(null);
                                  }}
                                >
                                  <Award size={14} />
                                  View Results
                                </button>
                              </>
                            )}

                            <hr
                              style={{
                                margin: '4px 0',
                                border: 'none',
                                borderTop: '1px solid #e5e7eb',
                              }}
                            />

                            <button className={styles.editAction}>
                              <Edit size={14} />
                              Edit User
                            </button>

                            <button
                              className={styles.deleteAction}
                              onClick={() => {
                                handleDelete(
                                  user._id,
                                  `${user.firstName} ${user.lastName}`
                                );
                                setOpenDropdown(null);
                              }}
                            >
                              <Trash2 size={14} />
                              Delete User
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={
                    activeUserType === 'teacher'
                      ? 7
                      : activeUserType === 'student'
                      ? 8
                      : 6
                  }
                  className={styles.emptyState}
                >
                  <Users size={48} />
                  <h3>No users found</h3>
                  <p>
                    {searchTerm
                      ? 'Try a different search term'
                      : `No ${activeUserType}s in the system`}
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {openDropdown && (
        <div
          className={styles.dropdownOverlay}
          onClick={() => setOpenDropdown(null)}
        />
      )}

      {/* User Form Modal */}
      {showAddForm && (
        <UserForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
          onClose={() => {
            setShowAddForm(false);
            setIsEditMode(false);
            setEditingUserId(null);
            resetForm();
          }}
          generatedPassword={generatedPassword}
          setGeneratedPassword={setGeneratedPassword}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          roleOptions={[
            { value: 'admin', label: 'Admin', color: '#7c3aed' },
            { value: 'teacher', label: 'Teacher', color: '#059669' },
            { value: 'student', label: 'Student', color: '#2563eb' },
            { value: 'parent', label: 'Parent', color: '#dc2626' },
          ]}
          genderOptions={['Male', 'Female', 'Other']}
          bloodGroupOptions={['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']}
          activeUserType={activeUserType}
          isEdit={isEditMode}
        />
      )}

      {/* Alert Component */}
      <Alert
        isOpen={alertConfig.isOpen}
        onClose={closeAlert}
        onConfirm={alertConfig.onConfirm}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        confirmText={alertConfig.confirmText}
        cancelText={alertConfig.cancelText}
        showCancel={alertConfig.showCancel}
        showConfirm={true}
      />
    </PortalLayout>
  );
};

export default function ProtectedUserManagement() {
  return (
    <ProtectedRoute roles={['Admin']}>
      <UserManagement />
    </ProtectedRoute>
  );
}
