import React from 'react';
import { useRouter } from 'next/router';
import Sidebar from '../../../../components/Sidebar';
import styles from './student.module.css';

const StudentGrades = () => {
    const router = useRouter();
    const { id } = router.query;

    return (
        <div className={styles.container}>
            <Sidebar name="Student Name" role="student" />
            <main className={styles.main}>
                <h1>My Grades</h1>
                <div className={styles.gradesContainer}>
                    {/* Add grades content here */}
                </div>
            </main>
        </div>
    );
};

export default StudentGrades;