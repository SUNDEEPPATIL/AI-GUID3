import React from 'react';

const CromaIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <circle cx="12" cy="12" r="10" fill="#FF5C00"/>
    <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 110-16 8 8 0 010 16z" fill="#FFF"/>
    <path d="M15.41 8.59L14 10.01l-4 4-1.41-1.42L12.59 10l-4-4 1.41-1.41L14 8.59l4 4-1.41 1.42-1.18-1.18z" fill="#FFF"/>
  </svg>
);

export default CromaIcon;