// components/ui/Card.jsx
"use client"

import React from 'react';

const Card = ({ 
  children, 
  title = '', 
  subtitle = '',
  className = '',
  titleClassName = '',
  bodyClassName = '',
  footer = null,
  footerClassName = '',
  ...props 
}) => {
  return (
    <div 
      className={`bg-white shadow rounded-lg overflow-hidden ${className}`}
      {...props}
    >
      {(title || subtitle) && (
        <div className={`px-4 py-5 sm:px-6 ${titleClassName}`}>
          {title && <h3 className="text-lg font-medium leading-6 text-gray-900">{title}</h3>}
          {subtitle && <p className="mt-1 max-w-2xl text-sm text-gray-500">{subtitle}</p>}
        </div>
      )}
      <div className={`px-4 py-5 sm:p-6 ${bodyClassName}`}>
        {children}
      </div>
      {footer && (
        <div className={`px-4 py-4 sm:px-6 bg-gray-50 ${footerClassName}`}>
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;