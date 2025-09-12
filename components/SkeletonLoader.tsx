import React from 'react';

const SkeletonLoader: React.FC = () => {
  return (
    <div className="relative bg-gray-800 rounded-xl border border-gray-700/50 overflow-hidden flex flex-col">
      <div className="p-5 flex-grow">
        {/* Brand & Model Name */}
        <div className="h-5 bg-gray-700 rounded w-1/3 mb-2"></div>
        <div className="h-4 bg-gray-700 rounded w-1/2 mb-4"></div>
        
        {/* Rating */}
        <div className="h-4 bg-gray-700 rounded w-1/4 mb-4"></div>

        {/* Summary */}
        <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-700 rounded w-5/6 mb-4"></div>
        
        {/* Specs */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-700 rounded w-3/4"></div>
          <div className="h-4 bg-gray-700 rounded w-2/3"></div>
        </div>
      </div>
      
      <div className="p-4 bg-gray-800/50 border-t border-gray-700/50 mt-auto flex items-center gap-2">
        <div className="h-10 bg-gray-700 rounded-lg flex-1"></div>
        <div className="h-10 w-10 bg-gray-700 rounded-lg"></div>
        <div className="h-10 w-10 bg-gray-700 rounded-lg"></div>
        <div className="h-10 w-10 bg-gray-700 rounded-lg"></div>
      </div>
      
      {/* Shimmer effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]"></div>
    </div>
  );
};

export default SkeletonLoader;