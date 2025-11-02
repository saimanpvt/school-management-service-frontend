import React from 'react';
import { useRouter } from 'next/router';
import Sidebar from '../../../../components/Sidebar';
import styles from './teacher.module.css';

const TeacherStudents = () => {
    const router = useRouter();
    const { id } = router.query;

    return (
        <div className={styles.container}>
            <Sidebar name="Teacher Name" role="teacher" />
            <main className={styles.main}>
                <h1>My Students</h1>
                <div className={styles.studentsGrid}>
                    {/* Add students list/grid here */}
                </div>
            </main>
        </div>
    );
};

export default TeacherStudents;