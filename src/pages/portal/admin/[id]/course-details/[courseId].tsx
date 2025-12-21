import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import PortalLayout from '../../../../../components/PortalLayout/PortalLayout';
import { apiServices } from '../../../../../services/api';
import { Edit, Save, X, User, Users, Calendar, Clock, BookOpen } from 'lucide-react';
import { useNotification } from '../../../../../components/Toaster/Toaster';
import styles from '../admin.module.css';
import LoadingDots from '../../../../../components/LoadingDots/LoadingDots';
import { CourseDetails } from '../../../../../lib/types';

const CourseDetailsPage = () => {
    const router = useRouter();
    const { id: adminId, courseId } = router.query;
    const { addNotification } = useNotification();

    const [courseData, setCourseData] = useState<CourseDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState<Partial<CourseDetails>>({});

    useEffect(() => {
        if (courseId) {
            fetchCourseDetails();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [courseId]);

    const fetchCourseDetails = async () => {
        try {
            setLoading(true);
            const response = await apiServices.courses.getById(courseId as string) as { success: boolean; course?: CourseDetails; data?: CourseDetails; error?: string };
            if (response.success) {
                setCourseData(response.course || response.data || null);
                setEditData(response.course || response.data || {});
            } else {
                addNotification({
                    type: 'error',
                    title: 'Failed to fetch course details',
                    message: 'Please try again later.',
                });
            }
        } catch (error) {
            console.error('Error fetching course details:', error);
            addNotification({
                type: 'error',
                title: 'Failed to fetch course details',
                message: 'Please try again later.',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
        setEditData(courseData || {});
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditData(courseData || {});
    };

    const handleSave = async () => {
        try {
            const response = await apiServices.courses.update(courseId as string, editData);
            if (response.success) {
                addNotification({
                    type: 'success',
                    title: 'Course updated successfully!',
                    message: 'The course details have been updated.',
                });
                setCourseData({ ...courseData, ...editData } as CourseDetails);
                setIsEditing(false);
            } else {
                addNotification({
                    type: 'error',
                    title: 'Failed to update course',
                    message: response.error || 'Please try again later.',
                });
            }
        } catch (error) {
            console.error('Error updating course:', error);
            addNotification({
                type: 'error',
                title: 'Failed to update course',
                message: 'Please try again later.',
            });
        }
    };

    const handleInputChange = (field: string, value: string | number | boolean) => {
        setEditData(prev => ({ ...prev, [field]: value }));
    };

    const goBack = () => {
        router.push(`/portal/admin/${adminId}/courses`);
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

    if (!courseData) {
        return (
            <PortalLayout userName="Admin" userRole="admin">
                <div className={styles.emptyState}>
                    <h3>Course not found</h3>
                    <p>The requested course could not be found.</p>
                    <button onClick={goBack} className={styles.backButton}>
                        Go Back to Courses
                    </button>
                </div>
            </PortalLayout>
        );
    }

    return (
        <PortalLayout userName="Admin" userRole="admin">
            {/* Back Button - Top Left */}
            <button onClick={goBack} className={styles.backButton}>
                ← Back to Courses
            </button>

            {/* Header with Edit Controls */}
            <div className={styles.profileHeader}>
                <div className={styles.profileTitleSection}>
                    <div className={styles.profileTitle}>
                        <div className={styles.userAvatar}>
                            <BookOpen size={32} color="#059669" />
                        </div>
                        <div>
                            <h1>{courseData?.courseName || 'Course Details'}</h1>
                            <span className={`${styles.roleTag} ${styles.roleTagCourse}`}>
                                {courseData?.courseCode || 'Course'}
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
                            Edit Course
                        </button>
                    )}
                </div>
            </div>

            {/* Course Content */}
            <div className={styles.profileContent}>
                {/* Basic Information */}
                <div className={styles.profileSection}>
                    <h3>Course Information</h3>
                    <div className={styles.profileGrid}>
                        <div className={styles.profileField}>
                            <label>
                                <BookOpen size={16} />
                                Course Code
                            </label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editData.courseCode || ''}
                                    onChange={(e) => handleInputChange('courseCode', e.target.value)}
                                />
                            ) : (
                                <span>{courseData.courseCode || 'N/A'}</span>
                            )}
                        </div>

                        <div className={styles.profileField}>
                            <label>
                                <Calendar size={16} />
                                Course Name
                            </label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editData.courseName || ''}
                                    onChange={(e) => handleInputChange('courseName', e.target.value)}
                                />
                            ) : (
                                <span>{courseData.courseName || 'N/A'}</span>
                            )}
                        </div>

                        <div className={styles.profileField}>
                            <label>
                                <Calendar size={16} />
                                Academic Year
                            </label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editData.academicYear || ''}
                                    onChange={(e) => handleInputChange('academicYear', e.target.value)}
                                />
                            ) : (
                                <span>{courseData.academicYear || 'N/A'}</span>
                            )}
                        </div>

                        <div className={styles.profileField}>
                            <label>
                                <Clock size={16} />
                                Duration (weeks)
                            </label>
                            {isEditing ? (
                                <input
                                    type="number"
                                    value={editData.duration || ''}
                                    onChange={(e) => handleInputChange('duration', parseInt(e.target.value) || 0)}
                                />
                            ) : (
                                <span>{courseData.duration ? `${courseData.duration} weeks` : 'N/A'}</span>
                            )}
                        </div>

                        <div className={styles.profileField}>
                            <label>
                                <User size={16} />
                                Teacher ID
                            </label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editData.teacherId || ''}
                                    onChange={(e) => handleInputChange('teacherId', e.target.value)}
                                />
                            ) : (
                                <span>{courseData.teacherId || 'N/A'}</span>
                            )}
                        </div>

                        <div className={styles.profileField}>
                            <label>
                                <Users size={16} />
                                Class ID
                            </label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editData.classId || ''}
                                    onChange={(e) => handleInputChange('classId', e.target.value)}
                                />
                            ) : (
                                <span>{courseData.classId || 'N/A'}</span>
                            )}
                        </div>

                        <div className={styles.profileField}>
                            <label>
                                <BookOpen size={16} />
                                Status
                            </label>
                            {isEditing ? (
                                <select
                                    value={editData.isActive ? 'active' : 'inactive'}
                                    onChange={(e) => handleInputChange('isActive', e.target.value === 'active')}
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            ) : (
                                <span
                                    className={`${styles.statusBadge} ${courseData.isActive ? styles.active : styles.inactive
                                        }`}
                                >
                                    {courseData.isActive ? 'Active' : 'Inactive'}
                                </span>
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
                                <span>{courseData.description || 'No description provided'}</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Statistics Section */}
                <div className={styles.profileSection}>
                    <h3>Course Statistics</h3>
                    <div className={styles.statsGrid}>
                        <div className={styles.statCard}>
                            <div className={styles.statIcon}>
                                <User size={24} />
                            </div>
                            <div className={styles.statInfo}>
                                <h3>Teacher</h3>
                                <p className={styles.statText}>
                                    {courseData.teacher
                                        ? `${courseData.teacher.firstName} ${courseData.teacher.lastName}`
                                        : courseData.teacherId || 'Not Assigned'
                                    }
                                </p>
                            </div>
                        </div>

                        <div className={styles.statCard}>
                            <div className={styles.statIcon}>
                                <Users size={24} />
                            </div>
                            <div className={styles.statInfo}>
                                <h3>Class</h3>
                                <p className={styles.statText}>
                                    {courseData.class?.className || courseData.classId || 'Not Assigned'}
                                </p>
                            </div>
                        </div>

                        <div className={styles.statCard}>
                            <div className={styles.statIcon}>
                                <Clock size={24} />
                            </div>
                            <div className={styles.statInfo}>
                                <h3>Duration</h3>
                                <p className={styles.statText}>
                                    {courseData.duration ? `${courseData.duration} weeks` : 'Not Set'}
                                </p>
                            </div>
                        </div>

                        <div className={styles.statCard}>
                            <div className={styles.statIcon}>
                                <Calendar size={24} />
                            </div>
                            <div className={styles.statInfo}>
                                <h3>Created</h3>
                                <p className={styles.statDate}>
                                    {courseData.createdAt
                                        ? new Date(courseData.createdAt).toLocaleDateString()
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

export default CourseDetailsPage;