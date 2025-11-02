import React from 'react';
import { useRouter } from 'next/router';
import Sidebar from '../../../../components/Sidebar';
import styles from './teacher.module.css';

const TeacherClass = () => {
    const router = useRouter();
    const { id } = router.query;

    return (
        <div className={styles.container}>
            <Sidebar name="Teacher Name" role="teacher" />
            <main className={styles.main}>
                <h1>My Classes</h1>
                <div className={styles.classesGrid}>
                    {/* Add class list/grid here */}
                </div>
            </main>
        </div>
    );
};

export default TeacherClass;