import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import PortalLayout from '../../../../components/PortalLayout';
import { parentService } from '../../../../services/parent.service';
import { DollarSign, Calendar, CheckCircle, AlertCircle, CreditCard } from 'lucide-react';
import styles from './parent.module.css';

interface Fee {
    id: string;
    title: string;
    amount: number;
    dueDate: string;
    childId: string;
    childName: string;
    status: 'paid' | 'pending' | 'overdue';
    paymentDate?: string;
    transactionId?: string;
}

const ParentFees = () => {
    const router = useRouter();
    const { id } = router.query;
    const [fees, setFees] = useState<Fee[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedChild, setSelectedChild] = useState<string>('all');

    useEffect(() => {
        if (id) {
            // Mock data - replace with actual API call
            setTimeout(() => {
                const mockData: Fee[] = [
                    {
                        id: '1',
                        title: 'Tuition Fee - Semester 1',
                        amount: 5000,
                        dueDate: '2024-02-01',
                        childId: 'c1',
                        childName: 'John Doe',
                        status: 'paid',
                        paymentDate: '2024-01-28',
                        transactionId: 'TXN123456'
                    },
                    {
                        id: '2',
                        title: 'Library Fee',
                        amount: 500,
                        dueDate: '2024-02-15',
                        childId: 'c1',
                        childName: 'John Doe',
                        status: 'pending'
                    },
                    {
                        id: '3',
                        title: 'Lab Fee',
                        amount: 1000,
                        dueDate: '2024-01-20',
                        childId: 'c1',
                        childName: 'John Doe',
                        status: 'overdue'
                    }
                ];
                setFees(mockData);
                setLoading(false);
            }, 1000);
        }
    }, [id]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const children = Array.from(new Set(fees.map(f => ({ id: f.childId, name: f.childName }))));
    const filteredFees = selectedChild === 'all'
        ? fees
        : fees.filter(f => f.childId === selectedChild);

    const totalPending = filteredFees.filter(f => f.status === 'pending' || f.status === 'overdue')
        .reduce((sum, f) => sum + f.amount, 0);

    const totalPaid = filteredFees.filter(f => f.status === 'paid')
        .reduce((sum, f) => sum + f.amount, 0);

    if (loading) {
        return (
            <PortalLayout userName="Parent" userRole="parent">
                <div className={styles.loading}><LoadingDots /></div>
            </PortalLayout>
        );
    }

    return (
        <PortalLayout userName="Parent" userRole="parent">
            <div className={styles.main}>
                <header className={styles.header}>
                    <div>
                        <h1>Fee Management</h1>
                        <p>Manage fee payments for your children</p>
                    </div>
                    {children.length > 1 && (
                        <select
                            value={selectedChild}
                            onChange={(e) => setSelectedChild(e.target.value)}
                            className={styles.childSelect}
                        >
                            <option value="all">All Children</option>
                            {children.map(child => (
                                <option key={child.id} value={child.id}>{child.name}</option>
                            ))}
                        </select>
                    )}
                </header>

                <div className={styles.statsGrid}>
                    <div className={styles.statsCard}>
                        <h3>Total Paid</h3>
                        <p className={styles.statNumber} style={{ color: '#059669' }}>
                            ${totalPaid.toLocaleString()}
                        </p>
                    </div>
                    <div className={styles.statsCard}>
                        <h3>Pending Payment</h3>
                        <p className={styles.statNumber} style={{ color: '#dc2626' }}>
                            ${totalPending.toLocaleString()}
                        </p>
                    </div>
                </div>

                <div className={styles.feesContainer}>
                    {filteredFees.length > 0 ? (
                        filteredFees.map(fee => (
                            <div key={fee.id} className={styles.feeCard}>
                                <div className={styles.feeInfo}>
                                    <div className={styles.feeTitle}>{fee.title}</div>
                                    <div className={styles.childName}>{fee.childName}</div>
                                    <div className={styles.feeAmount}>${fee.amount.toLocaleString()}</div>
                                    <div className={styles.feeDueDate}>
                                        <Calendar size={14} />
                                        Due: {formatDate(fee.dueDate)}
                                    </div>
                                    {fee.paymentDate && (
                                        <div className={styles.paymentInfo}>
                                            <CheckCircle size={14} />
                                            Paid on {formatDate(fee.paymentDate)}
                                        </div>
                                    )}
                                    {fee.transactionId && (
                                        <div className={styles.transactionId}>
                                            Transaction ID: {fee.transactionId}
                                        </div>
                                    )}
                                    <span className={`${styles.statusBadge} ${styles[fee.status]}`}>
                                        {fee.status === 'paid' && <CheckCircle size={12} />}
                                        {fee.status === 'overdue' && <AlertCircle size={12} />}
                                        {fee.status.charAt(0).toUpperCase() + fee.status.slice(1)}
                                    </span>
                                </div>
                                {fee.status !== 'paid' && (
                                    <button className={styles.payBtn}>
                                        <CreditCard size={18} />
                                        Pay Now
                                    </button>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className={styles.emptyState}>
                            <DollarSign size={48} />
                            <h3>No fees available</h3>
                            <p>Fee records will appear here</p>
                        </div>
                    )}
                </div>
            </div>
        </PortalLayout>
    );
};

export default ParentFees;
