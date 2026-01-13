import React from 'react';
import Icon from '../../../components/AppIcon';

const HistoricalSnapshots = ({ snapshots }) => {
  const getScoreChangeIcon = (change) => {
    if (change > 0) return 'TrendingUp';
    if (change < 0) return 'TrendingDown';
    return 'Minus';
  };

  const getScoreChangeColor = (change) => {
    if (change > 0) return 'text-success';
    if (change < 0) return 'text-error';
    return 'text-muted-foreground';
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <h3 className="text-lg md:text-xl lg:text-2xl font-heading font-semibold text-foreground">
        Historical Snapshots
      </h3>
      <div className="space-y-4">
        {snapshots?.map((snapshot, index) => (
          <div
            key={index}
            className="bg-card border border-border rounded-xl p-4 md:p-6 hover:shadow-elevation-2 transition-all duration-250"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-4 flex-1">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <div className="text-center">
                    <div className="text-lg md:text-xl font-heading font-bold text-primary">
                      {snapshot?.month}
                    </div>
                    <div className="text-xs text-muted-foreground caption">{snapshot?.year}</div>
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl md:text-3xl font-heading font-bold text-foreground">
                      {snapshot?.score}
                    </span>
                    {snapshot?.change !== 0 && (
                      <div className={`flex items-center gap-1 ${getScoreChangeColor(snapshot?.change)}`}>
                        <Icon name={getScoreChangeIcon(snapshot?.change)} size={16} />
                        <span className="text-sm md:text-base font-medium">
                          {snapshot?.change > 0 ? '+' : ''}{snapshot?.change}
                        </span>
                      </div>
                    )}
                  </div>

                  {snapshot?.event && (
                    <div className="flex items-start gap-2 p-3 bg-muted rounded-lg">
                      <Icon name="Info" size={16} className="text-primary flex-shrink-0 mt-0.5" />
                      <p className="text-xs md:text-sm text-foreground">{snapshot?.event}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 md:flex-col md:items-end">
                {snapshot?.highlights?.map((highlight, idx) => (
                  <div
                    key={idx}
                    className="px-3 py-1.5 bg-primary/5 border border-primary/20 rounded-lg"
                  >
                    <span className="text-xs md:text-sm text-primary font-medium">{highlight}</span>
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

export default HistoricalSnapshots;