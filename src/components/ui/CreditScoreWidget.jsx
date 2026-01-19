import React from 'react';
import Icon from '../AppIcon';

const CreditScoreWidget = ({ score = 0, trend = 'stable', compact = false }) => {
  const getScoreColor = () => {
    if (score >= 750) return 'text-success';
    if (score >= 650) return 'text-warning';
    return 'text-error';
  };

  const getScoreBgColor = () => {
    if (score >= 750) return 'bg-success/10';
    if (score >= 650) return 'bg-warning/10';
    return 'bg-error/10';
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return { name: 'TrendingUp', color: 'var(--color-success)' };
      case 'down':
        return { name: 'TrendingDown', color: 'var(--color-error)' };
      default:
        return { name: 'Minus', color: 'var(--color-muted-foreground)' };
    }
  };

  const trendIcon = getTrendIcon();

  if (compact) {
    return (
      <div className="flex items-center space-x-2">
        <div className={`${getScoreBgColor()} rounded-md px-3 py-1.5 flex items-center space-x-2`}>
          <span className={`font-mono font-semibold text-lg ${getScoreColor()}`}>
            {score}
          </span>
          <Icon name={trendIcon?.name} size={16} color={trendIcon?.color} />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg shadow-elevation-2 p-4 transition-smooth hover-lift">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-caption text-muted-foreground">Credit Score</span>
        <Icon name={trendIcon?.name} size={20} color={trendIcon?.color} />
      </div>
      <div className="flex items-baseline space-x-2">
        <span className={`font-mono font-bold text-3xl ${getScoreColor()}`}>
          {score}
        </span>
        <span className="text-sm font-caption text-muted-foreground">/ 900</span>
      </div>
      <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
        <div 
          className={`h-full transition-smooth ${
            score >= 750 ? 'bg-success' : score >= 650 ? 'bg-warning' : 'bg-error'
          }`}
          style={{ width: `${(score / 900) * 100}%` }}
        />
      </div>
      <div className="mt-2 flex items-center justify-between text-xs font-caption text-muted-foreground">
        <span>Poor</span>
        <span>Fair</span>
        <span>Good</span>
        <span>Excellent</span>
      </div>
    </div>
  );
};

export default CreditScoreWidget;