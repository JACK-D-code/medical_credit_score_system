import React from 'react';
import Icon from '../../../components/AppIcon';

const ScoreBreakdownCard = ({ factor, score, maxScore, weight, trend, description, icon, color }) => {
  const percentage = (score / maxScore) * 100;
  
  const getTrendIcon = () => {
    if (trend === 'up') return { name: 'TrendingUp', color: 'var(--color-success)' };
    if (trend === 'down') return { name: 'TrendingDown', color: 'var(--color-error)' };
    return { name: 'Minus', color: 'var(--color-muted-foreground)' };
  };

  const trendIcon = getTrendIcon();

  return (
    <div className="bg-card rounded-lg shadow-elevation-2 p-4 md:p-6 transition-smooth hover-lift">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 md:w-12 md:h-12 rounded-md flex items-center justify-center`} style={{ backgroundColor: `${color}15` }}>
            <Icon name={icon} size={24} color={color} />
          </div>
          <div>
            <h3 className="font-heading font-semibold text-base md:text-lg text-foreground">{factor}</h3>
            <p className="text-xs md:text-sm text-muted-foreground">Weight: {weight}%</p>
          </div>
        </div>
        <Icon name={trendIcon?.name} size={20} color={trendIcon?.color} />
      </div>
      <div className="mb-4">
        <div className="flex items-baseline justify-between mb-2">
          <span className="font-mono font-bold text-2xl md:text-3xl" style={{ color }}>{score}</span>
          <span className="text-sm md:text-base text-muted-foreground">/ {maxScore}</span>
        </div>
        
        <div className="h-2 md:h-3 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full transition-smooth"
            style={{ width: `${percentage}%`, backgroundColor: color }}
          />
        </div>
      </div>
      <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
};

export default ScoreBreakdownCard;