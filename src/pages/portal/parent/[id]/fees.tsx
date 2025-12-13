import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import PortalLayout from '../../../../components/PortalLayout/PortalLayout';
import {
  DollarSign,
  Calendar,
  CheckCircle,
  AlertCircle,
  CreditCard,
} from 'lucide-react';
import styles from './parent.module.css';
import LoadingDots from '../../../../components/LoadingDots/LoadingDots';
import { useNotification } from '../../../../components/Toaster/Toaster';
import { apiServices } from '../../../../services/api';
import { PARENT_FILTER_OPTIONS } from '../../../../lib/constants';
import { formatDateForParent } from '../../../../lib/helpers';
import { ParentChild, ParentFee } from '../../../../lib/types';

const ParentFees = () => {
  const router = useRouter();
  const { id } = router.query;
  const [fees, setFees] = useState<ParentFee[]>([]);
  const [children, setChildren] = useState<ParentChild[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedChild, setSelectedChild] = useState<string>(
    PARENT_FILTER_OPTIONS.ALL_CHILDREN
  );
  const { addNotification } = useNotification();
  const [paymentModal, setPaymentModal] = useState<{
    isOpen: boolean;
    fee: ParentFee | null;
  }>({
    isOpen: false,
    fee: null,
  });

  useEffect(() => {
    const loadFeesData = async () => {
      if (id) {
        try {
          setLoading(true);

          // Load children data
          const childrenResponse = {
            success: false,
            data: null,
          };
          if (childrenResponse?.success && childrenResponse.data) {
            setChildren(childrenResponse.data);
          }

          // Load fees data
          const feesResponse = {
            success: false,
            data: null,
          };
          if (feesResponse?.success && feesResponse.data) {
            setFees(feesResponse.data);
          } else {
            setFees([]);
            addNotification({
              type: 'info',
              title: 'No fee records found',
              message: 'Fee information will appear here once available.',
            });
          }
        } catch (error) {
          console.error('Error loading fees data:', error);
          addNotification({
            type: 'error',
            title: 'Failed to load fee data',
            message: 'Please try again later.',
          });
        } finally {
          setLoading(false);
        }
      }
    };

    loadFeesData();
  }, [id, addNotification]);

  // Get unique children from fees data
  const childrenFromFees = Array.from(
    new Set(fees.map((f) => ({ id: f.childId, name: f.childName })))
  );

  const filteredFees =
    selectedChild === PARENT_FILTER_OPTIONS.ALL_CHILDREN
      ? fees
      : fees.filter((f) => f.childId === selectedChild);

  const totalPending = filteredFees
    .filter((f) => f.status === 'pending' || f.status === 'overdue')
    .reduce((sum, f) => sum + f.amount, 0);

  const totalPaid = filteredFees
    .filter((f) => f.status === 'paid')
    .reduce((sum, f) => sum + f.amount, 0);

  const handlePayNow = (fee: ParentFee) => {
    setPaymentModal({ isOpen: true, fee });
  };

  const processPayment = async () => {
    if (!paymentModal.fee) return;

    try {
      // const response = await apiServices.parent?.processFeePayment(
      //   id as string,
      //   paymentModal.fee.id,
      //   {
      //     amount: paymentModal.fee.amount,
      //     childId: paymentModal.fee.childId,
      //   }
      // );
      const response = {
        success: false,
        data: null,
      };

      if (response?.success) {
        // Update fee status locally
        setFees(
          fees.map((f) =>
            f.id === paymentModal.fee?.id
              ? {
                  ...f,
                  status: 'paid' as const,
                  paymentDate: new Date().toISOString(),
                }
              : f
          )
        );

        addNotification({
          type: 'success',
          title: 'Payment Successful',
          message: `Payment for ${paymentModal.fee.title} has been processed successfully.`,
        });
      } else {
        addNotification({
          type: 'error',
          title: 'Payment Failed',
          message: 'Payment could not be processed. Please try again.',
        });
      }
    } catch (error) {
      console.error('Payment error:', error);
      addNotification({
        type: 'error',
        title: 'Payment Error',
        message: 'An error occurred while processing payment.',
      });
    } finally {
      setPaymentModal({ isOpen: false, fee: null });
    }
  };

  if (loading) {
    return (
      <PortalLayout userName="Parent" userRole="parent">
        <div className={styles.loading}>
          <LoadingDots />
        </div>
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
          {(children.length > 1 || childrenFromFees.length > 1) && (
            <select
              value={selectedChild}
              onChange={(e) => setSelectedChild(e.target.value)}
              className={styles.childSelect}
            >
              <option value={PARENT_FILTER_OPTIONS.ALL_CHILDREN}>
                All Children
              </option>
              {(children.length > 0 ? children : childrenFromFees).map(
                (child) => (
                  <option key={child.id} value={child.id}>
                    {child.name}
                  </option>
                )
              )}
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
            filteredFees.map((fee) => (
              <div key={fee.id} className={styles.feeCard}>
                <div className={styles.feeInfo}>
                  <div className={styles.feeTitle}>{fee.title}</div>
                  <div className={styles.childName}>{fee.childName}</div>
                  <div className={styles.feeAmount}>
                    ${fee.amount.toLocaleString()}
                  </div>
                  <div className={styles.feeDueDate}>
                    <Calendar size={14} />
                    Due: {formatDateForParent(fee.dueDate)}
                  </div>
                  {fee.paymentDate && (
                    <div className={styles.paymentInfo}>
                      <CheckCircle size={14} />
                      Paid on {formatDateForParent(fee.paymentDate)}
                    </div>
                  )}
                  {fee.transactionId && (
                    <div className={styles.transactionId}>
                      Transaction ID: {fee.transactionId}
                    </div>
                  )}
                  <span
                    className={`${styles.statusBadge} ${styles[fee.status]}`}
                  >
                    {fee.status === 'paid' && <CheckCircle size={12} />}
                    {fee.status === 'overdue' && <AlertCircle size={12} />}
                    {fee.status.charAt(0).toUpperCase() + fee.status.slice(1)}
                  </span>
                </div>
                {fee.status !== 'paid' && (
                  <button
                    className={styles.payBtn}
                    onClick={() => handlePayNow(fee)}
                  >
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

        {/* Payment Modal */}
        {paymentModal.isOpen && paymentModal.fee && (
          <div className={styles.modalOverlay}>
            <div className={styles.modal}>
              <h3>Confirm Payment</h3>
              <div className={styles.paymentDetails}>
                <p>
                  <strong>Fee:</strong> {paymentModal.fee.title}
                </p>
                <p>
                  <strong>Child:</strong> {paymentModal.fee.childName}
                </p>
                <p>
                  <strong>Amount:</strong> $
                  {paymentModal.fee.amount.toLocaleString()}
                </p>
                <p>
                  <strong>Due Date:</strong>{' '}
                  {formatDateForParent(paymentModal.fee.dueDate)}
                </p>
              </div>
              <div className={styles.modalActions}>
                <button
                  className={styles.cancelBtn}
                  onClick={() => setPaymentModal({ isOpen: false, fee: null })}
                >
                  Cancel
                </button>
                <button className={styles.confirmBtn} onClick={processPayment}>
                  Confirm Payment
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PortalLayout>
  );
};

export default ParentFees;
