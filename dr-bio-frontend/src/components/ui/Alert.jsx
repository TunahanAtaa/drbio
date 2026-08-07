import React from 'react';
import { AlertTriangle, CheckCircle, Info, Bell } from 'lucide-react';

const Alert = ({
  children,
  variant = 'error',
  icon: CustomIcon,
  className = '',
  onClose,
  ...props
}) => {
  const variants = {
    error: {
      container: 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300',
      defaultIcon: AlertTriangle,
    },
    success: {
      container: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300',
      defaultIcon: CheckCircle,
    },
    warning: {
      container: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300',
      defaultIcon: AlertTriangle,
    },
    info: {
      container: 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300',
      defaultIcon: Info,
    },
  };

  const currentVariant = variants[variant] || variants.error;
  const IconComponent = CustomIcon || currentVariant.defaultIcon;

  return (
    <div
      className={`p-4 border rounded-2xl flex items-center space-x-3 text-sm font-bold animate-fade-in ${currentVariant.container} ${className}`.trim()}
      {...props}
    >
      {IconComponent && <IconComponent className="w-5 h-5 shrink-0" />}
      <div className="flex-1">{children}</div>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-auto text-current opacity-70 hover:opacity-100 transition-opacity"
        >
          &times;
        </button>
      )}
    </div>
  );
};

export default Alert;
