import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import PortalLayout from '../../../../../components/PortalLayout/PortalLayout';
import { apiServices } from '../../../../../services/api';
import { Edit, Save, X, Users, BookOpen, Calendar } from 'lucide-react';
import { useNotification } from '../../../../../components/Toaster/Toaster';
import styles from '../admin.module.css';
import LoadingDots from '../../../../../components/LoadingDots/LoadingDots';
import { ClassDetails } from '../../../../../lib/types';

const ClassDetailsPage = () => {
    const router = useRouter();
    const { id: adminId, classId } = router.query;
    const { addNotification } = useNotification();

    const [classData, setClassData] = useState<ClassDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState<Partial<ClassDetails>>({});

    useEffect(() => {
        if (classId) {
            fetchClassDetails();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [classId]);

    const fetchClassDetails = async () => {
        try {
            setLoading(true);
            const response = await apiServices.classes.getById(classId as string) as { success: boolean; class?: ClassDetails; data?: ClassDetails; error?: string };
            if (response.success) {
                setClassData(response.class || response.data || null);
                setEditData(response.class || response.data || {});
            } else {
                addNotification({
                    type: 'error',
                    title: 'Failed to fetch class details',
                    message: 'Please try again later.',
                });
            }
        } catch (error) {
            console.error('Error fetching class details:', error);
            addNotification({
                type: 'error',
                title: 'Failed to fetch class details',
                message: 'Please try again later.',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
        setEditData(classData || {});
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditData(classData || {});
    };

    const handleSave = async () => {
        try {
            const response = await apiServices.classes.update(classId as string, editData);
            if (response.success) {
                addNotification({
                    type: 'success',
                    title: 'Class updated successfully!',
                    message: 'The class details have been updated.',
                });
                setClassData({ ...classData, ...editData } as ClassDetails);
                setIsEditing(false);
            } else {
                addNotification({
                    type: 'error',
                    title: 'Failed to update class',
                    message: response.error || 'Please try again later.',
                });
            }
        } catch (error) {
            console.error('Error updating class:', error);
            addNotification({
                type: 'error',
                title: 'Failed to update class',
                message: 'Please try again later.',
            });
        }
    };

    const handleInputChange = (field: string, value: string | number) => {
        setEditData(prev => ({ ...prev, [field]: value }));
    };

    const goBack = () => {
        router.push(`/portal/admin/${adminId}/classes`);
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

    if (!classData) {
        return (
            <PortalLayout userName="Admin" userRole="admin">
                <div className={styles.emptyState}>
                    <h3>Class not found</h3>
                    <p>The requested class could not be found.</p>
                    <button onClick={goBack} className={styles.backButton}>
                        Go Back to Classes
                    </button>
                </div>
            </PortalLayout>
        );
    }

    return (
        <PortalLayout userName="Admin" userRole="admin">
            {/* Back Button - Top Left */}
            <button onClick={goBack} className={styles.backButton}>
                ← Back to Classes
            </button>

            {/* Header with Edit Controls */}
            <div className={styles.profileHeader}>
                <div className={styles.profileTitleSection}>
                    <div className={styles.profileTitle}>
                        <div className={styles.userAvatar}>
                            <BookOpen size={32} color="#2563eb" />
                        </div>
                        <div>
                            <h1>{classData?.className || 'Class Details'}</h1>
                            <span className={`${styles.roleTag} ${styles.roleTagClass}`}>
                                {classData?.classID || 'Class'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className={styles.profileActions}>
                    {isEditing ? (
                        <>
                            <button onClick={handleCancel} className={styles.cancelBtn}>
                                <X size={18} />
                                Cancel
                            </button>
                            <button onClick={handleSave} className={styles.saveBtn}>
                                <Save size={18} />
                                Save Changes
                            </button>
                        </>
                    ) : (
                        <button onClick={handleEdit} className={styles.editBtn}>
                            <Edit size={18} />
                            Edit Class
                        </button>
                    )}
                </div>
            </div>

            {/* Class Content */}
            <div className={styles.profileContent}>
                {/* Basic Information */}
                <div className={styles.profileSection}>
                    <h3>Class Information</h3>
                    <div className={styles.profileGrid}>
                        <div className={styles.profileField}>
                            <label>
                                <BookOpen size={16} />
                                Class ID
                            </label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editData.classID || ''}
                                    onChange={(e) => handleInputChange('classID', e.target.value)}
                                />
                            ) : (
                                <span>{classData.classID || 'N/A'}</span>
                            )}
                        </div>

                        <div className={styles.profileField}>
                            <label>
                                <Users size={16} />
                                Class Name
                            </label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editData.className || ''}
                                    onChange={(e) => handleInputChange('className', e.target.value)}
                                />
                            ) : (
                                <span>{classData.className || 'N/A'}</span>
                            )}
                        </div>

                        <div className={styles.profileField}>
                            <label>
                                <BookOpen size={16} />
                                Class Code
                            </label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editData.classCode || ''}
                                    onChange={(e) => handleInputChange('classCode', e.target.value)}
                                />
                            ) : (
                                <span>{classData.classCode || 'N/A'}</span>
                            )}
                        </div>

                        <div className={styles.profileField}>
                            <label>
                                <Calendar size={16} />
                                Year
                            </label>
                            {isEditing ? (
                                <input
                                    type="number"
                                    value={editData.year || ''}
                                    onChange={(e) => handleInputChange('year', parseInt(e.target.value) || 0)}
                                />
                            ) : (
                                <span>{classData.year || 'N/A'}</span>
                            )}
                        </div>

                        <div className={`${styles.profileField} ${styles.fullWidthField}`}>
                            <label>
                                <BookOpen size={16} />
                                Description
                            </label>
                            {isEditing ? (
                                <textarea
                                    value={editData.description || ''}
                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                    rows={3}
                                />
                            ) : (
                                <span>{classData.description || 'No description provided'}</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Statistics Section */}
                <div className={styles.profileSection}>
                    <h3>Statistics</h3>
                    <div className={styles.statsGrid}>
                        <div className={styles.statCard}>
                            <div className={styles.statIcon}>
                                <Users size={24} />
                            </div>
                            <div className={styles.statInfo}>
                                <h3>Total Students</h3>
                                <p className={styles.statNumber}>{classData.students?.length || 0}</p>
                            </div>
                        </div>

                        <div className={styles.statCard}>
                            <div className={styles.statIcon}>
                                <BookOpen size={24} />
                            </div>
                            <div className={styles.statInfo}>
                                <h3>Courses</h3>
                                <p className={styles.statNumber}>{classData.courses?.length || 0}</p>
                            </div>
                        </div>

                        <div className={styles.statCard}>
                            <div className={styles.statIcon}>
                                <Calendar size={24} />
                            </div>
                            <div className={styles.statInfo}>
                                <h3>Created</h3>
                                <p className={styles.statDate}>
                                    {classData.createdAt
                                        ? new Date(classData.createdAt).toLocaleDateString()
                                        : 'N/A'
                                    }
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PortalLayout>
    );
};

export default ClassDetailsPage;