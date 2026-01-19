import React from 'react';
import Icon from '../../../components/AppIcon';

const BillingSummary = ({ summary }) => {
  const formatINR = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    })?.format(amount);
  };

  const summaryCards = [
    {
      label: 'Total Medical Expenses',
      value: formatINR(summary?.totalExpenses),
      icon: 'IndianRupee',
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      label: 'Total Outstanding',
      value: formatINR(summary?.totalOutstanding),
      icon: 'AlertCircle',
      color: 'text-error',
      bgColor: 'bg-error/10'
    },
    {
      label: 'Average Payment Time',
      value: `${summary?.avgPaymentTime} days`,
      icon: 'Clock',
      color: 'text-warning',
      bgColor: 'bg-warning/10'
    },
    {
      label: 'Credit Score Impact',
      value: `+${summary?.creditScoreContribution} points`,
      icon: 'TrendingUp',
      color: 'text-success',
      bgColor: 'bg-success/10'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {summaryCards?.map((card, index) => (
        <div
          key={index}
          className="bg-card rounded-lg shadow-elevation-2 border border-border p-4 md:p-6 transition-smooth hover-lift"
        >
          <div className="flex items-start justify-between mb-3">
            <div className={`${card?.bgColor} rounded-md p-2`}>
              <Icon name={card?.icon} size={24} color={card?.color?.replace('text-', 'var(--color-')} />
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-2">{card?.label}</p>
          <p className={`font-mono font-bold text-2xl md:text-3xl ${card?.color}`}>
            {card?.value}
          </p>
        </div>
      ))}
    </div>
  );
};

export default BillingSummary;