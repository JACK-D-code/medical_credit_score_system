import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const SessionSecurityHeader = ({ sessionTimeout = 1800000, onLogout }) => {
  const [timeRemaining, setTimeRemaining] = useState(sessionTimeout);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        const newTime = prev - 1000;
        
        if (newTime <= 300000 && !showWarning) {
          setShowWarning(true);
        }
        
        if (newTime <= 0) {
          clearInterval(interval);
          if (onLogout) onLogout();
          return 0;
        }
        
        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [showWarning, onLogout]);

  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds?.toString()?.padStart(2, '0')}`;
  };

  const handleExtendSession = () => {
    setTimeRemaining(sessionTimeout);
    setShowWarning(false);
  };

  const getStatusColor = () => {
    if (timeRemaining <= 300000) return 'text-error';
    if (timeRemaining <= 600000) return 'text-warning';
    return 'text-success';
  };

  return null;
};

export default SessionSecurityHeader;