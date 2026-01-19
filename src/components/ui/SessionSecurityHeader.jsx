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

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-300 bg-card border-b border-border shadow-elevation-1">
        <div className="mx-auto px-6">
          <div className="flex items-center justify-between h-12">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Icon name="Shield" size={16} color="var(--color-success)" />
                <span className="text-sm font-caption text-muted-foreground">
                  Secure Connection
                </span>
              </div>
              
              <div className="hidden md:flex items-center space-x-2">
                <Icon name="Lock" size={16} color="var(--color-primary)" />
                <span className="text-sm font-caption text-muted-foreground">
                  256-bit Encryption
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Icon 
                  name="Clock" 
                  size={16} 
                  color={timeRemaining <= 300000 ? 'var(--color-error)' : 'var(--color-muted-foreground)'}
                />
                <span className={`text-sm font-mono font-medium ${getStatusColor()}`}>
                  {formatTime(timeRemaining)}
                </span>
              </div>

              <Button
                variant="ghost"
                size="sm"
                iconName="LogOut"
                iconSize={16}
                onClick={onLogout}
                className="text-muted-foreground hover:text-foreground"
              >
                <span className="hidden md:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {showWarning && (
        <div className="fixed top-12 left-0 right-0 z-300 bg-warning text-warning-foreground">
          <div className="mx-auto px-6">
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center space-x-3">
                <Icon name="AlertTriangle" size={20} color="currentColor" />
                <span className="text-sm font-caption font-medium">
                  Your session will expire in {formatTime(timeRemaining)}. Please save your work.
                </span>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleExtendSession}
                className="bg-warning-foreground text-warning hover:bg-warning-foreground/90"
              >
                Extend Session
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className={showWarning ? 'h-24' : 'h-12'} />
    </>
  );
};

export default SessionSecurityHeader;