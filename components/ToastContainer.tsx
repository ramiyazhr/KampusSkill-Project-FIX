
import React from 'react';
import { useToast } from '../contexts/ToastContext';

const Toast: React.FC<{ message: string; type: 'success' | 'error' | 'info'; onClose: () => void }> = ({ message, type, onClose }) => {
    const baseClasses = "max-w-sm w-full bg-slate-800 shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden";
    const typeClasses = {
        success: 'border-l-4 border-green-500',
        error: 'border-l-4 border-red-500',
        info: 'border-l-4 border-sky-500',
    };
    
    const Icon: React.FC = () => {
      switch(type) {
        case 'success': return <svg className="h-6 w-6 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
        case 'error': return <svg className="h-6 w-6 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
        case 'info': return <svg className="h-6 w-6 text-sky-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
        default: return null;
      }
    };

    return (
        <div className={`${baseClasses} ${typeClasses[type]}`}>
            <div className="p-4">
                <div className="flex items-start">
                    <div className="flex-shrink-0">
                       <Icon />
                    </div>
                    <div className="ml-3 w-0 flex-1 pt-0.5">
                        <p className="text-sm font-medium text-slate-100">{message}</p>
                    </div>
                    <div className="ml-4 flex-shrink-0 flex">
                        <button onClick={onClose} className="bg-slate-800 rounded-md inline-flex text-slate-400 hover:text-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-primary">
                            <span className="sr-only">Close</span>
                             <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ToastContainer: React.FC = () => {
    const { toasts, removeToast } = useToast();

    return (
        <div className="fixed inset-0 flex items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-start z-50">
            <div className="w-full flex flex-col items-center space-y-4 sm:items-end">
                {toasts.map((toast) => (
                    <Toast
                        key={toast.id}
                        message={toast.message}
                        type={toast.type}
                        onClose={() => removeToast(toast.id)}
                    />
                ))}
            </div>
        </div>
    );
};


export default ToastContainer;
