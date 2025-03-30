// utils/formatters.js

/**
 * Format an Ethereum address for display
 * @param {string} address - The Ethereum address to format
 * @param {number} first - Number of characters to show at the start
 * @param {number} last - Number of characters to show at the end
 * @returns {string} Formatted address
 */
export const formatAddress = (address, first = 6, last = 4) => {
    if (!address) return '';
    if (address.length < first + last + 3) return address;
    return `${address.slice(0, first)}...${address.slice(-last)}`;
  };
  
  /**
   * Format a file size in bytes to a human-readable format
   * @param {number} bytes - File size in bytes
   * @param {number} decimals - Number of decimal places to show
   * @returns {string} Formatted file size
   */
  export const formatFileSize = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
  
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  
    const i = Math.floor(Math.log(bytes) / Math.log(k));
  
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };
  
  /**
   * Get a human-readable file type from a file object
   * @param {File} file - The file object
   * @returns {string} Human-readable file type
   */
  export const getFileType = (file) => {
    if (!file) return '';
    
    // Get file extension
    const extension = file.name.split('.').pop().toLowerCase();
    
    // Map of common file extensions to human-readable types
    const typeMap = {
      // Documents
      pdf: 'PDF Document',
      doc: 'Word Document',
      docx: 'Word Document',
      xls: 'Excel Spreadsheet',
      xlsx: 'Excel Spreadsheet',
      ppt: 'PowerPoint Presentation',
      pptx: 'PowerPoint Presentation',
      txt: 'Text Document',
      
      // Images
      jpg: 'JPEG Image',
      jpeg: 'JPEG Image',
      png: 'PNG Image',
      gif: 'GIF Image',
      svg: 'SVG Image',
      webp: 'WebP Image',
      
      // Audio
      mp3: 'MP3 Audio',
      wav: 'WAV Audio',
      ogg: 'OGG Audio',
      
      // Video
      mp4: 'MP4 Video',
      webm: 'WebM Video',
      avi: 'AVI Video',
      
      // Archives
      zip: 'ZIP Archive',
      rar: 'RAR Archive',
      tar: 'TAR Archive',
      
      // Other
      json: 'JSON File',
      xml: 'XML File',
      html: 'HTML File',
      css: 'CSS File',
      js: 'JavaScript File',
    };
    
    // Return mapped type or fallback to MIME type
    return typeMap[extension] || file.type || 'Unknown File Type';
  };
  
  /**
   * Format a Unix timestamp to a human-readable date
   * @param {number} timestamp - Unix timestamp
   * @returns {string} Formatted date string
   */
  export const formatDate = (timestamp) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp * 1000);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    }).format(date);
  };
  
  /**
   * Calculate time remaining from current time to a Unix timestamp
   * @param {number} unlockTime - Unix timestamp when the capsule unlocks
   * @returns {object} Object containing time remaining in various units
   */
  export const getTimeRemaining = (unlockTime) => {
    const total = unlockTime * 1000 - Date.now();
    
    // If already unlocked
    if (total <= 0) {
      return {
        total: 0,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isUnlocked: true
      };
    }
    
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const days = Math.floor(total / (1000 * 60 * 60 * 24));
    
    return {
      total,
      days,
      hours,
      minutes,
      seconds,
      isUnlocked: false
    };
  };
  
  /**
   * Format the time remaining in a human-readable string
   * @param {object} timeRemaining - Object returned from getTimeRemaining()
   * @returns {string} Formatted time remaining
   */
  export const formatTimeRemaining = (timeRemaining) => {
    if (timeRemaining.isUnlocked) {
      return 'Unlocked';
    }
    
    const parts = [];
    
    if (timeRemaining.days > 0) {
      parts.push(`${timeRemaining.days} day${timeRemaining.days !== 1 ? 's' : ''}`);
    }
    
    if (timeRemaining.hours > 0) {
      parts.push(`${timeRemaining.hours} hour${timeRemaining.hours !== 1 ? 's' : ''}`);
    }
    
    if (timeRemaining.minutes > 0 && timeRemaining.days === 0) {
      parts.push(`${timeRemaining.minutes} minute${timeRemaining.minutes !== 1 ? 's' : ''}`);
    }
    
    if (timeRemaining.seconds > 0 && timeRemaining.days === 0 && timeRemaining.hours === 0) {
      parts.push(`${timeRemaining.seconds} second${timeRemaining.seconds !== 1 ? 's' : ''}`);
    }
    
    if (parts.length === 0) {
      return 'Less than a second';
    }
    
    if (parts.length === 1) {
      return parts[0];
    }
    
    if (parts.length === 2) {
      return `${parts[0]} and ${parts[1]}`;
    }
    
    return parts.join(', ');
  };