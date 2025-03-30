// components/CapsuleStatus.jsx
"use client"

import React, { useState, useEffect } from 'react';
import { getTimeRemaining, formatTimeRemaining, formatDate } from '../utils/formatters';

const CapsuleStatus = ({ unlockTime, isOwner = false }) => {
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isUnlocked: false
  });
  const [timerActive, setTimerActive] = useState(true);

  useEffect(() => {
    if (!unlockTime) {
      setTimerActive(false);
      return;
    }

    const updateTimer = () => {
      const remaining = getTimeRemaining(unlockTime);
      setTimeRemaining(remaining);
      
      if (remaining.isUnlocked) {
        setTimerActive(false);
      }
    };

    // Initial update
    updateTimer();

    // Setup interval to update every second
    const intervalId = setInterval(updateTimer, 1000);

    // Cleanup on unmount
    return () => clearInterval(intervalId);
  }, [unlockTime]);

  const getStatusColor = () => {
    if (timeRemaining.isUnlocked) {
      return 'text-green-600 bg-green-100 border-green-200';
    }
    
    if (timeRemaining.days < 1) {
      return 'text-yellow-600 bg-yellow-100 border-yellow-200';
    }
    
    return 'text-blue-600 bg-blue-100 border-blue-200';
  };

  const getStatusText = () => {
    if (timeRemaining.isUnlocked) {
      return isOwner ? 'Unlocked - Ready to access' : 'Unlocked';
    }
    
    return `Unlocks in: ${formatTimeRemaining(timeRemaining)}`;
  };

  if (!unlockTime) {
    return null;
  }

  return (
    <div className={`rounded-md px-4 py-3 border ${getStatusColor()} mb-4`}>
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-medium">{getStatusText()}</h3>
          <p className="text-sm opacity-75">
            {timeRemaining.isUnlocked 
              ? 'Unlocked on:' 
              : 'Will unlock on:'} {formatDate(unlockTime)}
          </p>
        </div>
        {timerActive && (
          <div className="text-3xl font-mono">
            {String(timeRemaining.days).padStart(2, '0')}:
            {String(timeRemaining.hours).padStart(2, '0')}:
            {String(timeRemaining.minutes).padStart(2, '0')}:
            {String(timeRemaining.seconds).padStart(2, '0')}
          </div>
        )}
      </div>
    </div>
  );
};

export default CapsuleStatus;