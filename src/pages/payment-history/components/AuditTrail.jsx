import React from 'react';
import Icon from '../../../components/AppIcon';

const AuditTrail = ({ auditLogs }) => {
  const getActivityIcon = (type) => {
    const iconMap = {
      payment: 'DollarSign',
      modification: 'Edit',
      dispute: 'AlertCircle',
      refund: 'RotateCcw',
      update: 'RefreshCw'
    };
    return iconMap?.[type] || 'Activity';
  };

  const getActivityColor = (type) => {
    const colorMap = {
      payment: 'text-emerald-600',
      modification: 'text-blue-600',
      dispute: 'text-amber-600',
      refund: 'text-violet-600',
      update: 'text-slate-600'
    };
    return colorMap?.[type] || 'text-slate-600';
  };

  return (
    <div className="bg-card rounded-xl shadow-elevation-2 p-4 md:p-6">
      <h2 className="text-xl md:text-2xl font-heading font-semibold text-foreground mb-6">
        Audit Trail
      </h2>
      <div className="space-y-4">
        {auditLogs?.map((log, index) => (
          <div
            key={log?.id}
            className="flex gap-4 pb-4 border-b border-border last:border-0 last:pb-0"
          >
            <div className={`flex-shrink-0 w-10 h-10 rounded-full bg-muted flex items-center justify-center ${getActivityColor(log?.type)}`}>
              <Icon name={getActivityIcon(log?.type)} size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="text-sm font-semibold text-foreground">{log?.action}</h3>
                <span className="text-xs text-muted-foreground caption whitespace-nowrap">
                  {new Date(log.timestamp)?.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{log?.description}</p>
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground caption">
                <span className="flex items-center gap-1">
                  <Icon name="User" size={12} />
                  {log?.performedBy}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Icon name="Calendar" size={12} />
                  {new Date(log.timestamp)?.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
                {log?.ipAddress && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Icon name="Globe" size={12} />
                      {log?.ipAddress}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AuditTrail;