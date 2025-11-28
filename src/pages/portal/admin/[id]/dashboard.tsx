import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Sidebar from '../../../../components/Sidebar';
import { apiServices } from '../../../../lib/api';
import { Users, BookOpen, GraduationCap, DollarSign, TrendingUp, Activity } from 'lucide-react';
import { withAuth } from '../../../../lib/withAuth';
import styles from './admin.module.css';

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
            // Fetch dashboard stats
            Promise.all([
                apiServices.students.getAll(),
                apiServices.teachers.getAll(),
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
            <div className={styles.container}>
                <Sidebar name="Admin" role="admin" />
                <main className={styles.main}>
                    <div className={styles.loading}>Loading dashboard...</div>
                </main>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <Sidebar name="Admin" role="admin" />
            <main className={styles.main}>
                <header className={styles.header}>
                    <h1>Admin Dashboard</h1>
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

                    <div className={styles.statCard}>
                        <div className={styles.statIcon} style={{ background: '#dbeafe' }}>
                            <DollarSign size={24} color="#2563eb" />
                        </div>
                        <div className={styles.statInfo}>
                            <h3>Total Revenue</h3>
                            <p className={styles.statNumber}>${stats.totalRevenue.toLocaleString()}</p>
                        </div>
                    </div>
                </div>

                <div className={styles.quickActions}>
                    <h2>Quick Actions</h2>
                    <div className={styles.actionsGrid}>
                        <button
                            className={styles.actionBtn}
                            onClick={() => {
                                const routerInstance = router as any;
                                routerInstance?.push(`/portal/admin/${id}/students`);
                            }}
                        >
                            <Users size={20} />
                            Manage Students
                        </button>
                        <button
                            className={styles.actionBtn}
                            onClick={() => {
                                const routerInstance = router as any;
                                routerInstance?.push(`/portal/admin/${id}/teachers`);
                            }}
                        >
                            <GraduationCap size={20} />
                            Manage Teachers
                        </button>
                        <button
                            className={styles.actionBtn}
                            onClick={() => {
                                const routerInstance = router as any;
                                routerInstance?.push(`/portal/admin/${id}/courses`);
                            }}
                        >
                            <BookOpen size={20} />
                            Manage Courses
                        </button>
                        <button
                            className={styles.actionBtn}
                            onClick={() => {
                                const routerInstance = router as any;
                                routerInstance?.push(`/portal/admin/${id}/fees`);
                            }}
                        >
                            <DollarSign size={20} />
                            Manage Fees
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default withAuth(AdminDashboard, ['Admin']);

