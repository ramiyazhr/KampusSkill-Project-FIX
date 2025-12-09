
import React, { createContext, useState, useContext, useCallback } from 'react';
import { ToastMessage } from '../types';

interface ToastContextType {
    toasts: ToastMessage[];
    addToast: (message: string, type: ToastMessage['type']) => void;
    removeToast: (id: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

let toastId = 0;

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<ToastMessage[]>([]);

    const addToast = useCallback((message: string, type: ToastMessage['type']) => {
        const id = toastId++;
        setToasts(prevToasts => [...prevToasts, { id, message, type }]);
        setTimeout(() => {
            removeToast(id);
        }, 5000);
    }, []);

    const removeToast = useCallback((id: number) => {
        setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
            {children}
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};
