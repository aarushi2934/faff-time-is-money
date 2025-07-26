import React from 'react';
import { ChevronUp } from 'lucide-react';

interface BackToTopProps {
    isVisible: boolean;
}

export const BackToTop: React.FC<BackToTopProps> = ({ isVisible }) => {
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    if (!isVisible) return null;

    return (
        <button
            onClick={scrollToTop}
            className="fixed bottom-4 left-4 md:bottom-8 md:left-8 z-50 bg-white/90 backdrop-blur-sm text-[#145C48] rounded-full p-3 md:p-4 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-2 border-[#145C48]/20 hover:border-[#145C48]/40"
            aria-label="Back to top"
        >
            <ChevronUp size={20} className="md:w-6 md:h-6" />
        </button>
    );
};
