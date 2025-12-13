import React from 'react';
import { X, AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react';
import styles from './AlertModal.module.css';

export type AlertUsage = 'delete' | 'warning' | 'success' | 'info' | 'error';

interface AlertModalProps {
    usage: AlertUsage;
    mainText: string;
    subText?: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm?: () => void;
    onCancel?: () => void;
    onClose?: () => void;
    isOpen?: boolean;
    showCancel?: boolean;
    showConfirm?: boolean;
    className?: string;
}

const AlertModal: React.FC<AlertModalProps> = ({
    usage = 'info',
    mainText,
    subText,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    onConfirm,
    onCancel,
    onClose,
    isOpen = true,
    showCancel = true,
    showConfirm = true,
    className = ''
}) => {
    if (!isOpen) return null;

    const getIcon = () => {
        switch (usage) {
            case 'delete':
            case 'error':
                return <XCircle className={styles.iconError} />;
            case 'warning':
                return <AlertTriangle className={styles.iconWarning} />;
            case 'success':
                return <CheckCircle className={styles.iconSuccess} />;
            default:
                return <Info className={styles.iconInfo} />;
        }
    };

    const getAlertClass = () => {
        switch (usage) {
            case 'delete':
            case 'error':
                return styles.alertError;
            case 'warning':
                return styles.alertWarning;
            case 'success':
                return styles.alertSuccess;
            default:
                return styles.alertInfo;
        }
    };

    const handleConfirm = () => {
        if (onConfirm) {
            onConfirm();
        }
        if (onClose) {
            onClose();
        }
    };

    const handleCancel = () => {
        if (onCancel) {
            onCancel();
        }
        if (onClose) {
            onClose();
        }
    };

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget && onClose) {
            onClose();
        }
    };

    return (
        <div className={styles.overlay} onClick={handleBackdropClick}>
            <div className={`${styles.modal} ${getAlertClass()} ${className}`}>
                <div className={styles.header}>
                    <div className={styles.iconContainer}>
                        {getIcon()}
                    </div>
                    {onClose && (
                        <button
                            className={styles.closeButton}
                            onClick={onClose}
                            aria-label="Close"
                        >
                            <X size={20} />
                        </button>
                    )}
                </div>

                <div className={styles.content}>
                    <h3 className={styles.mainText}>{mainText}</h3>
                    {subText && <p className={styles.subText}>{subText}</p>}
                </div>

                <div className={styles.actions}>
                    {showCancel && (
                        <button
                            className={styles.cancelButton}
                            onClick={handleCancel}
                        >
                            {cancelText}
                        </button>
                    )}
                    {showConfirm && (
                        <button
                            className={`${styles.confirmButton} ${getAlertClass()}`}
                            onClick={handleConfirm}
                        >
                            {confirmText}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AlertModal;