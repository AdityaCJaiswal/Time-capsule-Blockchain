// components/ui/Textarea.jsx
"use client"

import React from 'react';

const Textarea = ({ 
  label, 
  id, 
  placeholder = '', 
  value, 
  onChange, 
  error = '', 
  rows = 4,
  fullWidth = true,
  required = false,
  disabled = false,
  className = '',
  ...props 
}) => {
  const baseStyles = 'block w-full border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm';
  const errorStyles = error ? 'border-red-300' : 'border-gray-300';
  const disabledStyles = disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : '';
  const widthClass = fullWidth ? 'w-full' : '';
  
  return (
    <div className={widthClass}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <textarea
        id={id}
        className={`${baseStyles} ${errorStyles} ${disabledStyles} ${className}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        rows={rows}
        disabled={disabled}
        required={required}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default Textarea;