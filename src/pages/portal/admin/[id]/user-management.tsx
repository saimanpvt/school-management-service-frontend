import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import PortalLayout from '../../../../components/PortalLayout/PortalLayout';
import { apiServices } from '../../../../services/api';
import {
  Users,
  Plus,
  Search,
  Trash2,
  UserCheck,
  GraduationCap,
  BookOpen,
  Heart,
} from 'lucide-react';
import UserForm, {
  UserFormData,
} from '../../../../components/UserForm/UserForm';
import Alert from '../../../../components/Alert/Alert';
import { ProtectedRoute } from '../../../../lib/auth';
import styles from './admin.module.css';
import LoadingDots from '../../../../components/LoadingDots/LoadingDots';

type UserType = 'student' | 'teacher' | 'parent' | 'admin';

// Backend now handles all data mapping and role-based filtering
// No need for separate API response interfaces

interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  userID?: string;
  role: number;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  dob?: string;
  gender?: string;
  bloodGroup?: string;
  isActive: boolean;

  // Extended fields for comprehensive user data
  attendance?: {
    present: number;
    total: number;
    percentage: number;
    streak?: number;
  };
  exams?: {
    taken: number;
    passed?: number;
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

  // Dynamic role options based on active user type - FIXED to prevent role changes
  const getRoleOptions = () => {
    // Return only the role for the current tab - user cannot change role
    const options = {
      admin: [{ value: 'admin', label: 'Admin', color: '#7c3aed' }],
      teacher: [{ value: 'teacher', label: 'Teacher', color: '#059669' }],
      student: [{ value: 'student', label: 'Student', color: '#2563eb' }],
      parent: [{ value: 'parent', label: 'Parent', color: '#f59e0b' }],
    };
    return options[activeUserType] || [];
  };

  const genderOptions = ['Male', 'Female', 'Other'];
  const bloodGroupOptions = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']; // Add all dependencies

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      // Simple API call - backend handles everything
      const response = await apiServices.users.getAll();
      console.log('API Response:', response); // Debug log

      if (response.success && response.data) {
        // Handle API response structure: { students: [], teachers: [], parent: [] }
        let userData: User[] = [];

        if (Array.isArray(response.data)) {
          userData = response.data as User[];
        } else if (response.data && typeof response.data === 'object') {
          const data = response.data as Record<string, User[]>;

          // Parse students array
          if (data.students && Array.isArray(data.students)) {
            const students = data.students.map((student) => ({
              _id: student.userId || student._id,
              email: student.userId?.email || '',
              firstName: student.fullName?.split(' ')[0] || '',
              lastName: student.fullName?.split(' ').slice(1).join(' ') || '',
              userID: student.userRefId || student.userId,
              role: 3, // Student role
              // Add student-specific data
              admissionDate: student.admissionDate,
              timeWithUs: student.timeWithUs,
              classes: student.classes,
              parentName: student.parentName,
              ...student,
            }));
            userData = [...userData, ...students];
          }

          // Parse teachers array
          if (data.teachers && Array.isArray(data.teachers)) {
            const teachers = data.teachers.map((teacher) => ({
              _id: teacher.dbId || teacher._id,
              email: teacher.userId?.email || '',
              firstName: teacher.fullName?.split(' ')[0] || '',
              lastName: teacher.fullName?.split(' ').slice(1).join(' ') || '',
              userID: teacher.userId || teacher.userRefId,
              role: 2, // Teacher role
              // Add teacher-specific data
              experience: teacher.experience,
              empId: teacher.empId,
              ...teacher,
            }));
            userData = [...userData, ...teachers];
          }

          // Parse parent array (note: it's 'parent' not 'parents' in your API)
          if (data.parent && Array.isArray(data.parent)) {
            const parents = data.parent.map((parent) => ({
              _id: parent._id,
              email: parent.email || '',
              firstName: parent.firstName || '',
              lastName: parent.lastName || '',
              userID: parent.userID || parent.uuid,
              role: 4, // Parent role
              ...parent,
            }));
            userData = [...userData, ...parents];
          }
        }

        setUsers(userData || []);
      } else {
        setUsers([]);
      }
    } catch (error) {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []); // No dependencies needed - simple API call

  useEffect(() => {
    if (id) {
      fetchUsers();
    }
  }, [id, activeUserType, fetchUsers]);

  const filteredUsers = Array.isArray(users)
    ? users.filter((user) => {
        // Filter by user type
        const roleMap = { admin: 1, teacher: 2, student: 3, parent: 4 };
        const typeMatch = user.role === roleMap[activeUserType];

        // Filter by search term
        const searchMatch =
          user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.userID?.toLowerCase().includes(searchTerm.toLowerCase());

        return typeMatch && searchMatch;
      })
    : [];

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
      // Send only REQUIRED fields based on role (matching your backend validation)
      const requiredBaseFields = [
        'email',
        'firstName',
        'lastName',
        'role',
        'userID',
      ];

      // Role-specific REQUIRED fields (from your backend controller)
      const roleRequiredFields: Record<string, string[]> = {
        admin: [], // Admin only needs base required fields
        teacher: ['employeeId', 'experience', 'DOJ'], // MUST send these for teacher
        student: ['studentId', 'admissionDate', 'classId'], // MUST send these for student
        parent: ['childrenId'], // MUST send this for parent
      };

      // Optional fields that can be included if present
      const optionalFields = [
        'phone',
        'dob',
        'gender',
        'bloodGroup',
        'address',
      ];

      // Build final payload with required + optional fields
      const requiredFields = [
        ...requiredBaseFields,
        ...(roleRequiredFields[formData.role] || []),
      ];

      const userData: Record<string, unknown> = {};

      // Add required fields (must be present)
      requiredFields.forEach((field) => {
        userData[field] = formData[field as keyof UserFormData] || '';
      });

      // Add optional fields (only if they have values)
      optionalFields.forEach((field) => {
        const value = formData[field as keyof UserFormData];
        if (value !== undefined && value !== '' && value !== null) {
          userData[field] = value;
        }
      });

      // Add password only if present
      if (generatedPassword) {
        userData.password = generatedPassword;
      }

      console.log('Sending filtered user data:', userData);

      let response: { success?: boolean; message?: string; data?: User };
      if (isEditMode && editingUserId) {
        // Update existing user
        response = await apiServices.users.update(editingUserId, userData);
        if (response.success) {
          showSuccessAlert('User updated successfully!');
          // Update the user in the local state
          // Refresh the user list after update
          fetchUsers();
          setShowAddForm(false);
          resetForm();
        }
      } else {
        // Create new user
        response = await apiServices.users.create(userData);
        if (response.success) {
          showSuccessAlert(
            'User created successfully! Password: ' + generatedPassword
          );
          // Refresh the user list after creation
          fetchUsers();
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
      role: activeUserType, // Set role based on current active tab
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
  const getDisplayValue = (
    value: unknown,
    defaultValue: string = '-'
  ): string | number => {
    if (value === null || value === undefined || value === '') {
      return defaultValue;
    }
    return String(value);
  };

  const getPercentageColor = (percentage: number) => {
    if (percentage >= 90) return '#059669'; // Green
    if (percentage >= 75) return '#f59e0b'; // Yellow
    return '#dc2626'; // Red
  };

  // Navigation handler for ID clicks only
  const handleViewDetails = (userId: string, userRole: number) => {
    const roleRoutes = {
      1: `/portal/admin/${id}/users/${userId}`, // Admin details
      2: `/portal/admin/${id}/teacher-details/${userId}`, // Teacher details
      3: `/portal/admin/${id}/student-details/${userId}`, // Student details
      4: `/portal/admin/${id}/parent-details/${userId}`, // Parent details
    };
    router.push(roleRoutes[userRole as keyof typeof roleRoutes] || '#');
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
              <th style={{ textAlign: 'center' }}>Name</th>
              <th style={{ textAlign: 'center' }}>Attendance</th>
              <th style={{ textAlign: 'center' }}>Fees</th>
              <th style={{ textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => {
                return (
                  <tr key={user._id}>
                    {/* ID Column */}
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

                    {/* Name Column */}
                    <td style={{ paddingLeft: '16px' }}>
                      <div className={styles.userInfo}>
                        <span style={{ fontWeight: '600' }}>
                          {user.firstName} {user.lastName}
                        </span>
                        <small style={{ color: '#6b7280', display: 'block' }}>
                          {user.email}
                        </small>
                      </div>
                    </td>

                    {/* Attendance Column */}
                    <td style={{ textAlign: 'center' }}>
                      <div>
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

                    {/* Fees Column */}
                    <td style={{ textAlign: 'center' }}>
                      <div>
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
                          {getDisplayValue(user.feeStatus?.status, 'N/A')}
                        </span>
                        {user.feeStatus?.amount && (
                          <div
                            style={{
                              fontSize: '0.75rem',
                              color: '#6b7280',
                              marginTop: '2px',
                            }}
                          >
                            ${user.feeStatus.amount}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Actions Column - Only Delete Button */}
                    <td style={{ textAlign: 'center' }}>
                      <button
                        className={styles.deleteBtn}
                        onClick={() =>
                          handleDelete(
                            user._id,
                            `${user.firstName} ${user.lastName}`
                          )
                        }
                        title="Delete User"
                        style={{
                          background: '#fee2e2',
                          color: '#991b1b',
                          border: 'none',
                          padding: '6px 8px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className={styles.emptyState}>
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
