import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Sidebar from '../../../../components/Sidebar';
import { withAuth } from '../../../../lib/withAuth';
import { apiServices } from '../../../../lib/api';
import { FileText, Plus, Search, Calendar } from 'lucide-react';
import styles from './admin.module.css';

const AdminExams = () => {
    const router = useRouter();
    const { id } = router.query;
    const [exams, setExams] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            apiServices.exams.getAll()
                .then(response => {
                    if (response.success) {
                        setExams(response.data || []);
                    }
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Error fetching exams:', error);
                    setLoading(false);
                });
        }
    }, [id]);

    if (loading) {
        return (
            <div className={styles.container}>
                <Sidebar name="Admin" role="admin" />
                <main className={styles.main}>
                    <div className={styles.loading}>Loading exams...</div>
                </main>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <Sidebar name="Admin" role="admin" />
            <main className={styles.main}>
                <header className={styles.pageHeader}>
                    <div>
                        <h1>Manage Exams</h1>
                        <p>View and manage all exams in the system</p>
                    </div>
                    <button className={styles.createBtn}>
                        <Plus size={18} />
                        Add Exam
                    </button>
                </header>

                <div className={styles.gridContainer}>
                    {exams.length > 0 ? (
                        exams.map(exam => (
                            <div key={exam.id} className={styles.card}>
                                <h3>{exam.title || 'N/A'}</h3>
                                <p>{exam.subject || 'N/A'}</p>
                                <div className={styles.cardMeta}>
                                    <span><Calendar size={14} /> {exam.date || 'N/A'}</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className={styles.emptyState}>
                            <FileText size={48} />
                            <h3>No exams found</h3>
                            <p>No exams scheduled in the system</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default AdminExams;

