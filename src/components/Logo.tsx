import React from 'react';

export const KaiLogo = ({ className = "w-12 h-12" }: { className?: string }) => (
  <img 
    src="https://i.imgur.com/uUK95Si.png" 
    alt="K.A.I Dental Clinic Logo" 
    className={`${className} object-contain`}
    referrerPolicy="no-referrer"
  />
);
