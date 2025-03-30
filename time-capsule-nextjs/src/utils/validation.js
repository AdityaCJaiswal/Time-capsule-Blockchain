// utils/validation.js

import { getWeb3 } from './web3';

/**
 * Validate an Ethereum address
 * @param {string} address - The Ethereum address to validate
 * @returns {boolean} True if the address is valid
 */
export const isValidAddress = (address) => {
  try {
    const web3 = getWeb3();
    return web3.utils.isAddress(address);
  } catch (error) {
    console.error('Error validating address:', error);
    return false;
  }
};

/**
 * Validate a date is in the future
 * @param {string} dateString - ISO date string to validate
 * @returns {boolean} True if the date is in the future
 */
export const isDateInFuture = (dateString) => {
  if (!dateString) return false;
  
  const selectedDate = new Date(dateString);
  const now = new Date();
  
  // Add a small buffer (1 minute) to account for form submission time
  now.setMinutes(now.getMinutes() + 1);
  
  return selectedDate > now;
};

/**
 * Validate a file meets size and type requirements
 * @param {File} file - The file to validate
 * @param {number} maxSize - Maximum file size in bytes
 * @param {string} acceptedTypes - Comma-separated list of accepted MIME types
 * @returns {object} Object with isValid boolean and error message
 */
export const validateFile = (file, maxSize = 100 * 1024 * 1024, acceptedTypes = '*') => {
  if (!file) {
    return { isValid: false, error: 'No file provided' };
  }
  
  // Check file size
  if (file.size > maxSize) {
    return { 
      isValid: false, 
      error: `File size exceeds the limit of ${Math.floor(maxSize / (1024 * 1024))} MB` 
    };
  }
  
  // Check file type if specific types are required
  if (acceptedTypes !== '*') {
    const types = acceptedTypes.split(',').map(type => type.trim());
    const fileType = file.type;
    
    if (!types.some(type => fileType.match(new RegExp(type.replace('*', '.*'))))) {
      return { 
        isValid: false, 
        error: `Invalid file type. Accepted types: ${acceptedTypes}` 
      };
    }
  }
  
  return { isValid: true, error: '' };
};

/**
 * Validate capsule creation input
 * @param {object} data - Capsule data
 * @returns {object} Object with isValid boolean and errors object
 */
export const validateCapsuleInput = (data) => {
  const errors = {};
  
  // Check if either message or file is provided
  if ((!data.message || data.message.trim() === '') && !data.file) {
    errors.content = 'Please provide a message or upload a file';
  }
  
  // Validate unlock time
  if (!data.unlockTime) {
    errors.unlockTime = 'Please select an unlock time';
  } else if (!isDateInFuture(data.unlockTime)) {
    errors.unlockTime = 'Unlock time must be in the future';
  }
  
  // Validate recipient if provided
  if (data.recipient && !isValidAddress(data.recipient)) {
    errors.recipient = 'Please enter a valid Ethereum address';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validate connection to the correct network
 * @param {number} expectedNetworkId - The expected network ID
 * @returns {Promise<boolean>} True if connected to the correct network
 */
export const validateNetwork = async (expectedNetworkId) => {
  try {
    const web3 = getWeb3();
    const networkId = await web3.eth.net.getId();
    return networkId === expectedNetworkId;
  } catch (error) {
    console.error('Error validating network:', error);
    return false;
  }
};