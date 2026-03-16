import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ImprovementRecommendation = ({ title, description, impact, actionLabel, priority, icon }) => {
  const getPriorityColor = () => {
    if (priority === 'high') return 'var(--color-error)';
    if (priority === 'medium') return 'var(--color-warning)';
    return 'var(--color-success)';
  };

  const getPriorityBg = () => {
    if (priority === 'high') return 'bg-error/10';
    if (priority === 'medium') return 'bg-warning/10';
    return 'bg-success/10';
  };

  const getPriorityLabel = () => {
    if (priority === 'high') return 'High Impact';
    if (priority === 'medium') return 'Medium Impact';
    return 'Low Impact';
  };

  return (
    <div className="bg-card rounded-lg shadow-elevation-2 p-4 md:p-6 transition-smooth hover-lift">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-3 flex-1">
          <div className={`w-10 h-10 md:w-12 md:h-12 rounded-md flex items-center justify-center flex-shrink-0 ${getPriorityBg()}`}>
            <Icon name={icon} size={24} color={getPriorityColor()} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-heading font-semibold text-base md:text-lg text-foreground mb-2">{title}</h3>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-3">{description}</p>
            <div className="flex items-center space-x-2 mb-4">
              <span className={`text-xs md:text-sm font-caption font-medium px-2 py-1 rounded ${getPriorityBg()}`} style={{ color: getPriorityColor() }}>
                {getPriorityLabel()}
              </span>
              <span className="text-xs md:text-sm text-muted-foreground">+{impact} points potential</span>
            </div>
          </div>
        </div>
      </div>
      
      <Button variant="outline" size="sm" iconName="ArrowRight" iconPosition="right" fullWidth className="mt-2">
        {actionLabel}
      </Button>
    </div>
  );
};

export default ImprovementRecommendation;