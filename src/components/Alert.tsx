import React from 'react';

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

    const getAlertStyles = () => {
        const baseStyles = "fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50";
        return baseStyles;
    };

    const getIconAndColors = () => {
        switch (type) {
            case 'success':
                return {
                    icon: '✓',
                    bgColor: 'bg-green-50',
                    borderColor: 'border-green-200',
                    iconBg: 'bg-green-100',
                    iconColor: 'text-green-600',
                    titleColor: 'text-green-800',
                    messageColor: 'text-green-700'
                };
            case 'error':
                return {
                    icon: '✕',
                    bgColor: 'bg-red-50',
                    borderColor: 'border-red-200',
                    iconBg: 'bg-red-100',
                    iconColor: 'text-red-600',
                    titleColor: 'text-red-800',
                    messageColor: 'text-red-700'
                };
            case 'warning':
                return {
                    icon: '⚠',
                    bgColor: 'bg-yellow-50',
                    borderColor: 'border-yellow-200',
                    iconBg: 'bg-yellow-100',
                    iconColor: 'text-yellow-600',
                    titleColor: 'text-yellow-800',
                    messageColor: 'text-yellow-700'
                };
            case 'info':
            default:
                return {
                    icon: 'ℹ',
                    bgColor: 'bg-blue-50',
                    borderColor: 'border-blue-200',
                    iconBg: 'bg-blue-100',
                    iconColor: 'text-blue-600',
                    titleColor: 'text-blue-800',
                    messageColor: 'text-blue-700'
                };
        }
    };

    const { icon, bgColor, borderColor, iconBg, iconColor, titleColor, messageColor } = getIconAndColors();

    return (
        <div className={getAlertStyles()}>
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <div className="mt-3">
                    <div className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full ${iconBg} mb-4`}>
                        <span className={`text-xl font-bold ${iconColor}`}>{icon}</span>
                    </div>

                    <div className={`p-4 rounded-lg ${bgColor} ${borderColor} border`}>
                        <div className="text-center">
                            <h3 className={`text-lg font-medium ${titleColor} mb-2`}>
                                {title}
                            </h3>
                            <p className={`text-sm ${messageColor} mb-4`}>
                                {message}
                            </p>
                        </div>
                    </div>

                    <div className="flex justify-center gap-3 mt-6">
                        {showCancel && onClose && (
                            <button
                                onClick={onClose}
                                className="px-4 py-2 bg-gray-300 text-gray-800 text-sm font-medium rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
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
                                className={`px-4 py-2 text-white text-sm font-medium rounded-md focus:outline-none focus:ring-2 ${type === 'error' || type === 'warning'
                                        ? 'bg-red-600 hover:bg-red-700 focus:ring-red-300'
                                        : type === 'success'
                                            ? 'bg-green-600 hover:bg-green-700 focus:ring-green-300'
                                            : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-300'
                                    }`}
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