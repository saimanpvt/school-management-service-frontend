import React from 'react';
import { useRouter } from 'next/router';
import Sidebar from '../../../../components/Sidebar';
import styles from './student.module.css';

const StudentCourses = () => {
    const router = useRouter();
    const { id } = router.query;

    return (
        <div className={styles.container}>
            <Sidebar name="Student Name" role="student" />
            <main className={styles.main}>
                <h1>My Courses</h1>
                <div className={styles.coursesGrid}>
                    {/* Add course list/grid here */}
                </div>
            </main>
        </div>
    );
};

export default StudentCourses;