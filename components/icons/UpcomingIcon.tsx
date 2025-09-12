import React from 'react';

const UpcomingIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.3.05-3.18-.65-.87-2.2-.86-3.15-.05Z" />
    <path d="m12 15-3-3a9 9 0 0 1 3-13v13a9 9 0 0 1-3-3Z" />
    <path d="M16.5 3.5c1.5 1.26 2 5 2 5s-3.74-.5-5-2c-.71-.84-.7-2.3-.05-3.18.65-.87 2.2-.86 3.15-.05Z" />
    <path d="m21 21-7-7" />
  </svg>
);

export default UpcomingIcon;
