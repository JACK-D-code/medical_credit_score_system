import React from 'react';
import Icon from '../../../components/AppIcon';

const ScoreRing = ({ score = 0, maxScore = 1000, trend = 'stable', changeAmount = 0 }) => {
  const percentage = (score / maxScore) * 100;
  const circumference = 2 * Math.PI * 90;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getScoreColor = () => {
    if (score >= 750) return 'var(--color-success)';
    if (score >= 500) return 'var(--color-warning)';
    return 'var(--color-error)';
  };

  const getScoreLabel = () => {
    if (score >= 750) return 'Excellent';
    if (score >= 500) return 'Good';
    return 'Fair';
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

  return (
    <div className="flex flex-col items-center justify-center p-6 md:p-8 lg:p-10">
      <div className="relative w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64">
        <svg className="transform -rotate-90 w-full h-full">
          <circle
            cx="50%"
            cy="50%"
            r="90"
            stroke="var(--color-muted)"
            strokeWidth="12"
            fill="none"
          />
          <circle
            cx="50%"
            cy="50%"
            r="90"
            stroke={getScoreColor()}
            strokeWidth="12"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-smooth"
          />
        </svg>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl md:text-6xl lg:text-7xl font-mono font-bold" style={{ color: getScoreColor() }}>
            {score}
          </span>
          <span className="text-sm md:text-base text-muted-foreground font-caption mt-1">
            out of {maxScore}
          </span>
          <span className="text-xs md:text-sm font-medium mt-2" style={{ color: getScoreColor() }}>
            {getScoreLabel()}
          </span>
        </div>
      </div>
      <div className="flex items-center space-x-2 mt-4 md:mt-6">
        <Icon name={trendIcon?.name} size={20} color={trendIcon?.color} />
        <span className="text-sm md:text-base font-caption text-muted-foreground">
          {trend === 'up' ? '+' : trend === 'down' ? '-' : ''}{Math.abs(changeAmount)} points this month
        </span>
      </div>
    </div>
  );
};

export default ScoreRing;