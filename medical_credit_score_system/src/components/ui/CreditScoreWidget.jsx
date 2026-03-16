import React from 'react';
import Icon from '../AppIcon';

const CreditScoreWidget = ({ score = 0, trend = 'stable', compact = false }) => {
  const getScoreCategory = () => {
    if (score >= 800) return 'Excellent';
    if (score >= 650) return 'Good';
    if (score >= 500) return 'Fair';
    return 'Poor';
  };

  const getScoreColor = () => {
    if (score >= 800) return 'text-emerald-500';
    if (score >= 650) return 'text-blue-500';
    if (score >= 500) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreBgColor = () => {
    if (score >= 800) return 'bg-emerald-500/10';
    if (score >= 650) return 'bg-blue-500/10';
    if (score >= 500) return 'bg-yellow-500/10';
    return 'bg-red-500/10';
  };

  const getBarColor = () => {
    if (score >= 800) return 'bg-emerald-500';
    if (score >= 650) return 'bg-blue-500';
    if (score >= 500) return 'bg-yellow-500';
    return 'bg-red-500';
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
        <div className={`${getScoreBgColor()} rounded-md px-3 py-1.5 flex items-center space-x-2 border ${getScoreColor().replace('text-', 'border-')}/20`}>
          <span className={`font-mono font-semibold text-lg ${getScoreColor()}`}>
            {score}
          </span>
          <Icon name={trendIcon?.name} size={16} color={trendIcon?.color} />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg shadow-elevation-2 p-5 transition-smooth hover-lift border border-border">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-caption text-muted-foreground uppercase tracking-wider font-semibold">Medical Credit Score</span>
        <Icon name={trendIcon?.name} size={20} color={trendIcon?.color} />
      </div>
      <div className="flex items-end justify-between mb-4">
        <div className="flex items-baseline space-x-2">
          <span className={`font-mono font-black text-4xl tracking-tighter ${getScoreColor()}`}>
            {score}
          </span>
          <span className="text-sm font-caption text-muted-foreground font-semibold">/ 900</span>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${getScoreBgColor()} ${getScoreColor()} border ${getScoreColor().replace('text-', 'border-')}/30`}>
          {getScoreCategory()}
        </div>
      </div>
      <div className="relative mt-2 h-3 bg-muted rounded-full overflow-hidden border border-border/50">
        <div 
          className={`absolute top-0 left-0 h-full transition-all duration-1000 ease-out ${getBarColor()}`}
          style={{ width: `${Math.min((score / 900) * 100, 100)}%` }}
        />
      </div>
      <div className="mt-3 flex items-center justify-between text-[10px] sm:text-xs font-caption text-muted-foreground font-semibold uppercase tracking-wider">
        <span className={score < 500 ? 'text-red-500 font-bold' : ''}>Poor</span>
        <span className={score >= 500 && score < 650 ? 'text-yellow-500 font-bold' : ''}>Fair</span>
        <span className={score >= 650 && score < 800 ? 'text-blue-500 font-bold' : ''}>Good</span>
        <span className={score >= 800 ? 'text-emerald-500 font-bold' : ''}>Excellent</span>
      </div>
    </div>
  );
};

export default CreditScoreWidget;