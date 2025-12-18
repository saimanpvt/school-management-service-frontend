import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import PortalLayout from '../../../../components/PortalLayout/PortalLayout';
import { apiServices } from '../../../../services/api';
import { Users, Plus, Search, Trash2 } from 'lucide-react';
import UserForm, {
  UserFormData,
} from '../../../../components/UserForm/UserForm';
import AlertModal from '../../../../components/AlertModal';
import { useNotification } from '../../../../components/Toaster';
import { ProtectedRoute } from '../../../../lib/auth';
import {
  DEFAULT_USER_FORM,
  USER_TYPE_FILTERS,
  GENDER_OPTIONS,
  BLOOD_GROUP_OPTIONS,
  ALERT_MESSAGES,
  UI_CONSTANTS,
} from '../../../../lib/constants';
import {
  filterUsers,
  getDisplayValue,
  getUserRoleOptions,
  getRoleBasedCount,
  capitalizeFirstLetter,
} from '../../../../lib/helpers';
import { User, IUserType } from '../../../../lib/types';
import styles from './admin.module.css';
import LoadingDots from '../../../../components/LoadingDots/LoadingDots';

// Helper functions to get CSS classes
const getUserRoleClass = (role: string): string => {
  switch (role) {
    case '1':
      return styles.userIdAdmins;
    case '2':
      return styles.userIdTeachers;
    case '3':
      return styles.userIdStudents;
    case '4':
      return styles.userIdParents;
    default:
      return '';
  }
};

const getAttendanceClass = (percentage?: number): string => {
  if (!percentage) return styles.secondaryText;
  if (percentage >= 90) return styles.attendanceExcellent;
  if (percentage >= 75) return styles.attendanceGood;
  return styles.attendancePoor;
};

const getFeeStatusClass = (status?: string): string => {
  switch (status) {
    case 'paid':
      return styles.feeStatusPaid;
    case 'pending':
      return styles.feeStatusPending;
    case 'overdue':
      return styles.feeStatusOverdue;
    default:
      return styles.feeStatusOverdue;
  }
};

const getFilterTabClass = (filterKey: string, isActive: boolean): string => {
  const baseClass = `${styles.filterTab}`;
  const activeClass = isActive ? styles.active : '';
  const roleClass = isActive ? styles[`filterTab${filterKey.charAt(0).toUpperCase() + filterKey.slice(1)}Active`] : '';
  return `${baseClass} ${activeClass} ${roleClass}`.trim();
};

const UserManagement = () => {
  const router = useRouter();
  const { id } = router.query;
  const { addNotification } = useNotification();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeUserType, setActiveUserType] = useState<IUserType>('student');
  const [showAddForm, setShowAddForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Delete modal state
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    userId: '',
    userName: '',
  });
  const [formData, setFormData] = useState<UserFormData>(DEFAULT_USER_FORM);

  // Navigation handler for ID clicks
  const handleViewDetails = (userId: string) => {
    router.push(`/portal/admin/${id}/user/${userId}`);
  };

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      // Simple API call - backend handles everything
      const response = await apiServices.users.getAll();
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
              _id: student._id || '',
              email: student?.email || '',
              firstName: student.fullName || '-',
              userID:
                student.userRefId || student.userId || student.userID || '',
              role: 3,
              isActive:
                student.isActive !== undefined ? student.isActive : true,
            }));
            userData = [...students];
          }
          // Parse teachers array
          if (data.teachers && Array.isArray(data.teachers)) {
            const teachers = data.teachers.map((teacher) => ({
              _id: teacher._id || '',
              email: teacher?.email || '',
              firstName: teacher.fullName?.split(' ')[0] || 'Unknown',
              lastName: teacher.fullName?.split(' ').slice(1).join(' ') || '',
              userID:
                teacher.userId || teacher.userRefId || teacher.userID || '',
              role: 2,
              isActive:
                teacher.isActive !== undefined ? teacher.isActive : true,
            }));
            userData = [...userData, ...teachers];
          }
          // Parse parent array (note: it's 'parent' not 'parents' in your API)
          if (data.parent && Array.isArray(data.parent)) {
            const parents = data.parent.map((parent) => ({
              _id: parent._id || '',
              email: parent.email || '',
              firstName: parent.firstName || 'Unknown',
              lastName: parent.lastName || '',
              userID: parent.userID || parent.userId || parent.userRefId || '',
              role: 4,
              isActive: parent.isActive !== undefined ? parent.isActive : true,
            }));
            userData = [...userData, ...parents];
          }
        }
        setUsers(userData || []);
      } else {
        setUsers([]);
      }
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (id) {
      fetchUsers();
    }
  }, [id, fetchUsers]);

  // Clear search term when switching user types
  useEffect(() => {
    setSearchTerm('');
  }, [activeUserType]);

  const filteredUsers = filterUsers(users, searchTerm, activeUserType);
  const openDeleteModal = (userId: string, userName: string) => {
    setDeleteModal({ isOpen: true, userId, userName });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, userId: '', userName: '' });
  };

  const confirmDelete = async () => {
    try {
      await apiServices.users.delete(deleteModal.userId);
      setUsers(users.filter((u) => u._id !== deleteModal.userId));
      addNotification({
        type: 'success',
        title: 'User deleted successfully!',
        message: `${deleteModal.userName} has been removed.`,
      });
    } catch {
      addNotification({
        type: 'error',
        title: 'Failed to delete user',
        message: 'Please try again later.',
      });
    } finally {
      closeDeleteModal();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // For edit mode, password is not required
    if (!isEditMode && !generatedPassword) {
      addNotification({
        type: 'error',
        title: 'Password Required',
        message: ALERT_MESSAGES.GENERATE_PASSWORD_REQUIRED,
      });
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
        response = (await apiServices.users.update(
          editingUserId,
          userData
        )) as { success?: boolean; message?: string; data?: User };
        if (response.success) {
          addNotification({
            type: 'success',
            title: 'User updated successfully!',
            message: `${formData.firstName} ${formData.lastName} has been updated.`,
          });
          // Refresh the user list after update
          fetchUsers();
          setShowAddForm(false);
          resetForm();
        }
      } else {
        // Create new user
        response = (await apiServices.users.create(userData)) as {
          success?: boolean;
          message?: string;
          data?: User;
        };
        if (response.success) {
          addNotification({
            type: 'success',
            title: 'User created successfully!',
            message: `${formData.firstName} ${formData.lastName} has been created. Password: ${generatedPassword}`,
          });
          // Refresh the user list after creation
          fetchUsers();
          setShowAddForm(false);
          resetForm();
        }
      }
    } catch (error) {
      console.error('Error saving user:', error);
      addNotification({
        type: 'error',
        title: isEditMode ? 'Failed to update user' : 'Failed to create user',
        message: isEditMode
          ? ALERT_MESSAGES.UPDATE_FAILED
          : ALERT_MESSAGES.CREATE_FAILED,
      });
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
          roleOptions={getUserRoleOptions(activeUserType)}
          genderOptions={GENDER_OPTIONS as string[]}
          bloodGroupOptions={BLOOD_GROUP_OPTIONS as string[]}
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

      <div className={styles.filterTabs}>
        {USER_TYPE_FILTERS.map((filter) => {
          const Icon = filter.icon;
          const isActive = activeUserType === filter.key;
          const count = getRoleBasedCount(users, filter.key);

          return (
            <button
              key={filter.key}
              className={`${styles.filterTab} ${isActive ? styles.active : ''}`}
              onClick={() => {
                setActiveUserType(filter.key);
                setSearchTerm('');
              }}
              className={getFilterTabClass(filter.key, isActive)}
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
            Add {capitalizeFirstLetter(activeUserType)}
          </button>
        </div>
      </div>

      <div className={styles.userTableContainer}>
        <table className={styles.userDataTable}>
          <thead>
            <tr>
              {UI_CONSTANTS.TABLE_COLUMNS.map((col) => (
                <th key={col.key} className={col.align === 'center' ? styles.textCenter : col.align === 'left' ? styles.textLeft : styles.textRight}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => {
                return (
                  <tr key={user._id}>
                    {/* ID Column */}
                    <td className={styles.textCenter}>
                      <span
                        className={`${styles.clickable} ${styles.userIdClickable} ${getUserRoleClass(user.role)}`}
                        onClick={() => handleViewDetails(user.userID)}
                      >
                        {user.userID || 'N/A'}
                      </span>
                    </td>

                    {/* Name Column */}
                    <td className={styles.paddingLeft16}>
                      <div className={styles.userInfo}>
                        <span className={styles.fontWeight600}>
                          {user.firstName} {user.lastName}
                        </span>
                        <small className={styles.userEmail}>
                          {user.email}
                        </small>
                      </div>
                    </td>

                    {/* Attendance Column */}
                    <td className={styles.textCenter}>
                      <div>
                        <div className={`${styles.fontWeight600} ${getAttendanceClass(user.attendance?.percentage)}`}>
                          {getDisplayValue(
                            user.attendance?.percentage
                              ? `${user.attendance.percentage}%`
                              : null
                          )}
                        </div>
                        <small className={styles.secondaryText}>
                          {user.attendance?.present && user.attendance?.total
                            ? `${user.attendance.present}/${user.attendance.total}`
                            : '-/-'}
                        </small>
                      </div>
                    </td>

                    {/* Fees Column */}
                    <td className={styles.textCenter}>
                      <div>
                        <span className={getFeeStatusClass(user.feeStatus?.status)}>
                          {getDisplayValue(user.feeStatus?.status, 'N/A')}
                        </span>
                        {user.feeStatus?.amount && (
                          <div className={styles.smallText}>
                            ${user.feeStatus.amount}
                          </div>
                        )}
                      </div>
                    </td>
                    {/* Actions Column - Only Delete Button */}
                    <td className={styles.textCenter}>
                      <button
                        className={styles.deleteBtn}
                        onClick={() =>
                          openDeleteModal(
                            user.userID,
                            `${user.firstName} ${user.lastName}`
                          )
                        }
                        title="Delete User"
                        className={styles.deleteButton}
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
                      : `No ${capitalizeFirstLetter(
                        activeUserType
                      )}s in the system`}
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
          roleOptions={getUserRoleOptions(activeUserType)}
          genderOptions={GENDER_OPTIONS as string[]}
          bloodGroupOptions={BLOOD_GROUP_OPTIONS as string[]}
          activeUserType={activeUserType}
          isEdit={isEditMode}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <AlertModal
          usage="delete"
          mainText="Delete User"
          subText={`Are you sure you want to delete "${deleteModal.userName}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={confirmDelete}
          onCancel={closeDeleteModal}
          onClose={closeDeleteModal}
        />
      )}
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
