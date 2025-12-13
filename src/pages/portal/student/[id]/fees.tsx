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
import { useNotification } from '../../../../components/Toaster/Toaster';
import { apiServices } from '../../../../services/api';
import {
  STUDENT_FEE_STATUS,
} from '../../../../lib/constants';
import {
  formatDateForStudent,
  getFeeStatusClass,
} from '../../../../lib/helpers';
import {
  StudentFee,
} from '../../../../lib/types';

const StudentFees = () => {
  const router = useRouter();
  const { id } = router.query;
  const [fees, setFees] = useState<StudentFee[]>([]);
  const [loading, setLoading] = useState(true);
  const { addNotification } = useNotification();

  useEffect(() => {
    const loadFees = async () => {
      if (id) {
        try {
          const response = await apiServices.fees.getAll();
          if (response.success && response.data) {
            const feesData = Array.isArray(response.data) ? response.data : [];
            setFees(feesData);
          } else {
            setFees([]);
            addNotification({ type: 'error', title: 'Failed to load fee records' });
          }
        } catch (error) {
          console.error('Error fetching fees:', error);
          addNotification({ type: 'error', title: 'Error loading fees. Please try again.' });
          setFees([]);
        } finally {
          setLoading(false);
        }
      }
    };
    loadFees();
  }, [id, addNotification]);



  const totalPending = fees
    .filter((f) => f.status === STUDENT_FEE_STATUS.PENDING || f.status === STUDENT_FEE_STATUS.OVERDUE)
    .reduce((sum, f) => sum + f.amount, 0);

  const totalPaid = fees
    .filter((f) => f.status === STUDENT_FEE_STATUS.PAID)
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

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>
            Total Paid
          </div>
          <div className={styles.statValuePaid}>
            ${totalPaid.toLocaleString()}
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>
            Pending Payment
          </div>
          <div className={styles.statValuePending}>
            ${totalPending.toLocaleString()}
          </div>
        </div>
      </div>

      <div className={styles.feesContainer}>
        {fees.length > 0 ? (
          fees.map((fee) => (
            <div key={fee.id} className={styles.feeCard}>
              <div className={styles.feeInfo}>
                <div className={styles.feeTitle}>{fee.description}</div>
                <div className={styles.feeAmount}>
                  ${fee.amount.toLocaleString()}
                </div>
                <div className={styles.feeDueDate}>
                  <Calendar size={14} />
                  Due: {formatDateForStudent(fee.dueDate)}
                </div>
                {fee.status === STUDENT_FEE_STATUS.PAID && (
                  <div className={styles.paymentStatus}>
                    <CheckCircle size={14} />
                    Payment Completed
                  </div>
                )}
                <span className={`${styles.feeStatus} ${styles[getFeeStatusClass(fee.status)]}`}>
                  {fee.status === STUDENT_FEE_STATUS.PAID && (
                    <CheckCircle size={12} style={{ marginRight: '0.25rem' }} />
                  )}
                  {fee.status === STUDENT_FEE_STATUS.OVERDUE && (
                    <AlertCircle size={12} style={{ marginRight: '0.25rem' }} />
                  )}
                  {fee.status.charAt(0).toUpperCase() + fee.status.slice(1)}
                </span>
              </div>
              {fee.status !== STUDENT_FEE_STATUS.PAID && (
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
