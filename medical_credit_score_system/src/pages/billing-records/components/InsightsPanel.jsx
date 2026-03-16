import React from 'react';
import Icon from '../../../components/AppIcon';

const InsightsPanel = ({ insights }) => {
  if (!insights || insights.length === 0) return null;

  return (
    <div className="bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent border border-indigo-500/20 rounded-xl p-6 mb-8 relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <Icon name="Activity" size={64} color="var(--color-primary)" />
      </div>
      
      <div className="flex items-center space-x-3 mb-6 relative z-10">
        <div className="bg-indigo-500 rounded-full p-2 shadow-lg shadow-indigo-500/40">
          <Icon name="Cpu" size={20} color="white" />
        </div>
        <h3 className="text-xl font-heading font-bold text-foreground">AI-Driven Financial Insights</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        {insights.map((insight, index) => (
          <div key={index} className="flex items-start space-x-4 p-4 bg-card/40 backdrop-blur-sm rounded-lg border border-border/50 hover:border-indigo-500/30 transition-all hover:bg-card/60">
            <div className="mt-1 bg-indigo-100 dark:bg-indigo-900/30 rounded-full p-1.5 flex-shrink-0">
              <Icon name="Lightbulb" size={14} color="var(--color-indigo-500)" />
            </div>
            <p className="text-sm font-medium text-foreground/80 leading-relaxed">
              {insight}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-border/20 pt-4 relative z-10">
        <div className="flex items-center space-x-2">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Engine Status:</span>
          <span className="text-[10px] font-bold text-emerald-500 uppercase flex items-center">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5 animate-pulse"></span>
            Optimized
          </span>
        </div>
        <button className="text-xs font-bold text-primary hover:underline transition-all flex items-center space-x-1">
          <span>View Detailed Forecast</span>
          <Icon name="ChevronRight" size={12} />
        </button>
      </div>
    </div>
  );
};

export default InsightsPanel;
