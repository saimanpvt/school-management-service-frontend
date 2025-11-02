import React from 'react';
import { useRouter } from 'next/router';
import Sidebar from '../../../../components/Sidebar';
import styles from './student.module.css';

const StudentAssignments = () => {
    const router = useRouter();
    const { id } = router.query;

    return (
        <div className={styles.container}>
            <Sidebar name="Student Name" role="student" />
            <main className={styles.main}>
                <h1>My Assignments</h1>
                <div className={styles.assignmentsGrid}>
                    {/* Add assignments list/grid here */}
                </div>
            </main>
        </div>
    );
};

export default StudentAssignments;