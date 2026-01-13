import React from 'react';
import Icon from '../../../components/AppIcon';


const QuickActionsPanel = ({ onAction }) => {
  const actions = [
    {
      id: 'record-payment',
      label: 'Record Payment',
      description: 'Log a new payment transaction',
      icon: 'DollarSign',
      color: 'from-primary/10 to-primary/5',
      iconColor: 'text-primary'
    },
    {
      id: 'add-bill',
      label: 'Add Bill',
      description: 'Upload new medical bill',
      icon: 'FileText',
      color: 'from-secondary/10 to-secondary/5',
      iconColor: 'text-secondary'
    },
    {
      id: 'payment-plan',
      label: 'Payment Plan',
      description: 'Set up installment plan',
      icon: 'Calendar',
      color: 'from-accent/10 to-accent/5',
      iconColor: 'text-accent'
    },
    {
      id: 'credit-report',
      label: 'Credit Report',
      description: 'Download detailed report',
      icon: 'Download',
      color: 'from-success/10 to-success/5',
      iconColor: 'text-success'
    }
  ];

  return (
    <div className="bg-card rounded-xl p-6 md:p-8 shadow-elevation-2">
      <div className="mb-6">
        <h2 className="text-lg md:text-xl font-heading font-semibold text-foreground mb-1">
          Quick Actions
        </h2>
        <p className="text-sm text-muted-foreground caption">
          Frequently used features
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {actions?.map((action) => (
          <button
            key={action?.id}
            onClick={() => onAction(action?.id)}
            className="text-left p-4 rounded-xl border-2 border-border hover:border-primary/50 hover:shadow-elevation-2 transition-all duration-250 group"
          >
            <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${action?.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-250`}>
              <Icon name={action?.icon} size={24} className={action?.iconColor} />
            </div>
            <h3 className="text-sm font-semibold text-foreground mb-1">
              {action?.label}
            </h3>
            <p className="text-xs text-muted-foreground caption">
              {action?.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActionsPanel;