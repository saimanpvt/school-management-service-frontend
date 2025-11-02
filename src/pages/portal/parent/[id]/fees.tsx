import React from 'react';
import { useRouter } from 'next/router';
import Sidebar from '../../../../components/Sidebar';
import styles from './parent.module.css';

const ParentFees = () => {
    const router = useRouter();
    const { id } = router.query;

    return (
        <div className={styles.container}>
            <Sidebar name="Parent Name" role="parent" />
            <main className={styles.main}>
                <h1>Fee Management</h1>
                <div className={styles.feesContainer}>
                    {/* Add fees management content here */}
                </div>
            </main>
        </div>
    );
};

export default ParentFees;