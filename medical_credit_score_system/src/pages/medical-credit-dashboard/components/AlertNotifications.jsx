import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AlertNotifications = ({ alerts = [] }) => {
  const getAlertStyle = (type) => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-success/10',
          border: 'border-success/30',
          icon: 'CheckCircle',
          iconColor: 'var(--color-success)',
          textColor: 'text-success'
        };
      case 'warning':
        return {
          bg: 'bg-warning/10',
          border: 'border-warning/30',
          icon: 'AlertTriangle',
          iconColor: 'var(--color-warning)',
          textColor: 'text-warning'
        };
      case 'error':
        return {
          bg: 'bg-error/10',
          border: 'border-error/30',
          icon: 'AlertCircle',
          iconColor: 'var(--color-error)',
          textColor: 'text-error'
        };
      default:
        return {
          bg: 'bg-primary/10',
          border: 'border-primary/30',
          icon: 'Info',
          iconColor: 'var(--color-primary)',
          textColor: 'text-primary'
        };
    }
  };

  if (alerts?.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3 md:space-y-4">
      {alerts?.map((alert, index) => {
        const style = getAlertStyle(alert?.type);
        
        return (
          <div
            key={index}
            className={`${style?.bg} border ${style?.border} rounded-lg p-4 md:p-5 transition-smooth`}
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-0.5">
                <Icon name={style?.icon} size={20} color={style?.iconColor} />
              </div>
              
              <div className="flex-1 min-w-0">
                <h5 className={`text-sm md:text-base font-heading font-semibold ${style?.textColor} mb-1`}>
                  {alert?.title}
                </h5>
                <p className="text-sm text-foreground/80 mb-3">
                  {alert?.message}
                </p>
                
                {alert?.action && (
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="ArrowRight"
                    iconPosition="right"
                    iconSize={14}
                    onClick={alert?.action?.onClick}
                    className={`${style?.textColor} border-current hover:bg-current/10`}
                  >
                    {alert?.action?.label}
                  </Button>
                )}
              </div>

              <button
                className="flex-shrink-0 p-1 rounded-md hover:bg-foreground/5 transition-smooth"
                aria-label="Dismiss notification"
              >
                <Icon name="X" size={16} color="var(--color-muted-foreground)" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AlertNotifications;
