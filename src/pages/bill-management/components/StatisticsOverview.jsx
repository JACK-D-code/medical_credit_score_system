import React from 'react';
import Icon from '../../../components/AppIcon';

const StatisticsOverview = ({ stats }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    })?.format(amount);
  };

  const statCards = [
    {
      label: 'Total Bills',
      value: stats?.totalBills,
      icon: 'FileText',
      color: 'primary',
      bgColor: 'bg-primary/10',
      textColor: 'text-primary'
    },
    {
      label: 'Total Amount',
      value: formatCurrency(stats?.totalAmount),
      icon: 'DollarSign',
      color: 'secondary',
      bgColor: 'bg-secondary/10',
      textColor: 'text-secondary'
    },
    {
      label: 'Paid Bills',
      value: stats?.paidBills,
      icon: 'CheckCircle2',
      color: 'success',
      bgColor: 'bg-success/10',
      textColor: 'text-success'
    },
    {
      label: 'Pending Bills',
      value: stats?.pendingBills,
      icon: 'Clock',
      color: 'warning',
      bgColor: 'bg-warning/10',
      textColor: 'text-warning'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
      {statCards?.map((stat, index) => (
        <div
          key={index}
          className="bg-card rounded-xl border border-border shadow-elevation-1 hover:shadow-elevation-2 transition-smooth p-4 md:p-5"
        >
          <div className="flex items-start justify-between mb-3">
            <div className={`w-10 h-10 md:w-12 md:h-12 rounded-lg ${stat?.bgColor} flex items-center justify-center`}>
              <Icon name={stat?.icon} size={24} color={`var(--color-${stat?.color})`} />
            </div>
          </div>
          <div>
            <p className="text-xs md:text-sm text-muted-foreground caption mb-1">{stat?.label}</p>
            <p className={`text-2xl md:text-3xl font-bold ${stat?.textColor} data-text`}>
              {stat?.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatisticsOverview;