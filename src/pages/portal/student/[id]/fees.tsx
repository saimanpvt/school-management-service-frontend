import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import PortalLayout from '../../../../components/PortalLayout/PortalLayout';
import {
  DollarSign,
  Calendar,
  CreditCard,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import styles from './student.module.css';
import LoadingDots from '../../../../components/LoadingDots/LoadingDots';

interface Fee {
  id: string;
  title: string;
  amount: number;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue';
  paymentDate?: string;
  transactionId?: string;
}

const StudentFees = () => {
  const router = useRouter();
  const { id } = router.query;
  const [fees, setFees] = useState<Fee[]>([]);
  const [loading, setLoading] = useState(true);

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
            status: 'paid',
            paymentDate: '2024-01-28',
            transactionId: 'TXN123456',
          },
          {
            id: '2',
            title: 'Library Fee',
            amount: 500,
            dueDate: '2024-02-15',
            status: 'pending',
          },
          {
            id: '3',
            title: 'Lab Fee',
            amount: 1000,
            dueDate: '2024-01-20',
            status: 'overdue',
          },
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
      year: 'numeric',
    });
  };

  const totalPending = fees
    .filter((f) => f.status === 'pending' || f.status === 'overdue')
    .reduce((sum, f) => sum + f.amount, 0);

  const totalPaid = fees
    .filter((f) => f.status === 'paid')
    .reduce((sum, f) => sum + f.amount, 0);

  if (loading) {
    return (
      <PortalLayout userName="Student" userRole="student">
        <div className={styles.loading}>
          <LoadingDots />
        </div>
      </PortalLayout>
    );
  }

  return (
    <PortalLayout userName="Student" userRole="student">
      <header className={styles.pageHeader}>
        <h1>Fees & Payments</h1>
        <p>Manage your fee payments and transactions</p>
      </header>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        <div
          style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '1rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          }}
        >
          <div
            style={{
              color: '#64748b',
              fontSize: '0.875rem',
              marginBottom: '0.5rem',
            }}
          >
            Total Paid
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: '#059669' }}>
            ${totalPaid.toLocaleString()}
          </div>
        </div>
        <div
          style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '1rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          }}
        >
          <div
            style={{
              color: '#64748b',
              fontSize: '0.875rem',
              marginBottom: '0.5rem',
            }}
          >
            Pending Payment
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: '#dc2626' }}>
            ${totalPending.toLocaleString()}
          </div>
        </div>
      </div>

      <div className={styles.feesContainer}>
        {fees.length > 0 ? (
          fees.map((fee) => (
            <div key={fee.id} className={styles.feeCard}>
              <div className={styles.feeInfo}>
                <div className={styles.feeTitle}>{fee.title}</div>
                <div className={styles.feeAmount}>
                  ${fee.amount.toLocaleString()}
                </div>
                <div className={styles.feeDueDate}>
                  <Calendar size={14} />
                  Due: {formatDate(fee.dueDate)}
                </div>
                {fee.paymentDate && (
                  <div
                    style={{
                      fontSize: '0.875rem',
                      color: '#059669',
                      marginTop: '0.5rem',
                    }}
                  >
                    <CheckCircle size={14} style={{ marginRight: '0.25rem' }} />
                    Paid on {formatDate(fee.paymentDate)}
                  </div>
                )}
                {fee.transactionId && (
                  <div
                    style={{
                      fontSize: '0.75rem',
                      color: '#64748b',
                      marginTop: '0.25rem',
                    }}
                  >
                    Transaction ID: {fee.transactionId}
                  </div>
                )}
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '0.375rem',
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    marginTop: '0.75rem',
                    background:
                      fee.status === 'paid'
                        ? '#d1fae5'
                        : fee.status === 'overdue'
                          ? '#fee2e2'
                          : '#fef3c7',
                    color:
                      fee.status === 'paid'
                        ? '#059669'
                        : fee.status === 'overdue'
                          ? '#dc2626'
                          : '#d97706',
                  }}
                >
                  {fee.status === 'paid' && (
                    <CheckCircle size={12} style={{ marginRight: '0.25rem' }} />
                  )}
                  {fee.status === 'overdue' && (
                    <AlertCircle size={12} style={{ marginRight: '0.25rem' }} />
                  )}
                  {fee.status.charAt(0).toUpperCase() + fee.status.slice(1)}
                </span>
              </div>
              {fee.status !== 'paid' && (
                <button className={styles.payBtn}>
                  <CreditCard size={18} style={{ marginRight: '0.5rem' }} />
                  Pay Now
                </button>
              )}
            </div>
          ))
        ) : (
          <div className={styles.emptyState}>
            <DollarSign size={48} />
            <h3>No fees available</h3>
            <p>Your fee records will appear here.</p>
          </div>
        )}
      </div>
    </PortalLayout>
  );
};

export default StudentFees;
