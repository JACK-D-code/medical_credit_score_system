import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SessionWarning = ({ show, onExtend, onLogout }) => {
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    if (show && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            if (onLogout) onLogout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [show, countdown, onLogout]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-500 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="bg-card rounded-xl shadow-elevation-5 border border-border max-w-md w-full mx-4 p-6 md:p-8 spring-bounce">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Clock" size={32} color="var(--color-warning)" />
          </div>
          <h3 className="text-xl font-heading font-semibold text-foreground mb-2">
            Session Timeout Warning
          </h3>
          <p className="text-sm text-muted-foreground">
            Your session will expire in {countdown} seconds due to inactivity
          </p>
        </div>

        <div className="bg-warning/10 border border-warning/20 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-3">
            <Icon name="AlertTriangle" size={20} color="var(--color-warning)" className="flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-warning-foreground mb-1">
                Security Notice
              </p>
              <p className="text-xs text-warning-foreground/80">
                For your security, we automatically log you out after periods of inactivity
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Button
            variant="default"
            size="lg"
            fullWidth
            iconName="RefreshCw"
            iconPosition="left"
            iconSize={20}
            onClick={onExtend}
          >
            Continue Session
          </Button>

          <Button
            variant="outline"
            size="lg"
            fullWidth
            iconName="LogOut"
            iconPosition="left"
            iconSize={20}
            onClick={onLogout}
          >
            Logout Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SessionWarning;