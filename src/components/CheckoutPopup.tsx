import React, { useState, useCallback } from 'react';
import { X, Minus, Plus, Clock } from 'lucide-react';
import { CartState } from '../types';

interface CheckoutPopupProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartState;
}

export const CheckoutPopup: React.FC<CheckoutPopupProps> = ({ isOpen, onClose, cart }) => {
  const [hourlyValue, setHourlyValue] = useState(500);

  const decreaseValue = useCallback(() => {
    setHourlyValue(prev => prev > 50 ? prev - 10 : prev);
  }, []);

  const increaseValue = useCallback(() => {
    setHourlyValue(prev => prev + 10);
  }, []);

  if (!isOpen) return null;

  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours === 0) return `${mins} mins`;
    if (mins === 0) return `${hours} ${hours === 1 ? 'Hour' : 'Hours'}`;
    return `${hours} ${hours === 1 ? 'Hour' : 'Hours'} ${mins} mins`;
  };

  const totalTasks = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  const monthlyHours = Math.round((cart.totalTimeInMinutes / 60) * 3);
  const totalMonthlySavings = monthlyHours * hourlyValue;
  const membershipCost = 2000;

  const handleCheckout = () => {
    const taskList = cart.items.map(item =>
      `• ${item.task.title} (${formatTime(item.task.timeInMinutes)}${item.quantity > 1 ? ` x ${item.quantity}` : ''})`
    ).join('\n');

    const emailBody = `Hi,

I'd like to delegate the following tasks:

${taskList}

Total time I'll save: ${formatTime(cart.totalTimeInMinutes)}
My time value: ₹${hourlyValue}/hour
Estimated monthly savings: ₹${totalMonthlySavings.toLocaleString()}

Please get started with my faff membership.

Thanks!`;

    const mailtoLink = `mailto:concierge@fountane.com?subject=New Faff Membership Request&body=${encodeURIComponent(emailBody)}`;
    window.open(mailtoLink, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4 animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full my-4 p-4 sm:p-6 relative border border-green-100 transform animate-fade-in-up max-h-[95vh] overflow-y-auto">
        {/* Subtle background elements */}
        <div className="absolute inset-0 rounded-2xl opacity-3 pointer-events-none">
          <div className="absolute top-4 right-4 w-16 h-16 bg-green-200 rounded-full blur-2xl"></div>
          <div className="absolute bottom-4 left-4 w-12 h-12 bg-emerald-100 rounded-full blur-xl"></div>
        </div>

        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-[#145C48] transition-all duration-300 hover:scale-110 z-20 w-7 h-7 rounded-full hover:bg-green-50 flex items-center justify-center"
        >
          <X size={18} />
        </button>

        <div className="text-center mb-4 sm:mb-6 relative z-10">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-white to-green-50 border-2 border-green-200 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-md">
            <Clock className="w-6 h-6 sm:w-7 sm:h-7 text-[#145C48]" />
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 leading-tight">
            You're saving
          </h2>

          <div className="bg-gradient-to-r from-[#145C48] via-green-600 to-emerald-600 bg-clip-text text-transparent">
            <p className="text-2xl sm:text-3xl font-extrabold mb-1">
              {formatTime(cart.totalTimeInMinutes)}
            </p>
          </div>

          <p className="text-gray-500 text-sm sm:text-base">
            with {totalTasks} task{totalTasks !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 rounded-xl p-3 sm:p-4 mb-4 shadow-inner">
          <p className="text-gray-600 mb-2 text-center font-medium text-sm">
            Get 100+ more tasks completed and save:
          </p>

          <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-[#145C48] to-emerald-600 bg-clip-text text-transparent text-center">
            {monthlyHours} Hours / month
          </p>
        </div>

        <div className="mb-4 sm:mb-5 relative z-20">
          <label className="block text-gray-700 font-semibold mb-3 text-center text-sm sm:text-base">
            What's your time worth per hour?
          </label>
          <div className="flex items-center justify-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={decreaseValue}
              className="relative z-30 w-9 h-9 sm:w-10 sm:h-10 bg-white border-2 border-green-200 hover:border-[#145C48] hover:bg-green-50 rounded-xl flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-lg hover:scale-110 active:scale-95 cursor-pointer"
            >
              <Minus size={16} className="text-gray-600 pointer-events-none" />
            </button>
            <div className="bg-gradient-to-br from-white to-green-50 border-2 border-[#145C48] rounded-xl px-4 py-2 sm:px-5 sm:py-3 min-w-[100px] sm:min-w-[120px] shadow-lg relative z-20">
              <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-[#145C48] to-emerald-600 bg-clip-text text-transparent">
                ₹{hourlyValue}
              </span>
            </div>
            <button
              type="button"
              onClick={increaseValue}
              className="relative z-30 w-9 h-9 sm:w-10 sm:h-10 bg-white border-2 border-green-200 hover:border-[#145C48] hover:bg-green-50 rounded-xl flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-lg hover:scale-110 active:scale-95 cursor-pointer"
            >
              <Plus size={16} className="text-gray-600 pointer-events-none" />
            </button>
          </div>
        </div>

        <div className="text-center mb-4 sm:mb-5">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-3 sm:p-4 shadow-lg">
            <p className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-1">
              ₹{totalMonthlySavings.toLocaleString()}/month
            </p>
            <p className="text-green-700 font-medium text-sm">Total time savings value</p>
          </div>
        </div>

        <button
          onClick={handleCheckout}
          className="w-full bg-gradient-to-r from-[#145C48] via-green-600 to-emerald-600 text-white font-bold py-3 px-6 rounded-xl hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 shadow-lg border border-green-300/20"
        >
          <div className="flex items-center justify-center text-base sm:text-lg">
            Start my faff membership
          </div>
          <div className="text-xs sm:text-sm opacity-95 mt-1 font-medium">
            Only ₹{membershipCost.toLocaleString()}/month
          </div>
        </button>
      </div>
    </div>
  );
};
