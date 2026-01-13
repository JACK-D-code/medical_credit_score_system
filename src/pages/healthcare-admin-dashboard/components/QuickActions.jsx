import React from 'react';
import Button from '../../../components/ui/Button';

const QuickActions = ({ onAction }) => {
  const actions = [
    { id: 'payment-reminder', label: 'Send Payment Reminders', icon: 'Bell', variant: 'default' },
    { id: 'discount-update', label: 'Update Discount Eligibility', icon: 'Tag', variant: 'secondary' },
    { id: 'generate-report', label: 'Generate Report', icon: 'FileText', variant: 'outline' },
    { id: 'export-data', label: 'Export Data', icon: 'Download', variant: 'outline' }
  ];

  return (
    <div className="bg-card rounded-xl p-4 md:p-6 shadow-elevation-1 border border-border">
      <h3 className="text-base md:text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {actions?.map((action) => (
          <Button
            key={action?.id}
            variant={action?.variant}
            size="default"
            iconName={action?.icon}
            iconPosition="left"
            onClick={() => onAction(action?.id)}
            fullWidth
          >
            {action?.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;