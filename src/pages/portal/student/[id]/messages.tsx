import React from 'react';
import { useRouter } from 'next/router';
import Sidebar from '../../../../components/Sidebar';
import styles from './student.module.css';

const StudentMessages = () => {
    const router = useRouter();
    const { id } = router.query;

    return (
        <div className={styles.container}>
            <Sidebar name="Student Name" role="student" />
            <main className={styles.main}>
                <h1>Messages</h1>
                <div className={styles.messagesContainer}>
                    {/* Add messages content here */}
                </div>
            </main>
        </div>
    );
};

export default StudentMessages;