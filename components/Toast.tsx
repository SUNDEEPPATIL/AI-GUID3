
import React, { useEffect, useState, useCallback } from 'react';
import { ToastMessage } from '../ToastContext';
import InfoIcon from './icons/InfoIcon';
import CloseIcon from './icons/CloseIcon';

interface ToastProps {
  toast: ToastMessage;
  onClose: (id: number) => void;
}

const toastConfig = {
  error: {
    icon: InfoIcon,
    bgClass: 'bg-red-900/80 backdrop-blur-sm border-red-500/50',
    iconClass: 'text-red-400',
  },
  info: {
    icon: InfoIcon,
    bgClass: 'bg-blue-900/80 backdrop-blur-sm border-blue-500/50',
    iconClass: 'text-blue-400',
  },
};

const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  const { id, message, type } = toast;
  const [isFadingOut, setIsFadingOut] = useState(false);
  
  const config = toastConfig[type] || toastConfig.info;
  const Icon = config.icon;

  const handleClose = useCallback(() => {
    setIsFadingOut(true);
    setTimeout(() => onClose(id), 300); 
  }, [id, onClose]);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, 5000); // Auto-dismiss after 5 seconds

    return () => clearTimeout(timer);
  }, [id, handleClose]);

  const baseClasses = "transform transition-all duration-300 ease-in-out";
  const animationClasses = isFadingOut
    ? "opacity-0 translate-y-4 sm:translate-x-4"
    : "opacity-100 translate-y-0 sm:translate-x-0";

  return (
    <div className={`${baseClasses} ${animationClasses} w-full max-w-sm rounded-lg shadow-lg pointer-events-auto overflow-hidden border ${config.bgClass}`}>
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Icon className={`w-6 h-6 ${config.iconClass}`} aria-hidden="true" />
          </div>
          <div className="ml-3 w-0 flex-1 pt-0.5">
            <p className="text-sm font-medium text-gray-200">
              {message}
            </p>
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              onClick={handleClose}
              className="inline-flex text-gray-400 rounded-md hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-500"
            >
              <span className="sr-only">Close</span>
              <CloseIcon className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Toast;
