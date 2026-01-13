import React from 'react';
import Icon from '../../../components/AppIcon';

const ComparisonMetrics = ({ currentScore, comparisons }) => {
  return (
    <div className="bg-card border border-border rounded-xl p-4 md:p-6 lg:p-8 space-y-4 md:space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-secondary/10 flex items-center justify-center">
          <Icon name="BarChart3" size={20} color="var(--color-secondary)" />
        </div>
        <div>
          <h3 className="text-lg md:text-xl lg:text-2xl font-heading font-semibold text-foreground">
            Score Comparison
          </h3>
          <p className="text-sm md:text-base text-muted-foreground">
            How you compare to others
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {comparisons?.map((comparison, index) => (
          <div
            key={index}
            className="p-4 md:p-5 bg-muted rounded-xl space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm md:text-base font-medium text-foreground">
                {comparison?.category}
              </span>
              <Icon name={comparison?.icon} size={20} className="text-muted-foreground" />
            </div>

            <div className="space-y-2">
              <div className="flex items-end justify-between">
                <span className="text-xs md:text-sm text-muted-foreground">Average</span>
                <span className="text-lg md:text-xl font-heading font-bold text-foreground">
                  {comparison?.average}
                </span>
              </div>

              <div className="w-full bg-background rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-1000"
                  style={{ width: `${(comparison?.average / 850) * 100}%` }}
                />
              </div>
            </div>

            <div className="pt-2 border-t border-border">
              <div className="flex items-center justify-between text-xs md:text-sm">
                <span className="text-muted-foreground">Your Score</span>
                <span className={`font-semibold ${
                  currentScore > comparison?.average ? 'text-success' : 'text-warning'
                }`}>
                  {currentScore > comparison?.average ? 'Above' : 'Below'} Average
                </span>
              </div>
              <div className="mt-1 text-xs md:text-sm text-muted-foreground">
                Difference: <span className={`font-medium ${
                  currentScore > comparison?.average ? 'text-success' : 'text-warning'
                }`}>
                  {currentScore > comparison?.average ? '+' : ''}{currentScore - comparison?.average} points
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComparisonMetrics;