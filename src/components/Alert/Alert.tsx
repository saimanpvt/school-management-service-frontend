import React from 'react';
import styles from './Alert.module.css';

export type AlertType = 'success' | 'error' | 'warning' | 'info';

export interface AlertProps {
  type: AlertType;
  title: string;
  message: string;
  isOpen: boolean;
  onClose?: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  showCancel?: boolean;
  showConfirm?: boolean;
  autoClose?: boolean;
  autoCloseDelay?: number;
}

const Alert: React.FC<AlertProps> = ({
  type = 'info',
  title,
  message,
  isOpen,
  onClose,
  onConfirm,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  showCancel = true,
  showConfirm = true,
  autoClose = false,
  autoCloseDelay = 3000,
}) => {
  React.useEffect(() => {
    if (autoClose && isOpen) {
      const timer = setTimeout(() => {
        onClose?.();
      }, autoCloseDelay);

      return () => clearTimeout(timer);
    }
  }, [autoClose, isOpen, autoCloseDelay, onClose]);

  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
      default:
        return 'ℹ';
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={`${styles.container} ${styles[type]}`}>
        <div className={styles.content}>
          <div className={styles.iconContainer}>
            <span className={styles.icon}>{getIcon()}</span>
          </div>

          <div className={styles.messageContainer}>
            <div className={styles.textCenter}>
              <h3 className={styles.title}>{title}</h3>
              <p className={styles.message}>{message}</p>
            </div>
          </div>

          <div className={styles.buttonContainer}>
            {showCancel && onClose && (
              <button
                onClick={onClose}
                className={`${styles.button} ${styles.cancelButton}`}
              >
                {cancelText}
              </button>
            )}

            {showConfirm && onConfirm && (
              <button
                onClick={() => {
                  onConfirm();
                  onClose?.();
                }}
                className={`${styles.button} ${styles.confirmButton}`}
              >
                {confirmText}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Alert;
