import React from 'react';
import { useRouter } from 'next/router';
import Sidebar from '../../../../components/Sidebar';
import styles from './parent.module.css';

const ParentAttendance = () => {
    const router = useRouter();
    const { id } = router.query;

    return (
        <div className={styles.container}>
            <Sidebar name="Parent Name" role="parent" />
            <main className={styles.main}>
                <h1>Child's Attendance</h1>
                <div className={styles.attendanceContainer}>
                    {/* Add attendance content here */}
                </div>
            </main>
        </div>
    );
};

export default ParentAttendance;