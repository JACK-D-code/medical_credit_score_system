import React from 'react';
import Icon from '../../../components/AppIcon';

const KeyMetricsGrid = ({ metrics }) => {
  const getMetricIcon = (type) => {
    const icons = {
      visits: 'Activity',
      treatments: 'Stethoscope',
      loanEligible: 'CheckCircle',
      cashless: 'CreditCard'
    };
    return icons?.[type] || 'Info';
  };

  const getMetricColor = (type) => {
    const colors = {
      visits: 'from-primary/10 to-primary/5',
      treatments: 'from-secondary/10 to-secondary/5',
      loanEligible: 'from-success/10 to-success/5',
      cashless: 'from-accent/10 to-accent/5'
    };
    return colors?.[type] || 'from-muted to-muted/50';
  };

  const getIconColor = (type) => {
    const colors = {
      visits: 'text-primary',
      treatments: 'text-secondary',
      loanEligible: 'text-success',
      cashless: 'text-accent'
    };
    return colors?.[type] || 'text-muted-foreground';
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {metrics?.map((metric) => (
        <div
          key={metric?.id}
          className="bg-card rounded-xl p-6 shadow-elevation-2 hover:shadow-elevation-3 transition-all duration-250"
        >
          <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br ${getMetricColor(metric?.type)} flex items-center justify-center mb-4`}>
            <Icon name={getMetricIcon(metric?.type)} size={24} className={getIconColor(metric?.type)} />
          </div>

          <div className="mb-2">
            <h3 className="text-sm text-muted-foreground caption mb-1">
              {metric?.label}
            </h3>
            <p className="text-2xl md:text-3xl font-heading font-bold text-foreground data-text">
              {metric?.value}
            </p>
          </div>

          {metric?.description && (
            <p className="text-xs text-muted-foreground caption">
              {metric?.description}
            </p>
          )}

          {metric?.badge && (
            <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg mt-3 ${
              metric?.badge?.type === 'success' ? 'bg-success/10 text-success' :
              metric?.badge?.type === 'warning'? 'bg-warning/10 text-warning' : 'bg-muted text-muted-foreground'
            }`}>
              <Icon name={metric?.badge?.icon} size={12} />
              <span className="text-xs font-semibold">{metric?.badge?.text}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default KeyMetricsGrid;