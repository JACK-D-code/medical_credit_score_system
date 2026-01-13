import React from 'react';

const ScoreGauge = ({ score, maxScore = 850, change, changeType }) => {
  const percentage = (score / maxScore) * 100;
  const rotation = (percentage / 100) * 180 - 90;

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
    <div className="flex flex-col items-center gap-4 md:gap-6 lg:gap-8">
      <div className="relative w-48 h-24 md:w-56 md:h-28 lg:w-64 lg:h-32">
        <svg className="w-full h-full" viewBox="0 0 200 100">
          <path
            d="M 20 80 A 80 80 0 0 1 180 80"
            fill="none"
            stroke="var(--color-muted)"
            strokeWidth="12"
            strokeLinecap="round"
          />
          <path
            d="M 20 80 A 80 80 0 0 1 180 80"
            fill="none"
            stroke={score >= 750 ? 'var(--color-success)' : score >= 650 ? 'var(--color-warning)' : 'var(--color-error)'}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={`${percentage * 2.51} 251`}
            className="transition-all duration-1000"
          />
          <line
            x1="100"
            y1="80"
            x2="100"
            y2="30"
            stroke="var(--color-foreground)"
            strokeWidth="3"
            strokeLinecap="round"
            transform={`rotate(${rotation} 100 80)`}
            className="transition-transform duration-1000"
          />
          <circle cx="100" cy="80" r="6" fill="var(--color-foreground)" />
        </svg>
        <div className="absolute inset-0 flex items-end justify-center pb-2">
          <div className="text-center">
            <div className={`text-3xl md:text-4xl lg:text-5xl font-heading font-bold ${getScoreColor(score)}`}>
              {score}
            </div>
            <div className="text-xs md:text-sm text-muted-foreground caption">out of {maxScore}</div>
          </div>
        </div>
      </div>

      <div className="text-center space-y-2">
        <div className={`text-lg md:text-xl lg:text-2xl font-heading font-semibold ${getScoreColor(score)}`}>
          {getScoreLabel(score)}
        </div>
        {change !== undefined && (
          <div className={`flex items-center justify-center gap-2 text-sm md:text-base ${changeType === 'increase' ? 'text-success' : 'text-error'}`}>
            <span>{changeType === 'increase' ? '↑' : '↓'}</span>
            <span className="font-medium">{Math.abs(change)} points</span>
            <span className="text-muted-foreground">this month</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScoreGauge;