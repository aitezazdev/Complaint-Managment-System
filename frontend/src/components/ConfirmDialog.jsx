import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'danger', 
  loading = false,
}) => {
  if (!isOpen) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'danger':
        return {
          button: 'bg-red-600 hover:bg-red-700',
          icon: 'text-red-600',
          iconBg: 'bg-red-100',
        };
      case 'warning':
        return {
          button: 'bg-amber-600 hover:bg-amber-700',
          icon: 'text-amber-600',
          iconBg: 'bg-amber-100',
        };
      case 'info':
        return {
          button: 'bg-blue-600 hover:bg-blue-700',
          icon: 'text-blue-600',
          iconBg: 'bg-blue-100',
        };
      default:
        return {
          button: 'bg-gray-600 hover:bg-gray-700',
          icon: 'text-gray-600',
          iconBg: 'bg-gray-100',
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-lg max-w-md w-full shadow-2xl animate-fadeIn">
     
        <div className="p-6 pb-4">
          <div className="flex items-start gap-4">
            <div className={`shrink-0 w-12 h-12 rounded-full ${styles.iconBg} flex items-center justify-center`}>
              <AlertTriangle className={`w-6 h-6 ${styles.icon}`} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {title}
              </h3>
              <p className="text-sm text-gray-600">
                {message}
              </p>
            </div>
            <button
              onClick={onClose}
              disabled={loading}
              className="shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="flex gap-3 justify-end p-6 pt-2 border-t border-gray-100">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 ${styles.button}`}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;