import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import PortalLayout from '../../../../../components/PortalLayout/PortalLayout';
import { apiServices } from '../../../../../services/api';
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  BookOpen,
  Award,
  Clock,
  TrendingUp,
  Users,
  Edit,
  GraduationCap,
  DollarSign,
  User2,
} from 'lucide-react';
import { ProtectedRoute } from '../../../../../lib/auth';
import styles from '../admin.module.css';
import LoadingDots from '../../../../../components/LoadingDots/LoadingDots';

interface StudentDetails {
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

  // Student specific fields
  studentId?: string;
  admissionDate?: string;
  currentClassId?: string;
  classes?: string[];
  timeWithUs?: number;

  // Academic data
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
  results?: {
    lastExam: string;
    grade: string;
    rank?: number;
  };

  // Fee information
  feeStatus?: {
    status: 'paid' | 'pending' | 'overdue';
    amount: number;
    dueDate?: string;
  };

  // Parent information
  parent?: {
    name: string;
    id: string;
    phone: string;
    email?: string;
  };
}

const StudentDetailsPage = () => {
  const router = useRouter();
  const { id, studentId } = router.query;
  const [student, setStudent] = useState<StudentDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (studentId && id) {
      fetchStudentDetails();
    }
  }, [studentId, id]);

  const fetchStudentDetails = async () => {
    try {
      // Replace with actual API call
      const response = await apiServices.users.getById(studentId as string);
      if (response.success) {
        setStudent(response.data);
      }
    } catch (error) {
      console.error('Error fetching student details:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDisplayValue = (value: any, defaultValue: string = '-') => {
    return value ? value : defaultValue;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };

  const getPercentageColor = (percentage: number) => {
    if (percentage >= 90) return '#059669'; // Green
    if (percentage >= 75) return '#f59e0b'; // Yellow
    return '#dc2626'; // Red
  };

  const getGradeColor = (grade: string) => {
    if (grade.includes('A')) return '#059669'; // Green
    if (grade.includes('B')) return '#f59e0b'; // Yellow
    return '#dc2626'; // Red
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

  if (!student) {
    return (
      <PortalLayout userName="Admin" userRole="admin">
        <div className={styles.emptyState}>
          <Users size={48} />
          <h3>Student not found</h3>
          <p>The student details could not be loaded.</p>
        </div>
      </PortalLayout>
    );
  }

  return (
    <PortalLayout userName="Admin" userRole="admin">
      <div className={styles.detailsContainer}>
        {/* Header */}
        <div className={styles.detailsHeader}>
          <button className={styles.backBtn} onClick={() => router.back()}>
            <ArrowLeft size={20} />
            Back to User Management
          </button>

          <div className={styles.headerInfo}>
            <div className={styles.avatarSection}>
              <div className={styles.avatar}>
                <GraduationCap size={32} />
              </div>
              <div>
                <h1>
                  {student.firstName} {student.lastName}
                </h1>
                <p className={styles.subtitle}>Student ID: {student.userID}</p>
                <span
                  className={`${styles.statusBadge} ${
                    student.isActive ? styles.active : styles.inactive
                  }`}
                >
                  {student.isActive ? 'Active' : 'Inactive'}
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
                <strong>{student.email}</strong>
              </div>
              <div className={styles.infoRow}>
                <Phone size={16} />
                <span>Phone:</span>
                <strong>{getDisplayValue(student.phone)}</strong>
              </div>
              <div className={styles.infoRow}>
                <Calendar size={16} />
                <span>Date of Birth:</span>
                <strong>{formatDate(student.dob)}</strong>
              </div>
              <div className={styles.infoRow}>
                <User size={16} />
                <span>Gender:</span>
                <strong>{getDisplayValue(student.gender)}</strong>
              </div>
              <div className={styles.infoRow}>
                <User size={16} />
                <span>Blood Group:</span>
                <strong>{getDisplayValue(student.bloodGroup)}</strong>
              </div>
              {student.address && (
                <div className={styles.infoRow}>
                  <MapPin size={16} />
                  <span>Address:</span>
                  <strong>
                    {[
                      student.address.street,
                      student.address.city,
                      student.address.state,
                      student.address.zipCode,
                      student.address.country,
                    ]
                      .filter(Boolean)
                      .join(', ') || '-'}
                  </strong>
                </div>
              )}
            </div>
          </div>

          {/* Academic Information */}
          <div className={styles.detailsCard}>
            <div className={styles.cardHeader}>
              <BookOpen size={20} />
              <h3>Academic Information</h3>
            </div>
            <div className={styles.cardContent}>
              <div className={styles.infoRow}>
                <User size={16} />
                <span>Student ID:</span>
                <strong>{getDisplayValue(student.studentId)}</strong>
              </div>
              <div className={styles.infoRow}>
                <Calendar size={16} />
                <span>Admission Date:</span>
                <strong>{formatDate(student.admissionDate)}</strong>
              </div>
              <div className={styles.infoRow}>
                <BookOpen size={16} />
                <span>Current Class:</span>
                <strong>{getDisplayValue(student.currentClassId)}</strong>
              </div>
              <div className={styles.infoRow}>
                <Clock size={16} />
                <span>Time with Us:</span>
                <strong>
                  {getDisplayValue(
                    student.timeWithUs ? `${student.timeWithUs} years` : null
                  )}
                </strong>
              </div>
            </div>
          </div>

          {/* Classes */}
          <div className={styles.detailsCard}>
            <div className={styles.cardHeader}>
              <BookOpen size={20} />
              <h3>Classes ({student.classes?.length || 0})</h3>
            </div>
            <div className={styles.cardContent}>
              {student.classes && student.classes.length > 0 ? (
                <div className={styles.coursesList}>
                  {student.classes.map((classItem, index) => (
                    <div key={index} className={styles.courseItem}>
                      <BookOpen size={14} />
                      <span>{classItem}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className={styles.emptyMessage}>No classes assigned</p>
              )}
            </div>
          </div>

          {/* Parent Information */}
          <div className={styles.detailsCard}>
            <div className={styles.cardHeader}>
              <User2 size={20} />
              <h3>Parent Information</h3>
            </div>
            <div className={styles.cardContent}>
              {student.parent ? (
                <>
                  <div className={styles.infoRow}>
                    <User size={16} />
                    <span>Name:</span>
                    <strong>{student.parent.name}</strong>
                  </div>
                  <div className={styles.infoRow}>
                    <Phone size={16} />
                    <span>Phone:</span>
                    <strong>{student.parent.phone}</strong>
                  </div>
                  <div className={styles.infoRow}>
                    <Mail size={16} />
                    <span>Email:</span>
                    <strong>{getDisplayValue(student.parent.email)}</strong>
                  </div>
                  <div className={styles.infoRow}>
                    <User size={16} />
                    <span>Parent ID:</span>
                    <strong>{student.parent.id}</strong>
                  </div>
                </>
              ) : (
                <p className={styles.emptyMessage}>
                  No parent information available
                </p>
              )}
            </div>
          </div>

          {/* Fee Information */}
          <div className={styles.detailsCard}>
            <div className={styles.cardHeader}>
              <DollarSign size={20} />
              <h3>Fee Information</h3>
            </div>
            <div className={styles.cardContent}>
              {student.feeStatus ? (
                <>
                  <div className={styles.infoRow}>
                    <DollarSign size={16} />
                    <span>Status:</span>
                    <strong>
                      <span
                        className={styles.statusBadge}
                        style={{
                          backgroundColor:
                            student.feeStatus.status === 'paid'
                              ? '#dcfce7'
                              : student.feeStatus.status === 'pending'
                              ? '#fef3c7'
                              : '#fee2e2',
                          color:
                            student.feeStatus.status === 'paid'
                              ? '#166534'
                              : student.feeStatus.status === 'pending'
                              ? '#92400e'
                              : '#991b1b',
                        }}
                      >
                        {student.feeStatus.status.toUpperCase()}
                      </span>
                    </strong>
                  </div>
                  <div className={styles.infoRow}>
                    <DollarSign size={16} />
                    <span>Amount:</span>
                    <strong>${student.feeStatus.amount}</strong>
                  </div>
                  <div className={styles.infoRow}>
                    <Calendar size={16} />
                    <span>Due Date:</span>
                    <strong>{formatDate(student.feeStatus.dueDate)}</strong>
                  </div>
                </>
              ) : (
                <p className={styles.emptyMessage}>
                  No fee information available
                </p>
              )}
            </div>
          </div>

          {/* Academic Performance */}
          <div className={styles.detailsCard}>
            <div className={styles.cardHeader}>
              <TrendingUp size={20} />
              <h3>Academic Performance</h3>
            </div>
            <div className={styles.cardContent}>
              <div className={styles.statsGrid}>
                <div className={styles.statItem}>
                  <div
                    className={styles.statValue}
                    style={{
                      color: student.attendance?.percentage
                        ? getPercentageColor(student.attendance.percentage)
                        : '#6b7280',
                    }}
                  >
                    {getDisplayValue(
                      student.attendance?.percentage
                        ? `${student.attendance.percentage}%`
                        : null
                    )}
                  </div>
                  <div className={styles.statLabel}>Attendance</div>
                </div>
                <div className={styles.statItem}>
                  <div className={styles.statValue}>
                    {getDisplayValue(student.exams?.taken)}
                  </div>
                  <div className={styles.statLabel}>Exams Taken</div>
                </div>
                <div className={styles.statItem}>
                  <div className={styles.statValue}>
                    {getDisplayValue(
                      student.exams?.average
                        ? `${student.exams.average}%`
                        : null
                    )}
                  </div>
                  <div className={styles.statLabel}>Average Score</div>
                </div>
                <div className={styles.statItem}>
                  <div
                    className={styles.statValue}
                    style={{
                      color: student.progress?.overall
                        ? getPercentageColor(student.progress.overall)
                        : '#6b7280',
                    }}
                  >
                    {getDisplayValue(
                      student.progress?.overall
                        ? `${student.progress.overall}%`
                        : null
                    )}
                  </div>
                  <div className={styles.statLabel}>Overall Progress</div>
                </div>
              </div>
            </div>
          </div>

          {/* Latest Results */}
          <div className={styles.detailsCard}>
            <div className={styles.cardHeader}>
              <Award size={20} />
              <h3>Latest Results</h3>
            </div>
            <div className={styles.cardContent}>
              {student.results ? (
                <>
                  <div className={styles.infoRow}>
                    <Award size={16} />
                    <span>Last Exam:</span>
                    <strong>{student.results.lastExam}</strong>
                  </div>
                  <div className={styles.infoRow}>
                    <Award size={16} />
                    <span>Grade:</span>
                    <strong>
                      <span
                        style={{
                          color: getGradeColor(student.results.grade),
                          fontWeight: '700',
                        }}
                      >
                        {student.results.grade}
                      </span>
                    </strong>
                  </div>
                  <div className={styles.infoRow}>
                    <TrendingUp size={16} />
                    <span>Class Rank:</span>
                    <strong>{getDisplayValue(student.results.rank)}</strong>
                  </div>
                </>
              ) : (
                <p className={styles.emptyMessage}>
                  No recent results available
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
};

export default function ProtectedStudentDetails() {
  return (
    <ProtectedRoute roles={['Admin']}>
      <StudentDetailsPage />
    </ProtectedRoute>
  );
}
