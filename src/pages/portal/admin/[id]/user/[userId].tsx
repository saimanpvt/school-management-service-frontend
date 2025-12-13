import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import PortalLayout from '../../../../../components/PortalLayout/PortalLayout';
import { apiServices } from '../../../../../services/api';
import {
    User,
    Edit,
    Save,
    X,
    Mail,
    Phone,
    Calendar,
    MapPin,
    Briefcase,
    GraduationCap,
    Users,
    Heart,
    UserCheck
} from 'lucide-react';
import { useNotification } from '../../../../../components/Toaster';
import { User as UserType } from '../../../../../lib/types';
import { capitalizeFirstLetter } from '../../../../../lib/helpers';
import styles from '../admin.module.css';
import LoadingDots from '../../../../../components/LoadingDots/LoadingDots';

// Extended interfaces for role-specific data
interface TeacherData extends UserType {
    employeeId?: string;
    experience?: number;
    DOJ?: string;
}

interface StudentData extends UserType {
    studentId?: string;
    admissionDate?: string;
    classId?: string;
}

interface ParentData extends UserType {
    childrenId?: string;
}

const UserProfile = () => {
    const router = useRouter();
    const { userId } = router.query;
    const { addNotification } = useNotification();

    const [user, setUser] = useState<UserType | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState<Partial<UserType>>({});

    // Fetch user profile data
    const fetchUserProfile = useCallback(async () => {
        if (!userId) return;

        try {
            setLoading(true);
            const response = await apiServices.users.getById(userId as string);

            if (response.success && response.data) {
                setUser(response.data as UserType);
                setEditData(response.data as UserType);
            } else {
                addNotification({
                    type: 'error',
                    title: 'User not found',
                    message: 'Unable to load user profile'
                });
                router.back();
            }
        } catch (error) {
            console.error('Error fetching user profile:', error);
            addNotification({
                type: 'error',
                title: 'Failed to load profile',
                message: 'Please try again later'
            });
        } finally {
            setLoading(false);
        }
    }, [userId, addNotification, router]);

    useEffect(() => {
        fetchUserProfile();
    }, [fetchUserProfile]);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditData(user || {});
    };

    const handleSave = async () => {
        if (!userId || !user) return;

        try {
            const response = await apiServices.users.update(userId as string, editData);

            if (response.success) {
                setUser({ ...user, ...editData });
                setIsEditing(false);
                addNotification({
                    type: 'success',
                    title: 'Profile updated successfully!',
                    message: `${user.firstName} ${user.lastName}'s profile has been updated.`
                });
            } else {
                addNotification({
                    type: 'error',
                    title: 'Failed to update profile',
                    message: 'Please try again later'
                });
            }
        } catch (error) {
            console.error('Error updating user:', error);
            addNotification({
                type: 'error',
                title: 'Update failed',
                message: 'An error occurred while updating the profile'
            });
        }
    };

    const handleInputChange = (field: keyof UserType, value: string | object) => {
        setEditData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const getRoleInfo = (role: number) => {
        switch (role) {
            case 1: return { name: 'Admin', icon: UserCheck, color: '#dc2626' };
            case 2: return { name: 'Teacher', icon: Briefcase, color: '#2563eb' };
            case 3: return { name: 'Student', icon: GraduationCap, color: '#059669' };
            case 4: return { name: 'Parent', icon: Users, color: '#d97706' };
            default: return { name: 'Unknown', icon: User, color: '#6b7280' };
        }
    };

    if (loading) {
        return (
            <PortalLayout userRole="admin" userName="Admin">
                <div className={styles.loading}>
                    <LoadingDots />
                </div>
            </PortalLayout>
        );
    }

    if (!user) {
        return (
            <PortalLayout userRole="admin" userName="Admin">
                {/* Back Button - Top Left */}
                <button
                    onClick={() => router.back()}
                    className={styles.backButton}
                >
                    ← Back to Users
                </button>

                <div className={styles.errorState}>
                    <User size={64} color="#9ca3af" />
                    <h2>No User Found</h2>
                    <p>The user you&apos;re looking for doesn&apos;t exist or has been removed.</p>
                </div>
            </PortalLayout>
        );
    }

    const roleInfo = getRoleInfo(user.role);
    const RoleIcon = roleInfo.icon;

    return (
        <PortalLayout userRole="admin" userName="Admin">
            {/* Back Button - Top Left */}
            <button
                onClick={() => router.back()}
                className={styles.backButton}
            >
                ← Back to Users
            </button>

            {/* Header with Edit Controls */}
            <div className={styles.profileHeader}>
                <div className={styles.profileTitleSection}>
                    <div className={styles.profileTitle}>
                        <div className={styles.userAvatar}>
                            <RoleIcon size={32} color={roleInfo.color} />
                        </div>
                        <div>
                            <h1>{user.firstName} {user.lastName}</h1>
                            <span
                                className={styles.roleTag}
                                style={{ backgroundColor: roleInfo.color + '20', color: roleInfo.color }}
                            >
                                {roleInfo.name}
                            </span>
                        </div>
                    </div>
                </div>

                <div className={styles.profileActions}>
                    {isEditing ? (
                        <>
                            <button
                                onClick={handleCancel}
                                className={styles.cancelBtn}
                            >
                                <X size={18} />
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className={styles.saveBtn}
                            >
                                <Save size={18} />
                                Save Changes
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={handleEdit}
                            className={styles.editBtn}
                        >
                            <Edit size={18} />
                            Edit Profile
                        </button>
                    )}
                </div>
            </div>

            {/* Profile Content */}
            <div className={styles.profileContent}>
                {/* Basic Information */}
                <div className={styles.profileSection}>
                    <h3>Basic Information</h3>
                    <div className={styles.profileGrid}>
                        <div className={styles.profileField}>
                            <label>
                                <Mail size={16} />
                                Email
                            </label>
                            {isEditing ? (
                                <input
                                    type="email"
                                    value={editData.email || ''}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    className={styles.editInput}
                                />
                            ) : (
                                <span>{user.email || 'Not provided'}</span>
                            )}
                        </div>

                        <div className={styles.profileField}>
                            <label>
                                <Phone size={16} />
                                Phone
                            </label>
                            {isEditing ? (
                                <input
                                    type="tel"
                                    value={editData.phone || ''}
                                    onChange={(e) => handleInputChange('phone', e.target.value)}
                                    className={styles.editInput}
                                />
                            ) : (
                                <span>{user.phone || 'Not provided'}</span>
                            )}
                        </div>

                        <div className={styles.profileField}>
                            <label>
                                <Calendar size={16} />
                                Date of Birth
                            </label>
                            {isEditing ? (
                                <input
                                    type="date"
                                    value={editData.dob || ''}
                                    onChange={(e) => handleInputChange('dob', e.target.value)}
                                    className={styles.editInput}
                                />
                            ) : (
                                <span>{user.dob ? new Date(user.dob).toLocaleDateString() : 'Not provided'}</span>
                            )}
                        </div>

                        <div className={styles.profileField}>
                            <label>
                                <UserCheck size={16} />
                                Gender
                            </label>
                            {isEditing ? (
                                <select
                                    value={editData.gender || ''}
                                    onChange={(e) => handleInputChange('gender', e.target.value)}
                                    className={styles.editInput}
                                >
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            ) : (
                                <span>{user.gender || 'Not provided'}</span>
                            )}
                        </div>

                        <div className={styles.profileField}>
                            <label>
                                <Heart size={16} />
                                Blood Group
                            </label>
                            {isEditing ? (
                                <select
                                    value={editData.bloodGroup || ''}
                                    onChange={(e) => handleInputChange('bloodGroup', e.target.value)}
                                    className={styles.editInput}
                                >
                                    <option value="">Select Blood Group</option>
                                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(group => (
                                        <option key={group} value={group}>{group}</option>
                                    ))}
                                </select>
                            ) : (
                                <span>{user.bloodGroup || 'Not provided'}</span>
                            )}
                        </div>

                        <div className={styles.profileField}>
                            <label>
                                <MapPin size={16} />
                                Address
                            </label>
                            {isEditing ? (
                                <textarea
                                    value={`${editData.address?.street || ''}, ${editData.address?.city || ''}, ${editData.address?.state || ''} ${editData.address?.zipCode || ''}`}
                                    onChange={(e) => {
                                        const addressString = e.target.value;
                                        // Simple parsing - you might want to make this more sophisticated
                                        handleInputChange('address', {
                                            street: addressString,
                                            city: '',
                                            state: '',
                                            zipCode: '',
                                            country: ''
                                        });
                                    }}
                                    className={styles.editInput}
                                    rows={2}
                                />
                            ) : (
                                <span>
                                    {user.address ?
                                        `${user.address.street || ''}, ${user.address.city || ''}, ${user.address.state || ''} ${user.address.zipCode || ''}`.replace(/^,\s*|,\s*$/g, '') || 'Not provided'
                                        : 'Not provided'
                                    }
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Role-specific Information */}
                {user.role === 2 && (
                    <div className={styles.profileSection}>
                        <h3>Teacher Information</h3>
                        <div className={styles.profileGrid}>
                            <div className={styles.profileField}>
                                <label>Employee ID</label>
                                <span>{(user as TeacherData).employeeId || 'Not provided'}</span>
                            </div>
                            <div className={styles.profileField}>
                                <label>Experience</label>
                                <span>{(user as TeacherData).experience ? `${(user as TeacherData).experience} years` : 'Not provided'}</span>
                            </div>
                            <div className={styles.profileField}>
                                <label>Date of Joining</label>
                                <span>{(user as TeacherData).DOJ ? new Date((user as TeacherData).DOJ).toLocaleDateString() : 'Not provided'}</span>
                            </div>
                        </div>
                    </div>
                )}

                {user.role === 3 && (
                    <div className={styles.profileSection}>
                        <h3>Student Information</h3>
                        <div className={styles.profileGrid}>
                            <div className={styles.profileField}>
                                <label>Student ID</label>
                                <span>{(user as StudentData).studentId || 'Not provided'}</span>
                            </div>
                            <div className={styles.profileField}>
                                <label>Admission Date</label>
                                <span>{(user as StudentData).admissionDate ? new Date((user as StudentData).admissionDate).toLocaleDateString() : 'Not provided'}</span>
                            </div>
                            <div className={styles.profileField}>
                                <label>Class ID</label>
                                <span>{(user as StudentData).classId || 'Not provided'}</span>
                            </div>
                        </div>
                    </div>
                )}

                {user.role === 4 && (
                    <div className={styles.profileSection}>
                        <h3>Parent Information</h3>
                        <div className={styles.profileGrid}>
                            <div className={styles.profileField}>
                                <label>Children ID</label>
                                <span>{(user as ParentData).childrenId || 'Not provided'}</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Statistics Section */}
                <div className={styles.profileSection}>
                    <h3>Statistics</h3>
                    <div className={styles.statsGrid}>
                        {user.attendance && (
                            <div className={styles.statCard}>
                                <h4>Attendance</h4>
                                <div className={styles.statValue}>{user.attendance.percentage}%</div>
                                <div className={styles.statDetail}>
                                    {user.attendance.present}/{user.attendance.total} days
                                </div>
                            </div>
                        )}

                        {user.exams && (
                            <div className={styles.statCard}>
                                <h4>Exams</h4>
                                <div className={styles.statValue}>{user.exams.average}%</div>
                                <div className={styles.statDetail}>
                                    {user.exams.taken} exams taken
                                </div>
                            </div>
                        )}

                        {user.feeStatus && (
                            <div className={styles.statCard}>
                                <h4>Fee Status</h4>
                                <div
                                    className={styles.statValue}
                                    style={{
                                        color: user.feeStatus.status === 'paid' ? '#059669' :
                                            user.feeStatus.status === 'pending' ? '#d97706' : '#dc2626'
                                    }}
                                >
                                    {capitalizeFirstLetter(user.feeStatus.status)}
                                </div>
                                <div className={styles.statDetail}>
                                    ${user.feeStatus.amount}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </PortalLayout>
    );
};
export default UserProfile;