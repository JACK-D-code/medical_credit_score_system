import React from 'react';
import Icon from '../../../components/AppIcon';

const MetricsPanel = ({ metrics = [] }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    })?.format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-IN')?.format(num);
  };

  const getIconColor = (type) => {
    switch (type) {
      case 'total':
        return 'var(--color-primary)';
      case 'outstanding':
        return 'var(--color-warning)';
      case 'payment':
        return 'var(--color-success)';
      case 'visits':
        return 'var(--color-accent)';
      default:
        return 'var(--color-muted-foreground)';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {metrics?.map((metric, index) => (
        <div
          key={index}
          className="bg-card rounded-lg shadow-elevation-2 p-4 md:p-6 hover-lift transition-smooth"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <p className="text-sm md:text-base font-caption text-muted-foreground mb-1">
                {metric?.label}
              </p>
              <p className="text-xl md:text-2xl lg:text-3xl font-mono font-bold text-foreground">
                {metric?.isCurrency ? formatCurrency(metric?.value) : 
                 metric?.isPercentage ? `${metric?.value}%` : 
                 formatNumber(metric?.value)}
              </p>
            </div>
            <div 
              className="w-10 h-10 md:w-12 md:h-12 rounded-md flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: `${getIconColor(metric?.type)}15` }}
            >
              <Icon 
                name={metric?.icon} 
                size={20} 
                color={getIconColor(metric?.type)} 
              />
            </div>
          </div>

          {metric?.trend && (
            <div className="flex items-center space-x-2">
              <Icon 
                name={metric?.trend === 'up' ? 'TrendingUp' : 'TrendingDown'} 
                size={16} 
                color={metric?.trend === 'up' ? 'var(--color-success)' : 'var(--color-error)'}
              />
              <span 
                className="text-xs md:text-sm font-caption"
                style={{ 
                  color: metric?.trend === 'up' ? 'var(--color-success)' : 'var(--color-error)' 
                }}
              >
                {metric?.trendValue}
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MetricsPanel;