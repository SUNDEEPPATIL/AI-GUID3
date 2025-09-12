import React, { ReactNode } from 'react';

interface TooltipProps {
  children: ReactNode;
  text: string;
}

const Tooltip: React.FC<TooltipProps> = ({ children, text }) => {
  return (
    <div className="relative group flex items-center">
      {children}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs bg-gray-900 text-white text-xs rounded py-1.5 px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-30 border border-gray-700 shadow-lg">
        {text}
        <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 border-r border-b border-gray-700 transform rotate-45"></div>
      </div>
    </div>
  );
};

export default Tooltip;
