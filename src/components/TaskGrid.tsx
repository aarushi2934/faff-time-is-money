import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { Task } from '../types';

interface TaskGridProps {
  tasks: Task[];
  onAddToCart: (task: Task) => void;
  cartItems: string[]; // Array of task IDs that are in cart
}

export const TaskGrid: React.FC<TaskGridProps> = ({ tasks, onAddToCart, cartItems }) => {
  return (
    <div className="bg-gradient-to-br from-[#F6F8F5] via-white/50 to-[#F6F8F5] py-4 md:py-16 px-3 sm:px-4 pb-24 md:pb-32 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#145C48] rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 right-20 w-40 h-40 bg-blue-300 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-green-200 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      <div className="w-full relative z-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
          {tasks.map((task, index) => (
            <div
              key={task.id}
              className={`bg-white/90 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col group animate-fade-in-up ${cartItems.includes(task.id)
                ? 'ring-2 ring-[#145C48] ring-opacity-70 shadow-[#145C48]/20'
                : 'hover:ring-1 hover:ring-gray-200'
                } ${task.isPopular
                  ? 'border-2 border-[#145C48]/30 shadow-[#145C48]/10'
                  : ''
                }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Square Image Section */}
              <div className="relative overflow-hidden aspect-square">
                <img
                  src={task.image}
                  alt={task.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/* Image overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Popular badge for popular tasks */}
                {task.isPopular && (
                  <div className="absolute top-2 left-2 bg-[#145C48] text-white text-xs px-2 py-1 rounded-full font-semibold animate-shimmer">
                    Popular
                  </div>
                )}
              </div>

              {/* Content Section */}
              <div className="p-3 sm:p-4 lg:p-5 flex-1 flex flex-col justify-between bg-gradient-to-br from-white to-gray-50/50">
                {/* Task Name */}
                <h3 className="text-xs sm:text-sm lg:text-base font-bold text-gray-800 mb-3 sm:mb-4 line-clamp-2 leading-tight group-hover:text-[#145C48] transition-colors duration-300">
                  {task.title}
                </h3>

                {/* Time and Button Row */}
                <div className="flex items-center justify-between gap-2 sm:gap-4">
                  <span className="text-[#145C48] font-semibold text-xs sm:text-sm flex-shrink-0 bg-[#145C48]/10 px-2 sm:px-3 py-1 rounded-full">
                    {task.timeInMinutes < 60
                      ? (() => {
                        const hours = (task.timeInMinutes / 60).toFixed(1);
                        return `${hours} ${parseFloat(hours) === 1 ? 'Hour' : 'Hours'}`;
                      })()
                      : (() => {
                        const hours = Math.round(task.timeInMinutes / 60);
                        return `${hours} ${hours === 1 ? 'Hour' : 'Hours'}`;
                      })()
                    }
                  </span>

                  {/* Add to Cart Button */}
                  {cartItems.includes(task.id) ? (
                    <button
                      onClick={() => onAddToCart(task)}
                      className="bg-gradient-to-r from-green-100 to-green-200 text-[#145C48] font-bold py-1.5 md:py-2 px-2 md:px-3 rounded-lg flex items-center justify-center gap-1 text-xs cursor-default flex-shrink-0 shadow-inner"
                    >
                      <ShoppingCart size={14} className="md:w-4 md:h-4 flex-shrink-0" />
                      <span className="hidden lg:inline whitespace-nowrap">ADDED</span>
                      <span className="hidden sm:inline lg:hidden whitespace-nowrap">✓</span>
                      <span className="sm:hidden">✓</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => onAddToCart(task)}
                      className={`bg-gradient-to-r from-[#145C48] to-[#0f4a3a] text-white font-bold py-1.5 md:py-2 px-2 md:px-3 rounded-lg hover:from-[#0f4a3a] hover:to-[#145C48] transition-all duration-300 flex items-center justify-center gap-1 text-xs flex-shrink-0 hover:shadow-lg hover:scale-105 ${task.isPopular ? 'border-[0.4px] border-[#145C48]/30 animate-shimmer shadow-[#145C48]/30' : 'shadow-md'
                        }`}
                    >
                      <ShoppingCart size={14} className="md:w-4 md:h-4 flex-shrink-0" />
                      <span className="hidden lg:inline whitespace-nowrap">ADD TO CART</span>
                      <span className="hidden sm:inline lg:hidden whitespace-nowrap">CART</span>
                      <span className="sm:hidden">+</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
