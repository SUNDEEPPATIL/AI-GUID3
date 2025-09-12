import React from 'react';

const MedalIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="6" />
        <path d="M15.48 13.88a4 4 0 0 1-6.96 0" />
        <path d="M6 22l4-4 2 2 2-2 4 4" />
    </svg>
);

export default MedalIcon;
