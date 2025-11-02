import React from 'react';
import { useRouter } from 'next/router';
import Sidebar from '../../../../components/Sidebar';
import styles from './teacher.module.css';

const TeacherAssignments = () => {
    const router = useRouter();
    const { id } = router.query;

    return (
        <div className={styles.container}>
            <Sidebar name="Teacher Name" role="teacher" />
            <main className={styles.main}>
                <h1>Manage Assignments</h1>
                <div className={styles.assignmentsContainer}>
                    {/* Add assignments management content here */}
                </div>
            </main>
        </div>
    );
};

export default TeacherAssignments;