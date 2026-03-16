import React from 'react';
import Icon from '../../../components/AppIcon';

const ScoreTimeline = ({ events }) => {
  const getEventIcon = (type) => {
    switch (type) {
      case 'payment':
        return { name: 'CreditCard', color: 'var(--color-success)' };
      case 'bill':
        return { name: 'Receipt', color: 'var(--color-primary)' };
      case 'delay':
        return { name: 'AlertCircle', color: 'var(--color-error)' };
      case 'visit':
        return { name: 'Activity', color: 'var(--color-warning)' };
      default:
        return { name: 'Circle', color: 'var(--color-muted-foreground)' };
    }
  };

  const getImpactBadge = (impact) => {
    if (impact > 0) {
      return (
        <span className="bg-success/10 text-success text-xs font-caption font-medium px-2 py-1 rounded">
          +{impact} points
        </span>
      );
    } else if (impact < 0) {
      return (
        <span className="bg-error/10 text-error text-xs font-caption font-medium px-2 py-1 rounded">
          {impact} points
        </span>
      );
    }
    return null;
  };

  return (
    <div className="bg-card rounded-lg shadow-elevation-2 p-4 md:p-6">
      <h3 className="font-heading font-semibold text-lg md:text-xl text-foreground mb-6">Score Change Timeline</h3>
      <div className="space-y-6">
        {events?.map((event, index) => {
          const icon = getEventIcon(event?.type);
          const isLast = index === events?.length - 1;

          return (
            <div key={event?.id} className="relative">
              <div className="flex items-start space-x-4">
                <div className="relative flex-shrink-0">
                  <div 
                    className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${icon?.color}15` }}
                  >
                    <Icon name={icon?.name} size={20} color={icon?.color} />
                  </div>
                  {!isLast && (
                    <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-border" />
                  )}
                </div>

                <div className="flex-1 min-w-0 pb-6">
                  <div className="flex items-start justify-between mb-2 flex-wrap gap-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-heading font-semibold text-sm md:text-base text-foreground mb-1">
                        {event?.title}
                      </h4>
                      <p className="text-xs md:text-sm text-muted-foreground">{event?.date}</p>
                    </div>
                    {getImpactBadge(event?.impact)}
                  </div>
                  <p className="text-xs md:text-sm text-foreground leading-relaxed">{event?.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ScoreTimeline;