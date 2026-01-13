import React from 'react';
import Icon from '../../../components/AppIcon';

const EligibilityThresholds = ({ currentScore, thresholds }) => {
  const getStatusIcon = (threshold) => {
    if (currentScore >= threshold?.minScore) return 'CheckCircle2';
    return 'XCircle';
  };

  const getStatusColor = (threshold) => {
    if (currentScore >= threshold?.minScore) return 'text-success';
    return 'text-muted-foreground';
  };

  const getProgressPercentage = (threshold) => {
    if (currentScore >= threshold?.minScore) return 100;
    return ((currentScore - 300) / (threshold?.minScore - 300)) * 100;
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <h3 className="text-lg md:text-xl lg:text-2xl font-heading font-semibold text-foreground">
        Eligibility Thresholds
      </h3>
      <div className="grid grid-cols-1 gap-4 md:gap-6">
        {thresholds?.map((threshold, index) => (
          <div
            key={index}
            className="bg-card border border-border rounded-xl p-4 md:p-6 hover:shadow-elevation-2 transition-all duration-250"
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-start gap-3 flex-1">
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-lg ${
                  currentScore >= threshold?.minScore ? 'bg-success/10' : 'bg-muted'
                } flex items-center justify-center flex-shrink-0`}>
                  <Icon
                    name={getStatusIcon(threshold)}
                    size={20}
                    color={currentScore >= threshold?.minScore ? 'var(--color-success)' : 'var(--color-muted-foreground)'}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-base md:text-lg font-heading font-semibold text-foreground mb-1">
                    {threshold?.name}
                  </h4>
                  <p className="text-sm md:text-base text-muted-foreground">
                    {threshold?.description}
                  </p>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className={`text-xl md:text-2xl font-heading font-bold ${getStatusColor(threshold)}`}>
                  {threshold?.minScore}+
                </div>
                <div className="text-xs md:text-sm text-muted-foreground caption">Required</div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="w-full bg-muted rounded-full h-2 md:h-3 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${
                    currentScore >= threshold?.minScore ? 'bg-success' : 'bg-primary'
                  }`}
                  style={{ width: `${Math.min(100, getProgressPercentage(threshold))}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs md:text-sm">
                <span className="text-muted-foreground">
                  Your Score: <span className="font-medium text-foreground">{currentScore}</span>
                </span>
                {currentScore < threshold?.minScore && (
                  <span className="text-muted-foreground">
                    Need: <span className="font-medium text-warning">{threshold?.minScore - currentScore} more points</span>
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                {threshold?.benefits?.map((benefit, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <Icon name="Check" size={16} className="text-success flex-shrink-0 mt-0.5" />
                    <span className="text-xs md:text-sm text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EligibilityThresholds;
