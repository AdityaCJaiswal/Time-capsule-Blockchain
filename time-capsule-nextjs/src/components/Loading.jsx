// components/Loading.jsx
"use client"

import React from 'react';

const Loading = ({ size = 'medium', color = 'blue', text = 'Loading...' }) => {
  const sizes = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
  };
  
  const colors = {
    blue: 'text-blue-600',
    gray: 'text-gray-600',
    white: 'text-white',
  };
  
  return (
    <div className="flex flex-col items-center justify-center">
      <svg 
        className={`animate-spin ${sizes[size]} ${colors[color]}`} 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24"
      >
        <circle 
          className="opacity-25" 
          cx="12" 
          cy="12" 
          r="10" 
          stroke="currentColor" 
          strokeWidth="4"
        ></circle>
        <path 
          className="opacity-75" 
          fill="currentColor" 
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      {text && <p className={`mt-2 ${colors[color]}`}>{text}</p>}
    </div>
  );
};

export default Loading;