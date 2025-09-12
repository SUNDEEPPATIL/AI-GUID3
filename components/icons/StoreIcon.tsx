import React from 'react';

const StoreIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22a2 2 0 0 0 2-2h-4a2 2 0 0 0 2 2z" />
    <path d="M20 13.5V8a2 2 0 0 0-2-2h-3.14a2 2 0 0 1-1.79-1.09L12 3l-1.07 1.91A2 2 0 0 1 9.14 6H6a2 2 0 0 0-2 2v5.5" />
    <path d="M4 13.5h16" />
    <path d="M16 18a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-4.5h8v4.5z" />
  </svg>
);

export default StoreIcon;