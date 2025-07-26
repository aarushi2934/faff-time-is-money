import React from 'react';
import { categoryFilters } from '../data/taskService';

// Updated status filters to match new priority matrix  
const statusFilters = ['Single', 'Parents', 'Couple'];

interface FiltersProps {
  selectedStatus: string[];
  selectedCategories: string[];
  onStatusChange: (status: string) => void;
  onCategoryChange: (category: string) => void;
}

export const Filters: React.FC<FiltersProps> = ({
  selectedStatus,
  selectedCategories,
  onStatusChange,
  onCategoryChange
}) => {
  return (
    <div className="bg-gradient-to-r from-[#F6F8F5] via-white/30 to-[#F6F8F5] py-3 sm:py-4 px-3 sm:px-4 md:py-5 relative">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-2 right-10 w-16 h-16 bg-[#145C48] rounded-full blur-2xl"></div>
        <div className="absolute bottom-2 left-20 w-20 h-20 bg-blue-200 rounded-full blur-2xl"></div>
      </div>

      <div className="w-full relative z-10">
        <div className="bg-glass backdrop-blur-sm rounded-xl shadow-lg p-3 sm:p-4 border border-white/20 animate-fade-in-up">
          {/* Status Filters */}
          <div className="mb-4 sm:mb-5">
            <h3 className="text-lg sm:text-xl font-bold text-[#145C48] mb-2 sm:mb-3 bg-gradient-text bg-clip-text">Status</h3>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {statusFilters.map((status, index) => (
                <button
                  key={status}
                  onClick={() => onStatusChange(status)}
                  className={`px-3 py-2 sm:px-4 sm:py-2.5 md:px-5 md:py-3 rounded-full font-bold text-xs sm:text-sm md:text-base transition-all duration-300 transform hover:scale-105 animate-fade-in-up ${selectedStatus.includes(status)
                    ? 'bg-gradient-to-r from-[#145C48] to-[#0f4a3a] text-white shadow-lg ring-2 ring-[#145C48]/30'
                    : 'bg-gradient-to-r from-[#a8d5ba] to-[#90c5a4] text-[#145C48] shadow-md hover:shadow-lg hover:-translate-y-1 hover:from-[#90c5a4] hover:to-[#a8d5ba]'
                    } whitespace-nowrap backdrop-blur-sm min-h-[32px] sm:min-h-[36px] md:min-h-[40px]`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filters */}
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-[#145C48] mb-2 sm:mb-3 bg-gradient-text bg-clip-text">Categories</h3>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {categoryFilters.map((category, index) => (
                <button
                  key={category}
                  onClick={() => onCategoryChange(category)}
                  className={`px-3 py-2 sm:px-4 sm:py-2.5 md:px-5 md:py-3 rounded-full font-bold text-xs sm:text-sm md:text-base transition-all duration-300 transform hover:scale-105 animate-fade-in-up ${selectedCategories.includes(category)
                    ? 'bg-gradient-to-r from-[#145C48] to-[#0f4a3a] text-white shadow-lg ring-2 ring-[#145C48]/30'
                    : 'bg-gradient-to-r from-[#a8d5ba] to-[#90c5a4] text-[#145C48] shadow-md hover:shadow-lg hover:-translate-y-1 hover:from-[#90c5a4] hover:to-[#a8d5ba]'
                    } whitespace-nowrap backdrop-blur-sm min-h-[32px] sm:min-h-[36px] md:min-h-[40px]`}
                  style={{ animationDelay: `${(statusFilters.length + index) * 100}ms` }}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
