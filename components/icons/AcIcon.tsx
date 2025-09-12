import React from 'react';

const AcIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 18H3a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-9Z" />
    <path d="M6 15h1" />
    <path d="M9 15h1" />
    <path d="M12 15h1" />
  </svg>
);

export default AcIcon;
