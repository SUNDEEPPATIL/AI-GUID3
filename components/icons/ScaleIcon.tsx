import React from 'react';

const ScaleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m16 16-4-4 4-4" />
    <path d="m8 8 4 4-4 4" />
    <path d="M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20Z" />
  </svg>
);

export default ScaleIcon;