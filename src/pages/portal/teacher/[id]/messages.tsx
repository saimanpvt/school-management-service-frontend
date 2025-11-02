import React from 'react';
import { useRouter } from 'next/router';
import Sidebar from '../../../../components/Sidebar';
import styles from './teacher.module.css';

const TeacherMessages = () => {
    const router = useRouter();
    const { id } = router.query;

    return (
        <div className={styles.container}>
            <Sidebar name="Teacher Name" role="teacher" />
            <main className={styles.main}>
                <h1>Messages</h1>
                <div className={styles.messagesContainer}>
                    {/* Add messages content here */}
                </div>
            </main>
        </div>
    );
};

export default TeacherMessages;