import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { X, CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';
import styles from './Toaster.module.css';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
    id: string;
    type: NotificationType;
    title: string;
    message?: string;
    duration?: number;
    action?: {
        label: string;
        onClick: () => void;
    };
}

interface NotificationState {
    notifications: Notification[];
}

type NotificationAction =
    | { type: 'ADD_NOTIFICATION'; payload: Notification }
    | { type: 'REMOVE_NOTIFICATION'; payload: string };

const NotificationContext = createContext<{
    notifications: Notification[];
    addNotification: (notification: Omit<Notification, 'id'>) => void;
    removeNotification: (id: string) => void;
} | null>(null);

const notificationReducer = (
    state: NotificationState,
    action: NotificationAction
): NotificationState => {
    switch (action.type) {
        case 'ADD_NOTIFICATION':
            return {
                ...state,
                notifications: [...state.notifications, action.payload],
            };
        case 'REMOVE_NOTIFICATION':
            return {
                ...state,
                notifications: state.notifications.filter(
                    (notification) => notification.id !== action.payload
                ),
            };
        default:
            return state;
    }
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [state, dispatch] = useReducer(notificationReducer, {
        notifications: [],
    });

    const addNotification = useCallback(
        (notification: Omit<Notification, 'id'>) => {
            const id = Math.random().toString(36).substr(2, 9);
            const newNotification: Notification = {
                ...notification,
                id,
                duration: notification.duration ?? 5000,
            };

            dispatch({ type: 'ADD_NOTIFICATION', payload: newNotification });

            // Auto remove after duration
            if (newNotification.duration && newNotification.duration > 0) {
                setTimeout(() => {
                    dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
                }, newNotification.duration);
            }
        },
        []
    );

    const removeNotification = useCallback((id: string) => {
        dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
    }, []);

    return (
        <NotificationContext.Provider
            value={{
                notifications: state.notifications,
                addNotification,
                removeNotification,
            }}
        >
            {children}
            <ToasterContainer />
        </NotificationContext.Provider>
    );
};

const ToasterContainer: React.FC = () => {
    const context = useContext(NotificationContext);
    if (!context) return null;

    const { notifications, removeNotification } = context;

    return (
        <div className={styles.container}>
            {notifications.map((notification) => (
                <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onRemove={() => removeNotification(notification.id)}
                />
            ))}
        </div>
    );
};

interface NotificationItemProps {
    notification: Notification;
    onRemove: () => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
    notification,
    onRemove,
}) => {
    const getIcon = () => {
        switch (notification.type) {
            case 'success':
                return <CheckCircle className={styles.iconSuccess} />;
            case 'error':
                return <XCircle className={styles.iconError} />;
            case 'warning':
                return <AlertTriangle className={styles.iconWarning} />;
            default:
                return <Info className={styles.iconInfo} />;
        }
    };

    const getNotificationClass = () => {
        switch (notification.type) {
            case 'success':
                return styles.notificationSuccess;
            case 'error':
                return styles.notificationError;
            case 'warning':
                return styles.notificationWarning;
            default:
                return styles.notificationInfo;
        }
    };

    return (
        <div className={`${styles.notification} ${getNotificationClass()}`}>
            <div className={styles.iconContainer}>
                {getIcon()}
            </div>
            <div className={styles.content}>
                <div className={styles.title}>{notification.title}</div>
                {notification.message && (
                    <div className={styles.message}>{notification.message}</div>
                )}
                {notification.action && (
                    <button
                        className={styles.actionButton}
                        onClick={notification.action.onClick}
                    >
                        {notification.action.label}
                    </button>
                )}
            </div>
            <button className={styles.closeButton} onClick={onRemove}>
                <X size={16} />
            </button>
        </div>
    );
};

// Hook to use notifications
export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};

// Utility function for easy notification calls (similar to your notify function)
export const notify = (
    notification: { title: string; message?: string; action?: Notification['action'] },
    type: NotificationType = 'info',
    duration?: number
) => {
    // This will be used with the hook inside components
    return {
        type,
        title: notification.title,
        message: notification.message,
        action: notification.action,
        duration,
    };
};

export default NotificationProvider;