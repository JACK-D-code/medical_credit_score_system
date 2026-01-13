import React from 'react';
import Icon from '../../../components/AppIcon';

const FactorBreakdown = ({ factors }) => {
  const getImpactColor = (impact) => {
    if (impact >= 80) return 'text-success';
    if (impact >= 60) return 'text-warning';
    return 'text-error';
  };

  const getImpactBgColor = (impact) => {
    if (impact >= 80) return 'bg-success/10';
    if (impact >= 60) return 'bg-warning/10';
    return 'bg-error/10';
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <h3 className="text-lg md:text-xl lg:text-2xl font-heading font-semibold text-foreground">
        Score Factors Breakdown
      </h3>
      <div className="grid grid-cols-1 gap-4 md:gap-6">
        {factors?.map((factor, index) => (
          <div
            key={index}
            className="bg-card border border-border rounded-xl p-4 md:p-6 hover:shadow-elevation-2 transition-all duration-250"
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-start gap-3 flex-1">
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-lg ${getImpactBgColor(factor?.impact)} flex items-center justify-center flex-shrink-0`}>
                  <Icon name={factor?.icon} size={20} color={factor?.impact >= 80 ? 'var(--color-success)' : factor?.impact >= 60 ? 'var(--color-warning)' : 'var(--color-error)'} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-base md:text-lg font-heading font-semibold text-foreground mb-1">
                    {factor?.name}
                  </h4>
                  <p className="text-sm md:text-base text-muted-foreground">
                    {factor?.description}
                  </p>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className={`text-2xl md:text-3xl font-heading font-bold ${getImpactColor(factor?.impact)}`}>
                  {factor?.impact}%
                </div>
                <div className="text-xs md:text-sm text-muted-foreground caption">Weight</div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="w-full bg-muted rounded-full h-2 md:h-3 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${
                    factor?.impact >= 80 ? 'bg-success' : factor?.impact >= 60 ? 'bg-warning' : 'bg-error'
                  }`}
                  style={{ width: `${factor?.impact}%` }}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-2">
                  <Icon name="TrendingUp" size={16} className="text-muted-foreground" />
                  <span className="text-xs md:text-sm text-muted-foreground">
                    Current: <span className="font-medium text-foreground">{factor?.current}</span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="Target" size={16} className="text-muted-foreground" />
                  <span className="text-xs md:text-sm text-muted-foreground">
                    Target: <span className="font-medium text-foreground">{factor?.target}</span>
                  </span>
                </div>
              </div>

              {factor?.recommendation && (
                <div className="mt-3 p-3 bg-primary/5 border border-primary/20 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Icon name="Lightbulb" size={16} className="text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-xs md:text-sm text-foreground">
                      <span className="font-medium">Recommendation: </span>
                      {factor?.recommendation}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FactorBreakdown;