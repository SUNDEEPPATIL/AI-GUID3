import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import { useToast } from '../ToastContext';
import Toast from './Toast';
const ToastContainer = () => {
    const { toasts, removeToast } = useToast();
    return (_jsx("div", { "aria-live": "assertive", className: "fixed inset-0 flex items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-start z-[100]", children: _jsx("div", { className: "w-full flex flex-col items-center space-y-4 sm:items-end", children: toasts.map((toast) => (_jsx(Toast, { toast: toast, onClose: removeToast }, toast.id))) }) }));
};
export default ToastContainer;
