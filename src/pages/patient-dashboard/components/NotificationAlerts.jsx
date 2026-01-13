import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const NotificationAlerts = ({ alerts }) => {
  const [dismissedAlerts, setDismissedAlerts] = useState([]);

  const handleDismiss = (alertId) => {
    setDismissedAlerts([...dismissedAlerts, alertId]);
  };

  const visibleAlerts = alerts?.filter(alert => !dismissedAlerts?.includes(alert?.id));

  const getAlertStyle = (type) => {
    const styles = {
      error: {
        bg: 'bg-error/10 border-error/20',
        icon: 'AlertCircle',
        iconColor: 'text-error',
        textColor: 'text-error'
      },
      warning: {
        bg: 'bg-warning/10 border-warning/20',
        icon: 'AlertTriangle',
        iconColor: 'text-warning',
        textColor: 'text-warning'
      },
      info: {
        bg: 'bg-primary/10 border-primary/20',
        icon: 'Info',
        iconColor: 'text-primary',
        textColor: 'text-primary'
      },
      success: {
        bg: 'bg-success/10 border-success/20',
        icon: 'CheckCircle',
        iconColor: 'text-success',
        textColor: 'text-success'
      }
    };
    return styles?.[type] || styles?.info;
  };

  if (visibleAlerts?.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {visibleAlerts?.map((alert) => {
        const style = getAlertStyle(alert?.type);
        return (
          <div
            key={alert?.id}
            className={`${style?.bg} border-2 rounded-xl p-4 md:p-6 transition-all duration-250`}
          >
            <div className="flex items-start gap-4">
              <div className={`flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-lg ${style?.bg} flex items-center justify-center`}>
                <Icon name={style?.icon} size={24} className={style?.iconColor} />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className={`text-sm md:text-base font-semibold ${style?.textColor} mb-1`}>
                  {alert?.title}
                </h3>
                <p className="text-sm text-foreground mb-3">
                  {alert?.message}
                </p>

                {alert?.actions && alert?.actions?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {alert?.actions?.map((action, index) => (
                      <Button
                        key={index}
                        variant={action?.primary ? 'default' : 'outline'}
                        size="sm"
                        onClick={action?.onClick}
                      >
                        {action?.label}
                      </Button>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={() => handleDismiss(alert?.id)}
                className="flex-shrink-0 w-8 h-8 rounded-lg hover:bg-muted transition-colors duration-250 flex items-center justify-center"
                aria-label="Dismiss alert"
              >
                <Icon name="X" size={18} className="text-muted-foreground" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default NotificationAlerts;