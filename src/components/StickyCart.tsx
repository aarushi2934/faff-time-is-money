import React from 'react';
import { ShoppingCart, ChevronRight } from 'lucide-react';
import { CartState } from '../types';

interface StickyCartProps {
  cart: CartState;
  onCheckoutClick: () => void;
  isScrolled?: boolean;
}

export const StickyCart: React.FC<StickyCartProps> = ({ cart, onCheckoutClick, isScrolled = false }) => {
  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours === 0) return `${mins} mins`;
    if (mins === 0) return `${hours} ${hours === 1 ? 'Hour' : 'Hours'}`;
    return `${hours} ${hours === 1 ? 'Hour' : 'Hours'} ${mins} mins`;
  };

  if (cart.totalTimeInMinutes === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8 z-50">
      <button
        onClick={onCheckoutClick}
        className={`bg-[#145C48] text-white font-semibold py-3 px-4 rounded-full shadow-lg hover:shadow-xl hover:bg-[#0f4a3a] transition-all duration-300 flex items-center gap-3 ${isScrolled ? 'scale-105' : ''}`}
      >
        <ShoppingCart className="w-5 h-5 flex-shrink-0" />
        <div className="flex flex-col text-left">
          <span className="text-sm font-semibold">Checkout</span>
          <span className="text-xs opacity-90">{formatTime(cart.totalTimeInMinutes)}</span>
        </div>
        <ChevronRight className="w-4 h-4 flex-shrink-0" />
      </button>
    </div>
  );
};
