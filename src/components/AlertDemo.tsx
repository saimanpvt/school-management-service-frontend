import React, { useState } from 'react';
import Alert from './Alert';

const AlertDemo: React.FC = () => {
  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info' as 'info' | 'success' | 'warning' | 'error',
    confirmText: 'OK',
    cancelText: 'Cancel',
    showCancel: false,
    onConfirm: () => {},
  });

  const closeAlert = () => {
    setAlertConfig((prev) => ({ ...prev, isOpen: false }));
  };

  // Delete confirmation example
  const showDeleteConfirmation = (itemName: string) => {
    setAlertConfig({
      isOpen: true,
      title: 'Confirm Delete',
      message: `Are you sure you want to delete "${itemName}"? This action cannot be undone.`,
      type: 'warning',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      showCancel: true,
      onConfirm: () => {
        // Perform delete action here
        console.log(`Deleting ${itemName}...`);
        // Show success message
        showSuccessAlert(`${itemName} deleted successfully!`);
      },
    });
  };

  // Success alert example
  const showSuccessAlert = (message: string) => {
    setAlertConfig({
      isOpen: true,
      title: 'Success',
      message: message,
      type: 'success',
      confirmText: 'OK',
      cancelText: 'Cancel',
      showCancel: false,
      onConfirm: () => {},
    });
  };

  // Error alert example
  const showErrorAlert = (message: string) => {
    setAlertConfig({
      isOpen: true,
      title: 'Error',
      message: message,
      type: 'error',
      confirmText: 'OK',
      cancelText: 'Cancel',
      showCancel: false,
      onConfirm: () => {},
    });
  };

  // Warning alert example
  const showWarningAlert = (message: string) => {
    setAlertConfig({
      isOpen: true,
      title: 'Warning',
      message: message,
      type: 'warning',
      confirmText: 'Proceed',
      cancelText: 'Cancel',
      showCancel: true,
      onConfirm: () => {
        showSuccessAlert('Action completed successfully!');
      },
    });
  };

  // Info alert example
  const showInfoAlert = (message: string) => {
    setAlertConfig({
      isOpen: true,
      title: 'Information',
      message: message,
      type: 'info',
      confirmText: 'OK',
      cancelText: 'Cancel',
      showCancel: false,
      onConfirm: () => {},
    });
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Alert Component Demo</h1>

      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => showDeleteConfirmation('John Doe')}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Delete User (Warning)
        </button>

        <button
          onClick={() => showSuccessAlert('Data saved successfully!')}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Show Success
        </button>

        <button
          onClick={() => showErrorAlert('Failed to connect to server!')}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Show Error
        </button>

        <button
          onClick={() =>
            showWarningAlert('You have unsaved changes. Continue anyway?')
          }
          className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
        >
          Show Warning
        </button>

        <button
          onClick={() =>
            showInfoAlert('System maintenance scheduled for tomorrow at 2 AM.')
          }
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Show Info
        </button>
      </div>

      {/* Alert Component */}
      <Alert
        isOpen={alertConfig.isOpen}
        onClose={closeAlert}
        onConfirm={alertConfig.onConfirm}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        confirmText={alertConfig.confirmText}
        cancelText={alertConfig.cancelText}
        showCancel={alertConfig.showCancel}
        showConfirm={true}
      />
    </div>
  );
};

export default AlertDemo;
