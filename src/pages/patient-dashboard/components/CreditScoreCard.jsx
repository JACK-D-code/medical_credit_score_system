import React from 'react';
import Icon from '../../../components/AppIcon';

const CreditScoreCard = ({ score, change, maxScore = 850 }) => {
  const percentage = (score / maxScore) * 100;
  const isPositive = change >= 0;
  
  const getScoreColor = (score) => {
    if (score >= 750) return 'text-success';
    if (score >= 650) return 'text-warning';
    return 'text-error';
  };

  const getScoreLabel = (score) => {
    if (score >= 750) return 'Excellent';
    if (score >= 650) return 'Good';
    if (score >= 550) return 'Fair';
    return 'Poor';
  };

  return (
    <div className="bg-card rounded-xl p-6 md:p-8 shadow-elevation-2">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-lg md:text-xl font-heading font-semibold text-foreground mb-1">
            Medical Credit Score
          </h2>
          <p className="text-sm text-muted-foreground caption">
            Updated: {new Date()?.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
        <div className={`flex items-center gap-1 px-3 py-1 rounded-lg ${isPositive ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}>
          <Icon name={isPositive ? 'TrendingUp' : 'TrendingDown'} size={16} />
          <span className="text-sm font-semibold data-text">
            {isPositive ? '+' : ''}{change}
          </span>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-8">
        <div className="relative w-40 h-40 md:w-48 md:h-48">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
            <circle
              cx="100"
              cy="100"
              r="85"
              fill="none"
              stroke="var(--color-muted)"
              strokeWidth="12"
            />
            <circle
              cx="100"
              cy="100"
              r="85"
              fill="none"
              stroke={score >= 750 ? 'var(--color-success)' : score >= 650 ? 'var(--color-warning)' : 'var(--color-error)'}
              strokeWidth="12"
              strokeDasharray={`${percentage * 5.34} 534`}
              strokeLinecap="round"
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-4xl md:text-5xl font-heading font-bold ${getScoreColor(score)}`}>
              {score}
            </span>
            <span className="text-sm text-muted-foreground caption mt-1">
              out of {maxScore}
            </span>
          </div>
        </div>

        <div className="flex-1 w-full">
          <div className="flex items-center justify-between mb-3">
            <span className={`text-xl md:text-2xl font-heading font-semibold ${getScoreColor(score)}`}>
              {getScoreLabel(score)}
            </span>
            <span className="text-sm text-muted-foreground caption">
              {Math.round(percentage)}%
            </span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-success flex-shrink-0" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-foreground">Excellent</span>
                  <span className="text-xs text-muted-foreground caption">750-850</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className={`h-full bg-success transition-all duration-500 ${score >= 750 ? 'w-full' : 'w-0'}`} />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-warning flex-shrink-0" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-foreground">Good</span>
                  <span className="text-xs text-muted-foreground caption">650-749</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className={`h-full bg-warning transition-all duration-500 ${score >= 650 && score < 750 ? 'w-full' : 'w-0'}`} />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-error flex-shrink-0" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-foreground">Fair/Poor</span>
                  <span className="text-xs text-muted-foreground caption">&lt;650</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className={`h-full bg-error transition-all duration-500 ${score < 650 ? 'w-full' : 'w-0'}`} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditScoreCard;