import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import PortalLayout from '../../../../components/PortalLayout';
import { ProtectedRoute } from '../../../../lib/auth';
import { apiServices } from '../../../../services/api';
import { FileText, Plus, Search, Calendar } from 'lucide-react';
import styles from './admin.module.css';
import LoadingDots from '../../../../components/LoadingDots';

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
            <PortalLayout userName="Admin" userRole="admin">
                <div className={styles.loading}><LoadingDots /></div>
            </PortalLayout>
        );
    }

    return (
        <PortalLayout userName="Admin" userRole="admin">
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
        </PortalLayout>
    );
};

export default AdminExams;

