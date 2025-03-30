// components/FileUpload.jsx
"use client"

import React, { useRef, useState } from 'react';
import { formatFileSize, getFileType } from '../utils/formatters';
import Button from './ui/Button';

const FileUpload = ({ onFileChange, acceptedTypes = '*', maxSize = 100 * 1024 * 1024 }) => {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const inputRef = useRef(null);
  
  const validateFile = (file) => {
    // Check file size
    if (file.size > maxSize) {
      setError(`File size exceeds the limit of ${formatFileSize(maxSize)}`);
      return false;
    }
    
    // Check file type if specific types are required
    if (acceptedTypes !== '*') {
      const types = acceptedTypes.split(',').map(type => type.trim());
      const fileType = file.type;
      
      if (!types.some(type => fileType.match(new RegExp(type.replace('*', '.*'))))) {
        setError(`Invalid file type. Accepted types: ${acceptedTypes}`);
        return false;
      }
    }
    
    setError('');
    return true;
  };
  
  const handleFile = (file) => {
    if (validateFile(file)) {
      setSelectedFile(file);
      onFileChange(file);
    } else {
      setSelectedFile(null);
      onFileChange(null);
    }
  };
  
  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };
  
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };
  
  const handleClick = () => {
    inputRef.current.click();
  };
  
  const removeFile = () => {
    setSelectedFile(null);
    onFileChange(null);
    // Reset the input value to allow selecting the same file again
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };
  
  return (
    <div className="mt-1">
      <div 
        className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md ${
          dragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
        } ${error ? 'border-red-300' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={selectedFile ? undefined : handleClick}
      >
        {!selectedFile ? (
          <div className="space-y-1 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="flex text-sm text-gray-600">
              <label
                htmlFor="file-upload"
                className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
              >
                <span>Upload a file</span>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only"
                  ref={inputRef}
                  onChange={handleChange}
                  accept={acceptedTypes}
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500">
              {acceptedTypes === '*' ? 'Any file type' : acceptedTypes.replace(/\*/g, '')} up to {formatFileSize(maxSize)}
            </p>
          </div>
        ) : (
          <div className="w-full">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-8 w-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900 truncate" title={selectedFile.name}>
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {getFileType(selectedFile)} · {formatFileSize(selectedFile.size)}
                  </p>
                </div>
              </div>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile();
                }}
                variant="danger"
                size="small"
              >
                Remove
              </Button>
            </div>
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default FileUpload;