import React from 'react';
import styles from './student.module.css';
import Sidebar from '../../../../components/Sidebar';
import { useRouter } from 'next/router';

const StudentExams = () => {
    const router = useRouter();
    const { id } = router.query;

    return (
        <div className={styles.container}>
            <Sidebar name="Student Name" role="student" />
            <main className={styles.main}>
                <h1>Exams</h1>
                {/* Add exams content here */}
            </main>
        </div>
    );
};

export default StudentExams;