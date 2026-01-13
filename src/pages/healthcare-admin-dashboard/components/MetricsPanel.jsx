import React from 'react';
import Icon from '../../../components/AppIcon';

const MetricsPanel = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {metrics?.map((metric) => (
        <div
          key={metric?.id}
          className="bg-card rounded-xl p-4 md:p-6 shadow-elevation-1 border border-border"
        >
          <div className="flex items-start justify-between mb-3">
            <div className={`w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center ${metric?.iconBg}`}>
              <Icon name={metric?.icon} size={20} color={metric?.iconColor} />
            </div>
            <div className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${
              metric?.trend === 'up' ? 'bg-success/10 text-success' : 
              metric?.trend === 'down'? 'bg-error/10 text-error' : 'bg-muted text-muted-foreground'
            }`}>
              <Icon 
                name={metric?.trend === 'up' ? 'TrendingUp' : metric?.trend === 'down' ? 'TrendingDown' : 'Minus'} 
                size={14} 
              />
              <span>{metric?.change}</span>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-xs md:text-sm text-muted-foreground caption">{metric?.label}</p>
            <p className="text-2xl md:text-3xl font-semibold text-foreground data-text">{metric?.value}</p>
            {metric?.subtitle && (
              <p className="text-xs text-muted-foreground caption">{metric?.subtitle}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MetricsPanel;