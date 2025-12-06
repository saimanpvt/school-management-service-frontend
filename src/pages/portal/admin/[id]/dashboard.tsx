import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import PortalLayout from '../../../../components/PortalLayout';
import { apiServices } from '../../../../services/api';
import { Users, BookOpen, GraduationCap, DollarSign, TrendingUp, Activity } from 'lucide-react';
import { ProtectedRoute } from '../../../../lib/auth';
import styles from './admin.module.css';
import LoadingDots from '../../../../components/LoadingDots';

const AdminDashboard = () => {
    const router = useRouter();
    const { id } = router.query;
    const [stats, setStats] = useState({
        totalStudents: 0,
        totalTeachers: 0,
        totalCourses: 0,
        totalRevenue: 0,
        recentActivity: [] as any[],
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            // Fetch dashboard stats using unified users API
            Promise.all([
                apiServices.users.getByRole(3), // Students
                apiServices.users.getByRole(2), // Teachers
                apiServices.courses.getAll(),
                apiServices.fees.getAll(),
            ])
                .then(([studentsRes, teachersRes, coursesRes, feesRes]) => {
                    const totalRevenue = feesRes.success
                        ? feesRes.data?.reduce((sum: number, fee: any) => sum + (fee.amount || 0), 0) || 0
                        : 0;

                    setStats({
                        totalStudents: studentsRes.success ? studentsRes.data?.length || 0 : 0,
                        totalTeachers: teachersRes.success ? teachersRes.data?.length || 0 : 0,
                        totalCourses: coursesRes.success ? coursesRes.data?.length || 0 : 0,
                        totalRevenue,
                        recentActivity: [],
                    });
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Error fetching dashboard stats:', error);
                    setLoading(false);
                });
        }
    }, [id]);

    if (loading) {
        return (
            <PortalLayout userName="Admin" userRole="admin">
                <div className={styles.loading}><LoadingDots /></div>
            </PortalLayout>
        );
    }

    return (
        <PortalLayout userName="Admin" userRole="admin">
            <header className={styles.header}>
                <h1>Your Dashboard</h1>
                <p>Overview of your school management system</p>
            </header>

            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: '#eef2ff' }}>
                        <Users size={24} color="#6366f1" />
                    </div>
                    <div className={styles.statInfo}>
                        <h3>Total Students</h3>
                        <p className={styles.statNumber}>{stats.totalStudents}</p>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: '#f0fdf4' }}>
                        <GraduationCap size={24} color="#059669" />
                    </div>
                    <div className={styles.statInfo}>
                        <h3>Total Teachers</h3>
                        <p className={styles.statNumber}>{stats.totalTeachers}</p>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: '#fef3c7' }}>
                        <BookOpen size={24} color="#d97706" />
                    </div>
                    <div className={styles.statInfo}>
                        <h3>Total Courses</h3>
                        <p className={styles.statNumber}>{stats.totalCourses}</p>
                    </div>
                </div>


            </div>
        </PortalLayout>
    );
};

export default function ProtectedAdminDashboard() {
    return (
        <ProtectedRoute allowedRoles={['Admin']}>
            <AdminDashboard />
        </ProtectedRoute>
    );
}

