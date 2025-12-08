import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import PortalLayout from '../../../../../components/PortalLayout';
import { apiServices } from '../../../../../services/api';
import {
    ArrowLeft,
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    BookOpen,
    Clock,
    TrendingUp,
    Users,
    Edit,
    GraduationCap
} from 'lucide-react';
import { ProtectedRoute } from '../../../../../lib/auth';
import styles from '../admin.module.css';
import LoadingDots from '../../../../../components/LoadingDots';

interface TeacherDetails {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    userID: string;
    role: number;
    phone?: string;
    address?: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    };
    dob?: string;
    gender?: string;
    bloodGroup?: string;
    isActive: boolean;

    // Teacher specific fields
    employeeId?: string;
    experience?: number;
    DOJ?: string;
    courses?: string[];
    expWithUs?: number;

    // Performance data
    attendance?: {
        present: number;
        total: number;
        percentage: number;
    };
    students?: {
        total: number;
        active: number;
    };
    performance?: {
        rating: number;
        feedback: string[];
    };
}

const TeacherDetailsPage = () => {
    const router = useRouter();
    const [teacher, setTeacher] = useState<TeacherDetails | null>(null);
    const [loading, setLoading] = useState(true);

    // Extract query parameters safely
    const { id, teacherId } = router.query;

    useEffect(() => {
        // Only proceed if router is ready and we have the required parameters
        if (!router.isReady) {
            return;
        }

        const fetchTeacherDetails = async () => {
            if (!teacherId || !id) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const response = await apiServices.users.getById(teacherId as string);
                if (response.success) {
                    setTeacher(response.data);
                } else {
                    setTeacher(null);
                }
            } catch (error) {
                console.error('Error fetching teacher details:', error);
                setTeacher(null);
            } finally {
                setLoading(false);
            }
        };

        fetchTeacherDetails();
    }, [router.isReady, teacherId, id]);

    const getDisplayValue = (value: string | number | null | undefined, defaultValue: string = '-') => {
        return value ? value : defaultValue;
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString();
    };

    return (
        <PortalLayout userName="Admin" userRole="admin">
            {loading ? (
                <div className={styles.loading}><LoadingDots /></div>
            ) : !teacher ? (
                <div className={styles.emptyState}>
                    <Users size={48} />
                    <h3>Teacher not found</h3>
                    <p>The teacher details could not be loaded.</p>
                </div>
            ) : (
                <div className={styles.detailsContainer}>
                    {/* Header */}
                    <div className={styles.detailsHeader}>
                        <button
                            className={styles.backBtn}
                            onClick={() => router.back()}
                        >
                            <ArrowLeft size={20} />
                            Back to User Management
                        </button>

                        <div className={styles.headerInfo}>
                            <div className={styles.avatarSection}>
                                <div className={styles.avatar}>
                                    <GraduationCap size={32} />
                                </div>
                                <div>
                                    <h1>{teacher.firstName} {teacher.lastName}</h1>
                                    <p className={styles.subtitle}>Teacher ID: {teacher.userID}</p>
                                    <span className={`${styles.statusBadge} ${teacher.isActive ? styles.active : styles.inactive}`}>
                                        {teacher.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                            </div>

                            <button className={styles.editBtn}>
                                <Edit size={18} />
                                Edit Profile
                            </button>
                        </div>
                    </div>

                    {/* Content Grid */}
                    <div className={styles.detailsGrid}>
                        {/* Personal Information */}
                        <div className={styles.detailsCard}>
                            <div className={styles.cardHeader}>
                                <User size={20} />
                                <h3>Personal Information</h3>
                            </div>
                            <div className={styles.cardContent}>
                                <div className={styles.infoRow}>
                                    <Mail size={16} />
                                    <span>Email:</span>
                                    <strong>{teacher.email}</strong>
                                </div>
                                <div className={styles.infoRow}>
                                    <Phone size={16} />
                                    <span>Phone:</span>
                                    <strong>{getDisplayValue(teacher.phone)}</strong>
                                </div>
                                <div className={styles.infoRow}>
                                    <Calendar size={16} />
                                    <span>Date of Birth:</span>
                                    <strong>{formatDate(teacher.dob)}</strong>
                                </div>
                                <div className={styles.infoRow}>
                                    <User size={16} />
                                    <span>Gender:</span>
                                    <strong>{getDisplayValue(teacher.gender)}</strong>
                                </div>
                                <div className={styles.infoRow}>
                                    <User size={16} />
                                    <span>Blood Group:</span>
                                    <strong>{getDisplayValue(teacher.bloodGroup)}</strong>
                                </div>
                                {teacher.address && (
                                    <div className={styles.infoRow}>
                                        <MapPin size={16} />
                                        <span>Address:</span>
                                        <strong>
                                            {[
                                                teacher.address.street,
                                                teacher.address.city,
                                                teacher.address.state,
                                                teacher.address.zipCode,
                                                teacher.address.country
                                            ].filter(Boolean).join(', ') || '-'}
                                        </strong>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Professional Information */}
                        <div className={styles.detailsCard}>
                            <div className={styles.cardHeader}>
                                <BookOpen size={20} />
                                <h3>Professional Information</h3>
                            </div>
                            <div className={styles.cardContent}>
                                <div className={styles.infoRow}>
                                    <User size={16} />
                                    <span>Employee ID:</span>
                                    <strong>{getDisplayValue(teacher.employeeId)}</strong>
                                </div>
                                <div className={styles.infoRow}>
                                    <Clock size={16} />
                                    <span>Total Experience:</span>
                                    <strong>{getDisplayValue(teacher.experience ? `${teacher.experience} years` : null)}</strong>
                                </div>
                                <div className={styles.infoRow}>
                                    <Clock size={16} />
                                    <span>Experience with Us:</span>
                                    <strong>{getDisplayValue(teacher.expWithUs ? `${teacher.expWithUs} years` : null)}</strong>
                                </div>
                                <div className={styles.infoRow}>
                                    <Calendar size={16} />
                                    <span>Date of Joining:</span>
                                    <strong>{formatDate(teacher.DOJ)}</strong>
                                </div>
                            </div>
                        </div>

                        {/* Courses */}
                        <div className={styles.detailsCard}>
                            <div className={styles.cardHeader}>
                                <BookOpen size={20} />
                                <h3>Courses ({teacher.courses?.length || 0})</h3>
                            </div>
                            <div className={styles.cardContent}>
                                {teacher.courses && teacher.courses.length > 0 ? (
                                    <div className={styles.coursesList}>
                                        {teacher.courses.map((course, index) => (
                                            <div key={index} className={styles.courseItem}>
                                                <BookOpen size={14} />
                                                <span>{course}</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className={styles.emptyMessage}>No courses assigned</p>
                                )}
                            </div>
                        </div>

                        {/* Performance Stats */}
                        <div className={styles.detailsCard}>
                            <div className={styles.cardHeader}>
                                <TrendingUp size={20} />
                                <h3>Performance Overview</h3>
                            </div>
                            <div className={styles.cardContent}>
                                <div className={styles.statsGrid}>
                                    <div className={styles.statItem}>
                                        <div className={styles.statValue}>
                                            {getDisplayValue(teacher.attendance?.percentage ? `${teacher.attendance.percentage}%` : null)}
                                        </div>
                                        <div className={styles.statLabel}>Attendance</div>
                                    </div>
                                    <div className={styles.statItem}>
                                        <div className={styles.statValue}>
                                            {getDisplayValue(teacher.students?.total)}
                                        </div>
                                        <div className={styles.statLabel}>Total Students</div>
                                    </div>
                                    <div className={styles.statItem}>
                                        <div className={styles.statValue}>
                                            {getDisplayValue(teacher.students?.active)}
                                        </div>
                                        <div className={styles.statLabel}>Active Students</div>
                                    </div>
                                    <div className={styles.statItem}>
                                        <div className={styles.statValue}>
                                            {getDisplayValue(teacher.performance?.rating ? `${teacher.performance.rating}/5` : null)}
                                        </div>
                                        <div className={styles.statLabel}>Rating</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </PortalLayout>
    );
};

const ProtectedTeacherDetails = () => {
    return (
        <ProtectedRoute roles={['Admin']}>
            <TeacherDetailsPage />
        </ProtectedRoute>
    );
};

export default ProtectedTeacherDetails;