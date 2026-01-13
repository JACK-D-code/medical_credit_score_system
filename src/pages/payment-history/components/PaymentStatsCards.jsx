import React from 'react';
import Icon from '../../../components/AppIcon';

const PaymentStatsCards = ({ stats }) => {
  const cards = [
    {
      title: 'Total Payments',
      value: `$${stats?.totalAmount?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: 'DollarSign',
      iconBg: 'bg-emerald-500/10',
      iconColor: 'text-emerald-600',
      change: '+12.5%',
      changeType: 'positive'
    },
    {
      title: 'Completed Transactions',
      value: stats?.completedCount?.toString(),
      icon: 'CheckCircle',
      iconBg: 'bg-blue-500/10',
      iconColor: 'text-blue-600',
      change: '+8.2%',
      changeType: 'positive'
    },
    {
      title: 'Pending Payments',
      value: stats?.pendingCount?.toString(),
      icon: 'Clock',
      iconBg: 'bg-amber-500/10',
      iconColor: 'text-amber-600',
      change: '-3.1%',
      changeType: 'negative'
    },
    {
      title: 'Average Payment',
      value: `$${stats?.averageAmount?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: 'TrendingUp',
      iconBg: 'bg-violet-500/10',
      iconColor: 'text-violet-600',
      change: '+5.7%',
      changeType: 'positive'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
      {cards?.map((card, index) => (
        <div
          key={index}
          className="bg-card rounded-xl shadow-elevation-2 p-4 md:p-6 transition-smooth hover:shadow-elevation-3"
        >
          <div className="flex items-start justify-between mb-4">
            <div className={`w-12 h-12 md:w-14 md:h-14 rounded-lg ${card?.iconBg} flex items-center justify-center`}>
              <Icon name={card?.icon} size={24} className={card?.iconColor} />
            </div>
            <span
              className={`text-xs md:text-sm font-medium px-2 py-1 rounded-full ${
                card?.changeType === 'positive' ?'bg-emerald-500/10 text-emerald-600' :'bg-red-500/10 text-red-600'
              }`}
            >
              {card?.change}
            </span>
          </div>
          <h3 className="text-sm md:text-base text-muted-foreground caption mb-2">
            {card?.title}
          </h3>
          <p className="text-2xl md:text-3xl font-heading font-semibold text-foreground">
            {card?.value}
          </p>
        </div>
      ))}
    </div>
  );
};

export default PaymentStatsCards;