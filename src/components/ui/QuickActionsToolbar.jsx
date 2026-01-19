import React from 'react';
import { useLocation } from 'react-router-dom';
import Button from './Button';

const QuickActionsToolbar = ({ userRole = 'patient' }) => {
  const location = useLocation();

  const getContextualActions = () => {
    const currentPath = location?.pathname;

    if (currentPath === '/medical-credit-dashboard') {
      return [
        {
          label: 'Download Report',
          icon: 'Download',
          variant: 'outline',
          onClick: () => console.log('Download report')
        },
        {
          label: 'Request Certificate',
          icon: 'FileText',
          variant: 'default',
          onClick: () => console.log('Request certificate')
        }
      ];
    }

    if (currentPath === '/credit-score-details') {
      return [
        {
          label: 'Download Analysis',
          icon: 'Download',
          variant: 'outline',
          onClick: () => console.log('Download analysis')
        },
        {
          label: 'Improvement Tips',
          icon: 'Lightbulb',
          variant: 'default',
          onClick: () => console.log('Show tips')
        }
      ];
    }

    if (currentPath === '/billing-records') {
      return [
        {
          label: 'Export Records',
          icon: 'Download',
          variant: 'outline',
          onClick: () => console.log('Export records')
        },
        {
          label: 'Make Payment',
          icon: 'CreditCard',
          variant: 'default',
          onClick: () => console.log('Make payment')
        }
      ];
    }

    if (currentPath === '/profile-management') {
      return [
        {
          label: 'Verify Identity',
          icon: 'Shield',
          variant: 'outline',
          onClick: () => console.log('Verify identity')
        },
        {
          label: 'Update Profile',
          icon: 'Edit',
          variant: 'default',
          onClick: () => console.log('Update profile')
        }
      ];
    }

    return [];
  };

  const actions = getContextualActions();

  if (actions?.length === 0) {
    return null;
  }

  return (
    <div className="bg-card border-b border-border shadow-elevation-1">
      <div className="mx-auto px-6">
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-caption text-muted-foreground">Quick Actions:</span>
          </div>

          <div className="hidden md:flex items-center space-x-3">
            {actions?.map((action, index) => (
              <Button
                key={index}
                variant={action?.variant}
                size="sm"
                iconName={action?.icon}
                iconPosition="left"
                iconSize={16}
                onClick={action?.onClick}
              >
                {action?.label}
              </Button>
            ))}
          </div>

          <div className="md:hidden">
            <Button
              variant="outline"
              size="sm"
              iconName="MoreVertical"
              iconSize={20}
              onClick={() => console.log('Show mobile actions menu')}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActionsToolbar;