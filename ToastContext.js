import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useState, useCallback, useContext } from 'react';
const ToastContext = createContext(undefined);
export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);
    const addToast = useCallback((message, type) => {
        const id = Date.now() + Math.random();
        setToasts(currentToasts => [{ id, message, type }, ...currentToasts]);
    }, []);
    const removeToast = useCallback((id) => {
        setToasts(currentToasts => currentToasts.filter(toast => toast.id !== id));
    }, []);
    return (_jsx(ToastContext.Provider, { value: { addToast, toasts, removeToast }, children: children }));
};
export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};
