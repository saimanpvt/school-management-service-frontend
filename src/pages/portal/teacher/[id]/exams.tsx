import React from 'react';
import styles from './teacher.module.css';
import Sidebar from '../../../../components/Sidebar';
import { useRouter } from 'next/router';

const TeacherExams = () => {
    const router = useRouter();
    const { id } = router.query;

    return (
        <div className={styles.container}>
            <Sidebar name="Teacher Name" role="teacher" />
            <main className={styles.main}>
                <h1>Manage Exams</h1>
                {/* Add exam management content here */}
            </main>
        </div>
    );
};

export default TeacherExams;