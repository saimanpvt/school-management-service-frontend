import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Sidebar from '../../../../components/Sidebar';
import { withAuth } from '../../../../lib/withAuth';
import { apiServices } from '../../../../lib/api';
import { DollarSign, Plus, Search, Edit, Trash2 } from 'lucide-react';
import styles from './admin.module.css';

const AdminFees = () => {
    const router = useRouter();
    const { id } = router.query;
    const [fees, setFees] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (id) {
            apiServices.fees.getAll()
                .then(response => {
                    if (response.success) {
                        setFees(response.data || []);
                    }
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Error fetching fees:', error);
                    setLoading(false);
                });
        }
    }, [id]);

    const filteredFees = fees.filter(fee =>
        fee.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fee.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalRevenue = filteredFees.reduce((sum, fee) => sum + (fee.amount || 0), 0);

    const handleDelete = async (feeId: string) => {
        if (confirm('Are you sure you want to delete this fee structure?')) {
            try {
                await apiServices.fees.delete(feeId);
                setFees(fees.filter(f => f.id !== feeId));
            } catch (error) {
                console.error('Error deleting fee:', error);
                alert('Failed to delete fee structure');
            }
        }
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <Sidebar name="Admin" role="admin" />
                <main className={styles.main}>
                    <div className={styles.loading}>Loading fees...</div>
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
                        <h1>Manage Fees</h1>
                        <p>View and manage fee structures</p>
                    </div>
                    <div className={styles.headerActions}>
                        <div className={styles.searchBox}>
                            <Search size={18} />
                            <input
                                type="text"
                                placeholder="Search fees..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className={styles.searchInput}
                            />
                        </div>
                        <button className={styles.createBtn}>
                            <Plus size={18} />
                            Add Fee Structure
                        </button>
                    </div>
                </header>

                <div className={styles.revenueCard}>
                    <h3>Total Revenue</h3>
                    <p className={styles.revenueAmount}>${totalRevenue.toLocaleString()}</p>
                </div>

                <div className={styles.tableContainer}>
                    <table className={styles.dataTable}>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Amount</th>
                                <th>Due Date</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredFees.length > 0 ? (
                                filteredFees.map(fee => (
                                    <tr key={fee.id}>
                                        <td>{fee.title || 'N/A'}</td>
                                        <td>${fee.amount?.toLocaleString() || '0'}</td>
                                        <td>{fee.dueDate || 'N/A'}</td>
                                        <td>
                                            <span className={styles.statusBadge}>
                                                {fee.status || 'Active'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className={styles.actionButtons}>
                                                <button className={styles.editBtn}>
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    className={styles.deleteBtn}
                                                    onClick={() => handleDelete(fee.id)}
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className={styles.emptyState}>
                                        <DollarSign size={48} />
                                        <h3>No fees found</h3>
                                        <p>{searchTerm ? 'Try a different search term' : 'No fee structures in the system'}</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
};

export default AdminFees;

