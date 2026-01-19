import React from 'react';
import Icon from '../../../components/AppIcon';

const ActivityTimelineSection = ({ activities }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'profile_update':
        return { name: 'Edit', color: 'var(--color-primary)' };
      case 'login':
        return { name: 'LogIn', color: 'var(--color-success)' };
      case 'security':
        return { name: 'Shield', color: 'var(--color-warning)' };
      case 'document':
        return { name: 'Upload', color: 'var(--color-accent)' };
      default:
        return { name: 'Activity', color: 'var(--color-muted-foreground)' };
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    return date?.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div className="bg-card rounded-lg shadow-elevation-2 p-4 md:p-6 lg:p-8 transition-smooth">
      <div className="flex items-center space-x-3 mb-4 md:mb-6">
        <div className="w-10 h-10 md:w-12 md:h-12 bg-warning/10 rounded-md flex items-center justify-center">
          <Icon name="Activity" size={24} color="var(--color-warning)" />
        </div>
        <div>
          <h2 className="text-xl md:text-2xl font-heading font-semibold text-foreground">Recent Activity</h2>
          <p className="text-sm text-muted-foreground">Your account activity history</p>
        </div>
      </div>
      <div className="space-y-4">
        {activities?.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="Clock" size={48} color="var(--color-muted-foreground)" className="mx-auto mb-3" />
            <p className="text-muted-foreground">No recent activity</p>
          </div>
        ) : (
          <div className="relative">
            <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-border" />
            
            <div className="space-y-6">
              {activities?.map((activity, index) => {
                const icon = getActivityIcon(activity?.type);
                
                return (
                  <div key={activity?.id} className="relative pl-12">
                    <div className="absolute left-0 top-0 w-10 h-10 bg-card border-2 border-border rounded-full flex items-center justify-center">
                      <Icon name={icon?.name} size={18} color={icon?.color} />
                    </div>
                    <div className="bg-muted rounded-lg p-4 transition-smooth hover:shadow-elevation-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-sm md:text-base font-heading font-semibold text-foreground">{activity?.title}</h3>
                        <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                          {formatTimestamp(activity?.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{activity?.description}</p>
                      {activity?.metadata && (
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          {activity?.metadata?.device && (
                            <div className="flex items-center space-x-1">
                              <Icon name="Monitor" size={12} color="currentColor" />
                              <span>{activity?.metadata?.device}</span>
                            </div>
                          )}
                          {activity?.metadata?.location && (
                            <div className="flex items-center space-x-1">
                              <Icon name="MapPin" size={12} color="currentColor" />
                              <span>{activity?.metadata?.location}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityTimelineSection;