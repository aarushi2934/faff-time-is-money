import React, { useEffect } from 'react';
import { CheckCircle, X } from 'lucide-react';

interface ToastProps {
    message: string;
    isVisible: boolean;
    onClose: () => void;
    type?: 'success' | 'info' | 'warning' | 'error';
}

export const Toast: React.FC<ToastProps> = ({
    message,
    isVisible,
    onClose,
    type = 'success'
}) => {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                onClose();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [isVisible, onClose]);

    if (!isVisible) return null;

    const getTypeStyles = () => {
        switch (type) {
            case 'success':
                return 'bg-green-500 text-white';
            case 'info':
                return 'bg-blue-500 text-white';
            case 'warning':
                return 'bg-yellow-500 text-white';
            case 'error':
                return 'bg-red-500 text-white';
            default:
                return 'bg-[#145C48] text-white';
        }
    };

    return (
        <div className={`fixed top-4 right-4 md:top-8 md:right-8 z-50 ${getTypeStyles()} px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 max-w-sm transform transition-all duration-300 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
            }`}>
            <CheckCircle size={20} />
            <span className="text-sm font-medium flex-1">{message}</span>
            <button
                onClick={onClose}
                className="text-white/80 hover:text-white transition-colors"
            >
                <X size={16} />
            </button>
        </div>
    );
};
